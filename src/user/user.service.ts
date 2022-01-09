import { Injectable } from '@nestjs/common';
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
  async get(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }
  async getAll(query?: GetQueryDTO): Promise<User[]> {
    return this.userModel.find(query);
  }
  async generateToken(username: string): Promise<string> {
    const token = uuidv4();
    await this.userModel.updateOne({ username }, { token });
    return token;
  }
}
