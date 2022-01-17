import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { GetQueryDTO, RegisterDTO } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUser: RegisterDTO): Promise<User> {
    const user = new this.userModel(createUser);
    return user.save();
  }
  async get(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }
  async getAll(query?: GetQueryDTO): Promise<User[]> {
    return this.userModel.find(query);
  }
  // async generateToken(email: string): Promise<string> {
  //   const confirmation: Confirmation = await this.confirmationModel.findOne({
  //     email,
  //   });
  //   if (new Date(confirmation.date).getTime() > new Date().getTime())
  //     throw new BadRequestException('code already sent to your email')
  //   const code =
  //     return token;
  // }
  // async sendValidationMail(email): Promise<boolean> {
  //   const code = this.generateCode(4);
  //   const mailLog = await this.mailService.sendMail({
  //     to: email,
  //     from: process.env.MAIL_USER,
  //     subject: 'Test mail',
  //     template: `templ`,
  //     // context: {
  //     //   code,
  //     // },
  //   });
  //   console.log(mailLog);
  //   return !!mailLog;
  // }
}
