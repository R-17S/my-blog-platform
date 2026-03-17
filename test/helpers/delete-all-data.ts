import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// export const deleteAllData = async (
//   app: INestApplication,
// ): Promise<Response> => {
//   return request(app.getHttpServer()).delete(`/api/testing/all-data`);
// };

export const deleteAllData = async (app: INestApplication): Promise<void> => {
  await request(app.getHttpServer())
    .delete(`/api/testing/all-data`)
    .expect(204);
};
