import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/Register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login() {
    return 'hallo';
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<object> {
    return await this.authService.register(registerDTO);
  }

  @Post('resend-verification-register')
  async resendVerificationEmail(@Body() body: any): Promise<object> {
    return await this.authService.resendVerifyRegister(body.email);
  }

  @Post('verification-register')
  async verificationRegister(@Body() body: any): Promise<object> {
    return await this.authService.verifyRegister(body.token);
  }
}
