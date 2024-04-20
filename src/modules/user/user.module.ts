import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EmailService } from 'src/shared/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, CloudinaryService, EmailService],
  exports: [UserService],
})
export class UserModule {}
