import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string): Promise<boolean> {
    const url = `example.com/auth/confirm?token=${token}`;
    console.log(process.env.MAIL_USER);
    const log = await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your Email',
      template: 'confirmation',
      context: {
        name: email,
        url,
      },
    });
    return !!log;
  }
}
