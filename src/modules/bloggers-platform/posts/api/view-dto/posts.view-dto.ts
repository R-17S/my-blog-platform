import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostDocument } from '../../domain/post.entity';

export enum LikeStatusTypes {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}
export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusTypes;
    newestLikes: Array<{
      addedAt: Date;
      userId: string;
      login: string;
    }>;
  };

  // а что делать то? взвращается lean  как это типизировать ?
  static mapToView(
    post: PostDocument,
    myStatus: LikeStatusTypes,
    newestLikes: Array<{ addedAt: Date; userId: string; login: string }>,
    likesCount: number,
    dislikesCount: number,
  ): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
        newestLikes,
      },
    };
  }
}

export class PostsViewPaginated extends PaginatedViewDto<PostViewModel[]> {
  //items: PostViewModel[];
}
