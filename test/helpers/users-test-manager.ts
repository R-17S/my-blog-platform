import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateUserInputDto } from '../../src/modules/user-accounts/api/input-dto/users.input-dto';
import {
  MeViewDto,
  UserViewModel,
} from '../../src/modules/user-accounts/api/view-dto/users.view-dto';
import request from 'supertest';
import { GLOBAL_PREFIX } from '../../src/setup/global-prefix.setup';
import { delay } from './delay';

export class UsersTestManager {
  constructor(private app: INestApplication) {}

  async createUser(
    createModel: CreateUserInputDto,
    statusCode: number = HttpStatus.CREATED,
  ): Promise<UserViewModel> {
    const response = await request(this.app.getHttpServer())
      .post(`/${GLOBAL_PREFIX}/users`)
      .send(createModel)
      .auth('admin', 'qwerty')
      .expect(statusCode);

    return response.body as UserViewModel;
  }

  // async updateUser(
  //   userId: string,
  //   updateModel: UpdateUserInputDto,
  //   statusCode: number = HttpStatus.NO_CONTENT,
  // ): Promise<UserViewModel> {
  //   const response = await request(this.app.getHttpServer())
  //     .put(`/${GLOBAL_PREFIX}/users/${userId}`)
  //     .send(updateModel)
  //     .auth('admin', 'qwerty')
  //     .expect(statusCode);
  //
  //   return response.body;
  // }

  async login(
    loginOrEmail: string,
    password: string,
    statusCode: number = HttpStatus.OK,
  ): Promise<{ accessToken: string }> {
    console.log(
      '🔥 [TestManager] данные вообще приходят ',
      loginOrEmail,
      password,
    );
    const response = await request(this.app.getHttpServer())
      .post(`/${GLOBAL_PREFIX}/auth/login`)
      .send({ loginOrEmail, password })
      .expect(statusCode);
    expect(response.status).toBe(statusCode);
    return {
      accessToken: response.body.accessToken,
    };
  }

  async me(
    accessToken: string,
    statusCode: number = HttpStatus.OK,
  ): Promise<MeViewDto> {
    const response = await request(this.app.getHttpServer())
      .get(`/${GLOBAL_PREFIX}/auth/me`)
      .auth(accessToken, { type: 'bearer' })
      .expect(statusCode);

    return response.body as MeViewDto;
  }

  async createSeveralUsers(count: number): Promise<UserViewModel[]> {
    //const usersPromises = [] as Promise<UserViewModel>[];
    const usersPromises: UserViewModel[] = [];

    for (let i = 0; i < count; ++i) {
      await delay(50);
      const response = await this.createUser({
        //TODO: какого хрена синхрон быстрее асинхрон?
        login: `test` + i,
        email: `test${i}@gmail.com`,
        password: '123456789',
      });
      usersPromises.push(response);
    }

    //return Promise.all(usersPromises);
    return usersPromises;
  }

  async createAndLoginSeveralUsers(
    count: number,
  ): Promise<{ accessToken: string }[]> {
    const users = await this.createSeveralUsers(count);
    console.log('🔥 [TestManager] users created:', users);

    const loginPromises = users.map((user: UserViewModel) =>
      this.login(user.login, '123456789'),
    );
    console.log('🔥 [TestManager] loginPromises created:', loginPromises);
    // loginPromises — это массив НЕ результатов, а промисов, которые ещё выполняются
    // хочешь увидеть результат промиса const tokens = await Promise.all(loginPromises);

    return await Promise.all(loginPromises);
  }
}
