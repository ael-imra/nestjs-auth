import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Confirmation } from './schemas/confirmation.schema';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(Confirmation.name)
    private confirmationModel: Model<Confirmation>,
  ) {}

  async sendUserConfirmation(email: string): Promise<string> {
    const conf: Confirmation = await this.confirmationModel.findOne({ email });
    if (new Date(conf.date).getTime() > new Date().getTime())
      throw new BadRequestException('code already sent to your email');
    const code = this.generateCode(6);
    const updateLog = await this.confirmationModel.updateOne(
      { email },
      { code, date: new Date().getTime() * 60 * 60 * 1000 },
      { upsert: true },
    );
    const mailLog = await this.mailerService.sendMail({
      to: email,
      subject: 'mail Confirmation',
      template: 'Confirmation',
    });
    return updateLog.modifiedCount > 0 && mailLog
      ? 'mail sent successfully'
      : 'something went wrong';
  }
  generateCode(length): string {
    const codes = '0123456789';
    let code: string = '';
    for (let i = 0; i < length; i++) {
      const random: number = Math.floor(Math.random() * 10);
      code = `${code}${codes[random]}`;
    }
    return code;
  }
}
