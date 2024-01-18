import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  /* Validate user credentials */
  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneUser(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  /* Login function */
  async login(user: User) {
    const payload = {
      username: user.username,
      sub: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
    };
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  /* Login function */
  async refreshToken(user: User) {
    const payload = {
      username: user.username,
      sub: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
