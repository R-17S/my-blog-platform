import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CommentsViewPaginated,
  CommentViewModel,
  LikeStatusTypes,
} from '../../api/view-dto/comments.view-dto';
import { Comment, CommentDocument } from '../../domain/comment.entity';
import { CommentLikesRepository } from '../comments.likes-repository';
import { CommentInputQuery } from '../../api/input-dto/get-comments-query-params.input-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly commentLikesRepository: CommentLikesRepository,
  ) {}

  // async getAllPosts(
  //   params: PostInputQuery,
  //   userId?: string,
  // ): Promise<PostsViewPaginated> {
  //   const [totalCount, posts] = await Promise.all([
  //     this.postModel.countDocuments({}),
  //     this.postModel
  //       .find({})
  //       .sort(params.SortOptions(params.sortBy))
  //       .skip(params.calculateSkip())
  //       .limit(params.pageSize)
  //       .lean(),
  //   ]);
  //
  //   const items = await this.postLikesRepository.enrichPostsWithLikes(
  //     posts,
  //     userId,
  //   );
  //
  //   return PostsViewPaginated.mapToView({
  //     items,
  //     page: params.pageNumber,
  //     size: params.pageSize,
  //     totalCount,
  //   });
  // }

  async getCommentByIdOrError(
    id: string,
    userId?: string,
  ): Promise<CommentViewModel> {
    const result = await this.commentModel
      .findOne({ _id: id, deletedAt: null }) // фильтруем только "живые" блоги
      .lean();
    if (!result) throw new NotFoundException('Comment not found');

    const statusesMap = userId
      ? await this.commentLikesRepository.getStatusesForComments(userId, [id])
      : {};

    const myStatus = statusesMap[id] ?? LikeStatusTypes.None;

    return CommentViewModel.mapToView(result, myStatus);
  }

  async getCommentsByPostId(
    id: string,
    params: CommentInputQuery,
    userId?: string,
  ): Promise<CommentsViewPaginated> {
    const filter = { postId: id };

    const [totalCount, comments] = await Promise.all([
      this.commentModel.countDocuments(filter),
      this.commentModel
        .find(filter)
        .sort(params.SortOptions(params.sortBy))
        .skip(params.calculateSkip())
        .limit(params.pageSize)
        .lean(),
    ]);

    const commentIds = comments.map((comment) => comment._id.toString());

    const statusesMap = userId
      ? await this.commentLikesRepository.getStatusesForComments(
          userId,
          commentIds,
        )
      : {};

    const items = comments.map((comment) =>
      CommentViewModel.mapToView(
        comment,
        statusesMap[comment._id.toString()] ?? LikeStatusTypes.None,
      ),
    );

    return CommentsViewPaginated.mapToView({
      items,
      page: params.pageNumber,
      size: params.pageSize,
      totalCount,
    });
  }
}
