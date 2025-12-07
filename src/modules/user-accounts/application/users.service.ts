import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ArgonService } from '../../../core/security/argon2.service';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly argonService: ArgonService,
    @InjectModel(User.name) private readonly userModel: UserModelType,
  ) {}

  async createUser(input: CreateUserDto): Promise<string> {
    const [loginExists, emailExists] = await Promise.all([
      this.usersRepository.findByLogin(input.login),
      this.usersRepository.findByEmail(input.email),
    ]);

    if (loginExists) throw new BadRequestException('Login should be unique');
    if (emailExists) throw new BadRequestException('Email should be unique');

    const passwordHash = await this.argonService.generateHash(input.password);

    const newUser = this.userModel.createInstance(
      input.login,
      input.email,
      passwordHash,
    );

    await this.usersRepository.save(newUser);
    return newUser._id.toString();
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    user.makeDeleted();
    await this.usersRepository.save(user);
  }

  // async checkBlogExistsOrError(id: string): Promise<void> {
  //   const exists = await this.blogsRepository.exists(id);
  //   if (!exists) throw new NotFoundException('Blog not found');
  // }
}
