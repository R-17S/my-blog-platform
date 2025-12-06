import { INestApplication, ValidationPipe } from '@nestjs/common';

export function pipesSetup(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.
  //На следующем занятии рассмотрим подробнее
  app.useGlobalPipes(
    new ValidationPipe({
      //class-transformer создает экземпляр dto
      //соответственно применятся значения по-умолчанию
      //и методы классов dto
      //whitelist: true, // удаляет поля, которых нет в DTO
      //forbidNonWhitelisted: true, // кидает ошибку, если пришли лишние поля
      transform: true,
    }),
  );
}
