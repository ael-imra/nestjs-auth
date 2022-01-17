import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
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
    const conf = await this.confirmationModel.findOne({ email });
    if (conf && new Date(conf.date).getTime() > new Date().getTime())
      throw new BadRequestException('code already sent to your email');
    const code = randomBytes(6).toString('hex');
    const updateLog = await this.confirmationModel.updateOne(
      { email },
      { code, date: new Date(new Date().getTime() * 60 * 60 * 1000) },
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
  async checkCodeConfirmation(email: string, code: string): Promise<boolean> {
    const confirmation = await this.confirmationModel.findOne({ email, code });
    if (!confirmation) throw new BadRequestException('invalid code');
    await this.confirmationModel.deleteOne({ _id: confirmation._id });
    return true;
  }
}
