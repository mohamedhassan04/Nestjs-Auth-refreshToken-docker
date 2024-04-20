import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EmailService } from 'src/shared/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly _userRepo: Repository<User>,
    private cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
  ) {}
  async register(createUserDto: CreateUserDto, file: Express.Multer.File) {
    // Check if the username already exists
    const existingUser = await this._userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Upload image to Cloudinary
    // const cloudinaryResponse = await this.cloudinaryService.uploadImage(file);

    const user = await this._userRepo.create({
      ...createUserDto,
      // profileImage: cloudinaryResponse.secure_url, // Assuming you have a 'profileImageUrl' field in your User entity
    });

    // Send registration email
    // await this.emailService.sendRegistrationEmail(
    //   createUserDto.email,
    //   createUserDto.password,
    // );

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

  async findAllPaginationUsers(page: number): Promise<User[]> {
    const skip = (page - 1) * 5;
    const users = await this._userRepo.find({
      take: 5,
      skip: skip,
    });
    users.map((user) => {
      delete user.password;
    });
    return users;
  }
}
