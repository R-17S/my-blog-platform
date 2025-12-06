import { PostLike, PostLikeDocument } from '../domain/post.like-scheme';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { NewestLikeViewModel } from '../dto/newest-like-view-model';
import { AggregatedLikesResult } from './interface/post-aggregated-likes-result';
import { PostDocument } from '../domain/post.entity';
import { LikeStatusTypes, PostViewModel } from '../api/view-dto/posts.view-dto';

@Injectable()
export class PostLikesRepository {
  constructor(
    @InjectModel(PostLike.name)
    private readonly likeModel: Model<PostLikeDocument>,
  ) {}

  async getStatusesForPosts(
    userId: string,
    postIds: string[],
  ): Promise<Record<string, LikeStatusTypes>> {
    const likes = await this.likeModel
      .find({ userId, postId: { $in: postIds } })
      .lean();
    const map: Record<string, LikeStatusTypes> = {};
    for (const like of likes) {
      map[like.postId] = like.status as LikeStatusTypes; // Не знаю как обойтись без типа
    }
    return map;
  }

  async getNewestLikesForPosts(
    postIds: string[],
  ): Promise<Record<string, NewestLikeViewModel[]>> {
    const likes = await this.likeModel.aggregate<AggregatedLikesResult>([
      { $match: { postId: { $in: postIds } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$postId', newest: { $push: '$$ROOT' } } }, // создаёт массив newest, куда складываются все документы этой группы. добавляет элемент в массив.$$ROOT — это специальная переменная, которая означает «весь текущий документ целиком»
    ]);
    const map: Record<string, NewestLikeViewModel[]> = {};
    for (const like of likes) {
      map[like._id] = like.newest.slice(0, 3).map((x) => ({
        userId: x.userId,
        login: x.login,
        addedAt: x.createdAt,
      }));
    }
    return map;
  }

  async enrichPostsWithLikes(
    posts: PostDocument[],
    userId?: string,
  ): Promise<PostViewModel[]> {
    const postIds = posts.map((p) => p._id.toString());

    const [statusesMap, newestLikesMap] = await Promise.all([
      userId ? this.getStatusesForPosts(userId, postIds) : {},
      this.getNewestLikesForPosts(postIds),
    ]);

    return posts.map((post) =>
      PostViewModel.mapToView(
        post,
        statusesMap[post._id.toString()] ?? LikeStatusTypes.None,
        newestLikesMap[post._id.toString()] ?? [],
      ),
    );
  }
}
