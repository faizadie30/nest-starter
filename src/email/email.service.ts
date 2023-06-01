import { Injectable } from '@nestjs/common';
// import { transporter } from 'config/email.config';
import { MailerService as NodeMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private nodeMailer: NodeMailerService) {}
  async sendVerificationEmail(
    to: string,
    subject: string,
    name: string,
    verificationLink: string,
  ): Promise<void> {
    await this.nodeMailer.sendMail({
      to: to,
      subject: subject,
      template: 'auth/verification-register',
      context: {
        name,
        verificationLink,
      },
    });
  }
}
