import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserService } from '../user.service';

@Schema()
export class User {
  @Prop()
  id: number;
  @Prop({ index: true, unique: true })
  username: string;
  @Prop()
  password: string;
  @Prop()
  email: string;
  @Prop()
  valid: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
// export const useFactory = function (userService: UserService) {
//   const schema = UserSchema;
//   schema.pre<UserDocument>('save', async function () {
//     console.log(this);
//     this.password = await userService.hashPassword(this.password);
//   });
//   return schema;
// };
