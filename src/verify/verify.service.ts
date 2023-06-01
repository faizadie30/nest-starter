import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalHelper } from 'src/helpers/global.helper';
import { Verify } from './entities/verify.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VerifyService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly globalHelper: GlobalHelper,
    @InjectRepository(Verify) private verifyRepository: Repository<Verify>,
  ) {}

  async generateVerificationURL(
    user_id: number,
    email: string,
  ): Promise<object> {
    const expires = new Date();
    const expireMinutes =
      expires.getMinutes() + process.env.VERIFY_TOKEN_LIMIT_TIME;
    expires.setMinutes(parseInt(expireMinutes));
    const expiresMs = expires.getTime();
    const token = this.globalHelper.createToken(email, expiresMs);
    const encodedToken = encodeURIComponent(token);

    const setDataVerify = new Verify();
    setDataVerify.user_id = user_id;
    setDataVerify.verification_code = token;
    setDataVerify.expires_at = expiresMs.toString();
    await this.verifyRepository.save(setDataVerify);

    const url = `http://localhost:3999/verification-register?token=${encodedToken}`;

    return { url, token, email, expiresMs };
  }

  async verifyToken(tokenExpires: number): Promise<boolean> {
    const expires = new Date();
    const expiresMs = expires.getTime();
    if (expiresMs < tokenExpires) {
      return true;
    }
    return false;
  }
}
