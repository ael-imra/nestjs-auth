import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: any, res: any, next: () => void) {
    const cookies = req.cookies;
    if (cookies.token) {
      const users = await this.userService.getAll({ token: cookies.token });
      if (users.length > 0) {
        req.user = users[0];
        return next();
      }
    }
    throw new UnauthorizedException();
  }
}
