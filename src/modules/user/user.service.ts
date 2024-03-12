import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly _userRepo: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async register(createUserDto: CreateUserDto, file: Express.Multer.File) {
    // Check if the username already exists
    const existingUser = await this._userRepo.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await this.cloudinaryService.uploadImage(file);

    const user = await this._userRepo.create({
      ...createUserDto,
      profileImage: cloudinaryResponse.secure_url, // Assuming you have a 'profileImageUrl' field in your User entity
    });
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

  async findOneUser(email: string) {
    return await this._userRepo.findOne({
      where: { email: email },
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

  async update(
    file: Express.Multer.File,
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    const { username, age, password, name, email } = updateUserDto;
    const profile = await this._userRepo.findOneBy({ id: id });
    if (profile) {
      if (file) {
        await this._userRepo.update(
          {
            id: id,
          },
          {
            ...updateUserDto,
            profileImage: file?.filename,
          },
        );
        return { msg: 'profile updated successfully.' };
      }

      // await this._userRepo.update(
      //   {
      //     id: id,
      //   },
      //   {
      //     userName: userName,
      //     userAge: userAge,
      //   },
      // );
      // return res.status(200).json({ msg: 'profile updated successfully.' });
    }
    return { msg: 'profile not found.' };
  }
}
