import { IsEnum } from 'class-validator';
import { LikeStatusTypes } from '../../modules/bloggers-platform/posts/api/view-dto/posts.view-dto';

export class UpdateLikeStatusDto {
  @IsEnum(LikeStatusTypes)
  likeStatus: LikeStatusTypes;
}
