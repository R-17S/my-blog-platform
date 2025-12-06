import { IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

export class BlogInputQuery extends BaseQueryParams {
  @IsOptional()
  @IsString()
  searchNameTerm?: string;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt'; // дефолтное поле сортировки
}
