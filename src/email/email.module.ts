import { MailerModule as NodeMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailerConfigService } from './email-config.service';
import { EmailService } from './email.service';

@Module({
  imports: [
    NodeMailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
  ],
  exports: [EmailService],
  providers: [MailerConfigService, EmailService],
})
export class EmailModule {}
