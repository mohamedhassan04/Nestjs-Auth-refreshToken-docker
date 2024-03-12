import {
  Controller,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  Post,
  UploadedFile,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateUserDto } from './dto/update-user.dto';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${name}-${randomName}${extension}`);
  },
});

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Method GET
  //@desc Get one user by username
  //@Path: /
  @Get()
  findOne(@Body() username: string) {
    return this.userService.findOneUser(username);
  }

  //@Method GET
  //@desc Get all users
  //@Path: /users
  @UseGuards(JwtAuthGuard)
  @Get('/users')
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Put('/upload/:id')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @UploadedFile() file,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(file, id, updateUserDto);
  }
}
