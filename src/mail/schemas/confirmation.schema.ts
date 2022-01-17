import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Confirmation {
  @Prop()
  code: string;
  @Prop()
  email: string;
  @Prop({ type: 'date' })
  date: string;
}
export type ConfirmationDocument = Confirmation & Document;

export const ConfirmationSchema = SchemaFactory.createForClass(Confirmation);
