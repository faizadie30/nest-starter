import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserHelper } from 'src/helpers/user.helper';
import { FindAllDto } from './dto/find-all.dto';
import { GlobalHelper } from 'src/helpers/global.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly userHelper: UserHelper,
    private readonly globalHelper: GlobalHelper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<object> {
    const checkUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email LIKE :email', {
        email: `%${createUserDto.email}%`,
      })
      .orWhere('user.username LIKE :username', {
        username: `%${createUserDto.username}%`,
      })
      .getOne();

    if (checkUser) {
      throw new ConflictException('User already exists');
    }
    createUserDto.password = await this.userHelper.encrypPassword(
      createUserDto.password,
    );

    const newUser = await this.usersRepository.save(createUserDto);
    return {
      ...newUser,
      created_at: this.globalHelper.formatDateTime(newUser.created_at),
      updated_at: this.globalHelper.formatDateTime(newUser.updated_at),
    };
  }

  async findAll(findAllDto: FindAllDto): Promise<object> {
    try {
      const page = !this.globalHelper.convertToNumber(findAllDto.page)
        ? 1
        : this.globalHelper.convertToNumber(findAllDto.page);
      const limit = !this.globalHelper.convertToNumber(findAllDto.limit)
        ? 10
        : this.globalHelper.convertToNumber(findAllDto.limit);

      const [users, totalItems] = await this.usersRepository
        .createQueryBuilder('user')
        .where(
          'user.full_name LIKE :search OR user.email LIKE :search OR user.username LIKE :search',
          { search: `%${findAllDto.keywords}%` },
        )
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const totalPages = Math.ceil(totalItems / limit);

      return {
        success: true,
        data: !users
          ? []
          : users.map((user) => {
              console.log('user:', user);
              const userWithoutSensitiveFields = {
                id: user.id,
                full_name: user.full_name,
                username: user.username,
                email: user.email,
                created_at: this.globalHelper.formatDateTime(user.created_at),
                updated_at: this.globalHelper.formatDateTime(user.updated_at),
              };
              return userWithoutSensitiveFields;
            }),
        pagination: this.globalHelper.generatePagination(
          'users',
          page,
          limit,
          totalPages,
          totalItems,
        ),
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.username',
          'user.full_name',
          'user.email',
          'user.created_at',
          'user.updated_at',
        ])
        .where('user.id = :id', { id })
        .getOne();

      return {
        success: true,
        data: {
          ...user,
          created_at: this.globalHelper.formatDateTime(user.created_at),
          updated_at: this.globalHelper.formatDateTime(user.updated_at),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
