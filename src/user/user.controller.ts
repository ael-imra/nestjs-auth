import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { RolesGuard } from 'src/roles.guard';
import { promisify } from 'util';
import { LoginDTO, RegisterDTO, SendConfirmationDTO } from './dtos/user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

const scrypt = promisify(_scrypt);
@Controller('user')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private mailService: MailService,
  ) {}
  @Post('register')
  async register(@Body() registerUser: RegisterDTO): Promise<User> {
    const user = await this.userService.get(registerUser.username);
    // if user not exist than throw username already exists
    if (user) throw new BadRequestException('username already exists');
    // check if user validate email
    await this.mailService.checkCodeConfirmation(
      registerUser.email,
      registerUser.code,
    );
    // generate salt with 6 characters
    const salt = randomBytes(6).toString('hex');
    // hash password with salt and return value with 32 characters
    registerUser.password = `${(
      await scrypt(registerUser.password, salt, 32)
    ).toString()}.${salt}`;
    // create account with user information
    return this.userService.create(registerUser);
  }
  @Post('login')
  async login(@Body() loginUser: LoginDTO): Promise<User> {
    const user = await this.userService.get(loginUser.email);
    if (!user || user.password !== loginUser.password)
      throw new NotFoundException();
    const [hash, salt] = user.password;
    const result = (await scrypt(loginUser.password, salt, 32)).toString();
    if (result !== hash) throw new BadRequestException('incorrect password');
    return user;
  }
  @Get()
  @UseGuards(RolesGuard)
  async getUsers(): Promise<User[]> {
    return this.userService.getAll();
  }
  @Post('send/confirmation')
  async sendMail(
    @Body() confirmationBody: SendConfirmationDTO,
  ): Promise<string> {
    return await this.mailService.sendUserConfirmation(confirmationBody.email);
  }
}
