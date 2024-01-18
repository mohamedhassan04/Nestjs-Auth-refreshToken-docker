import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly _userRepo: Repository<User>,
  ) {}
  async register(createUserDto: CreateUserDto) {
    // Check if the username already exists
    const existingUser = await this._userRepo.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const user = await this._userRepo.create(createUserDto);
    // Hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = createUserDto.password;
    const hash = await bcrypt.hash(passwordHash, salt);

    // Save user
    hash && (user.password = hash);
    await this._userRepo.save(user);

    //For not return the password in the response
    const { password, ...result } = user;
    return result;
  }

  async findOneUser(username: string) {
    return await this._userRepo.findOne({
      where: { username: username },
    });
  }
  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
   */
  async findAllUsers(): Promise<User[]> {
    const users = await this._userRepo.find();
    users.map((user) => {
      delete user.password;
    });
    return users;
  }
}
