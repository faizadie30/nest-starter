import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { GlobalHelper } from 'src/helpers/global.helper';
import { UserHelper } from 'src/helpers/user.helper';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
import { VerifyService } from 'src/verify/verify.service';
import { Repository } from 'typeorm';
import { RegisterDTO } from './dto/Register.dto';
import { Verify } from 'src/verify/entities/verify.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Verify) private verifyRepository: Repository<Verify>,
    private readonly userHelper: UserHelper,
    private readonly globalHelper: GlobalHelper,
    private readonly emailService: EmailService,
    private readonly verifyService: VerifyService,
  ) {}
  login() {
    return 'This action adds a new auth';
  }

  async register(registerDTO: RegisterDTO): Promise<object> {
    const { email } = registerDTO;

    const checkUserActive = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email LIKE :email', {
        email: `%${email}%`,
      })
      .andWhere('user.is_active = :is_active', {
        is_active: true,
      })
      .getExists();

    if (checkUserActive) {
      throw new ConflictException('User telah terdaftar');
    }

    const checkUserNotActive = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email LIKE :email', {
        email: `%${email}%`,
      })
      .andWhere('user.is_active = :is_active', {
        is_active: false,
      })
      .getExists();

    if (checkUserNotActive) {
      return await this.resendVerifyRegister(email);
    }

    return await this.createNewUser(registerDTO);
  }

  private async createNewUser(registerDTO: RegisterDTO): Promise<object> {
    const { email, full_name, gender, password, role, phone_number } =
      registerDTO;

    const user = new User();
    user.email = email;
    user.password = await this.userHelper.encryptPassword(password);
    user.role = role;

    const createUser = await this.userRepository.save(user);

    const profile = new Profile();
    profile.full_name = full_name;
    profile.gender = gender;
    profile.user = createUser;
    profile.phone_number = phone_number;

    await this.profileRepository.save(profile);

    createUser.profile = profile;
    await this.userRepository.save(createUser);

    // generate verification code
    const generateUrl = await this.verifyService.generateVerificationURL(
      createUser.id,
      email,
    );

    // send verification email
    await this.emailService.sendVerificationEmail(
      email,
      'Verifikasi Register',
      full_name,
      generateUrl['url'],
    );

    return {
      status: 'success',
      message:
        'Email verifikasi anda telah dikirim, mohon cek di spam atau kontak masuk',
    };
  }

  async resendVerifyRegister(email: string): Promise<object> {
    const getUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.email LIKE :email', {
        email: `%${email}%`,
      })
      .getOne();

    // generate verification code
    const generateUrl = await this.verifyService.generateVerificationURL(
      getUser.id,
      getUser['profile'].full_name,
    );

    await this.emailService.sendVerificationEmail(
      email,
      'Verifikasi Register',
      getUser['profile'].full_name,
      generateUrl['url'],
    );

    return {
      status: 'success',
      message:
        'Email verifikasi anda telah dikirim, mohon cek di spam atau kontak masuk',
    };
  }

  async verifyRegister(token: string): Promise<object> {
    const getDataToken = await this.verifyRepository
      .createQueryBuilder('verify')
      .where('verify.verification_code = :verification_code', {
        verification_code: token,
      })
      .getOneOrFail();

    if (!getDataToken) {
      throw new UnauthorizedException('token tidak valid');
    }

    const { user_id, expires_at } = getDataToken;

    const checkValidToken = await this.verifyService.verifyToken(
      parseInt(expires_at),
    );

    if (!checkValidToken) {
      throw new UnauthorizedException('token telah expired');
    }

    await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({ is_active: true })
      .where('id = :id', {
        id: user_id,
      })
      .execute();

    await this.verifyRepository
      .createQueryBuilder('verify')
      .delete()
      .from(Verify)
      .where('user_id = :user_id', {
        user_id: user_id,
      })
      .execute();

    return {
      status: 'success',
      message: 'user telah di verifikasi, anda sekarang dapat login',
    };
  }
}
