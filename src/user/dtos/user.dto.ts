import { IsAlphanumeric, IsEmail, IsString, Length } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsAlphanumeric()
  @Length(3, 25)
  username: string;
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
  @IsString()
  @IsEmail()
  email: string;
}

export class GetQueryDTO {
  username?: string;
  email?: string;
  token?: string;
}
