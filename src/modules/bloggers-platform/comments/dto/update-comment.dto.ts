import { IsString, IsNotEmpty, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;

  // @IsString()
  // @IsNotEmpty()
  // postId: string;
}
