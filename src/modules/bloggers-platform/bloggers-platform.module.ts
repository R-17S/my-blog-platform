import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { Post, PostEntity } from './posts/domain/post.entity';
import { PostLike, PostLikeSchema } from './posts/domain/post.like-scheme';
import { Comment, CommentEntity } from './comments/domain/comment.entity';
import {
  CommentLike,
  CommentLikeSchema,
} from './comments/domain/comment.like-scheme';
import { BlogsController } from './blogs/api/blogs.controller';
import { PostsController } from './posts/api/posts.controller';
import { CommentsController } from './comments/api/comments.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { BlogsService } from './blogs/application/blogs.service';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { PostsService } from './posts/application/posts.service';
import { PostLikesRepository } from './posts/infrastructure/posts.likes-repository';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';
import { CommentLikesRepository } from './comments/infrastructure/comments.likes-repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostEntity },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: Comment.name, schema: CommentEntity },
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    // Blogs
    BlogsRepository,
    BlogsQueryRepository,
    BlogsService,

    // Posts
    PostsRepository,
    PostsQueryRepository,
    PostsService,
    PostLikesRepository,

    // Comments
    CommentsRepository,
    CommentsQueryRepository,
    CommentLikesRepository,
  ],
  exports: [
    BlogsRepository,
    BlogsService,
    PostsRepository,
    PostsService,
    CommentsRepository,
    CommentsQueryRepository,
  ],
})
export class BloggersPlatformModule {}
