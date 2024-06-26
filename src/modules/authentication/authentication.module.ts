import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken-startegy';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EmailService } from 'src/shared/mail.service';

/* If we import JwtModule, we don't need to import JwtService */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthenticationService,
    UserService,
    CloudinaryService,
    EmailService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
