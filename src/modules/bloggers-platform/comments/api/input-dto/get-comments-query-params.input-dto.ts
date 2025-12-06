import { IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';

export class CommentInputQuery extends BaseQueryParams {
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt'; // дефолтное поле сортировки
}
