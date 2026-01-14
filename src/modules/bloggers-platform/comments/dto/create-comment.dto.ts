import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;

  // @IsOptional()
  // @IsString()
  // @IsNotEmpty()
  // postId: string;
}
