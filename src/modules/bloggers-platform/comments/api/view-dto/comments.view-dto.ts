import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommentDocument } from '../../domain/comment.entity';

export enum LikeStatusTypes {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}
export class CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusTypes;
  };

  static mapToView(
    comment: CommentDocument,
    myStatus: LikeStatusTypes,
  ): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesCount ?? 0,
        dislikesCount: comment.dislikesCount ?? 0,
        myStatus,
      },
    };
  }
}

export class CommentsViewPaginated extends PaginatedViewDto<
  CommentViewModel[]
> {
  items: CommentViewModel[];
}
