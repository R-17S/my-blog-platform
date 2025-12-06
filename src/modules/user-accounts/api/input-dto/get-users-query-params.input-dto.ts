import { IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

export class UserInputQuery extends BaseQueryParams {
  @IsOptional()
  @IsString()
  searchLoginTerm?: string;

  @IsOptional()
  @IsString()
  searchEmailTerm?: string;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt'; // дефолтное поле сортировки
}
