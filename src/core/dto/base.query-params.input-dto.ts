import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

//базовый класс для query параметров с пагинацией
//значения по-умолчанию применятся автоматически при настройке глобального ValidationPipe в main.ts
export class BaseQueryParams {
  //для трансформации в number
  @Type(() => Number)
  @IsNumber()
  pageNumber: number = 1;
  @Type(() => Number)
  @IsNumber()
  pageSize: number = 10;
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }

  SortOptions(sortBy: string): Record<string, 1 | -1> {
    return {
      [sortBy]: this.sortDirection === SortDirection.Asc ? 1 : -1,
    };
  }
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}
