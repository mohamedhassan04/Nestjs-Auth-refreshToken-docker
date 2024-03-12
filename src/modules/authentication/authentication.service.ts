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
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneUser(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  /* Login function */
  async login(user: User) {
    const payload = {
      email: user.email,
      sub: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  /* Login function */
  async refreshToken(user: User) {
    const payload = {
      email: user.email,
      sub: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
