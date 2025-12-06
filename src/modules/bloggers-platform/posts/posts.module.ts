import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostEntity } from './domain/post.entity';
import { PostsController } from './api/posts.controller';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/query/posts.query-repository';
import { PostsService } from './application/posts.service';
import { forwardRef, Module } from '@nestjs/common';
import { BlogsModule } from '../blogs/blogs.module';
import { CommentsModule } from '../comments/comments.module';
import { PostLike, PostLikeSchema } from './domain/post.like-scheme';
import { PostLikesRepository } from './infrastructure/posts.likes-repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostEntity },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    forwardRef(() => BlogsModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [PostsController],
  providers: [
    PostsRepository,
    PostsQueryRepository,
    PostsService,
    PostLikesRepository,
  ],
  exports: [
    PostsRepository,
    PostsService,
    PostLikesRepository,
    PostsQueryRepository,
  ],
})
export class PostsModule {}
