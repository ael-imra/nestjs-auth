import { IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  username: string;
  @IsString()
  password: string;
}

export class RegisterDTO {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  email: string;
}

export class GetQueryDTO {
  username?: string;
  email?: string;
  token?: string;
}
