import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(20, 300)
  content: string;

  // @IsOptional()
  // @IsString()
  // @IsNotEmpty()
  // postId: string;
}
