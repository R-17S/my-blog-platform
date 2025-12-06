import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserInputQuery } from './input-dto/get-users-query-params.input-dto';
import { UsersViewPaginated, UserViewModel } from './view-dto/users.view-dto';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../application/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    //private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getUsers(@Query() query: UserInputQuery): Promise<UsersViewPaginated> {
    return this.usersQueryRepository.getAllUsers(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() input: CreateUserDto): Promise<UserViewModel> {
    const newUserId = await this.usersService.createUser(input);
    return await this.usersQueryRepository.getUserByIdOrError(newUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.usersService.deleteUser(id);
  }
}
