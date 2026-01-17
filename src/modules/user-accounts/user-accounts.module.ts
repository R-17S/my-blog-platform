import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { ArgonService } from './application/argon2.service';
import { CreateUserUseCase } from './application/usecases/admins/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/admins/delete-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserEntity }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    UsersQueryRepository,
    //UsersService,
    CreateUserUseCase,
    DeleteUserUseCase,
    ArgonService,
  ],
  exports: [
    UsersRepository,
    //UsersService,
    ArgonService,
  ],
})
export class UserAccountsModule {}
