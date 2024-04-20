import { Controller, Get, Body, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';

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

  //@Method GET
  //@desc Get all users
  //@Path: /users
  @Get('/usersPagination')
  async findAllPaginationUsers(@Query('page') page: number) {
    return await this.userService.findAllPaginationUsers(page);
  }
}
