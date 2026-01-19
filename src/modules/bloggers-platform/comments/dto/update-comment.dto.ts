import { IsString, IsNotEmpty, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(20, 300)
  content: string;

  // @IsString()
  // @IsNotEmpty()
  // postId: string;
}
