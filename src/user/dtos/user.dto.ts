import { IsAlphanumeric, IsEmail, IsString, Length } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class RegisterDTO {
  @IsString()
  @Length(3, 25)
  username: string;
  @IsString()
  @Length(8, 100)
  password: string;
  @IsEmail()
  email: string;
  @IsString()
  @Length(6, 6)
  code: string;
}

export class GetQueryDTO {
  username?: string;
  email?: string;
  token?: string;
}
export class SendConfirmationDTO {
  @IsEmail()
  email: string;
}
