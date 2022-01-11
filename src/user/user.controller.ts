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
import { RolesGuard } from 'src/roles.guard';
import { LoginDTO, RegisterDTO } from './dtos/user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async register(@Body() registerUser: RegisterDTO): Promise<User> {
    const user = await this.userService.get(registerUser.username);
    if (user) throw new BadRequestException('username already exists');
    return this.userService.create(registerUser);
  }
  @Post('login')
  async login(@Body() loginUser: LoginDTO): Promise<User> {
    const user = await this.userService.get(loginUser.username);
    if (!user || user.password !== loginUser.password)
      throw new NotFoundException();
    if (!user.token)
      user.token = await this.userService.generateToken(loginUser.username);
    return user;
  }
  @Get()
  @UseGuards(RolesGuard)
  async getUsers(): Promise<User[]> {
    return this.userService.getAll();
  }
}
