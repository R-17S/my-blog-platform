import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostInputQuery } from './input-dto/get-posts-query-params.input-dto';
import { PostsViewPaginated, PostViewModel } from './view-dto/posts.view-dto';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsService } from '../application/posts.service';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CurrentUserId } from '../../../../core/decorators/current-user-id.decorator';
import { CommentsViewPaginated } from '../../comments/api/view-dto/comments.view-dto';
import { CommentInputQuery } from '../../comments/api/input-dto/get-comments-query-params.input-dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsRepository: PostsRepository,
    //private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: CommentInputQuery,
    @CurrentUserId() userId: string | undefined, // или использовать кастомный декоратор для userId, что бы я мог потом статус глянуть
  ): Promise<CommentsViewPaginated> {
    await this.postsService.checkPostExistsOrError(postId);
    return await this.commentsQueryRepository.getCommentsByPostId(
      postId,
      query,
      userId,
    );
  }

  @Get()
  async getPosts(
    @Query() query: PostInputQuery,
    @CurrentUserId() userId: string | undefined,
  ): Promise<PostsViewPaginated> {
    return this.postsQueryRepository.getAllPosts(query, userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() input: CreatePostDto): Promise<PostViewModel> {
    const newPostId = await this.postsService.createPost(input);
    return await this.postsQueryRepository.getPostByIdOrError(newPostId);
  }

  @Get(':id')
  async getPostById(
    @Param('id') id: string,
    @CurrentUserId() userId: string | undefined,
  ) {
    return await this.postsQueryRepository.getPostByIdOrError(id, userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ): Promise<void> {
    await this.postsService.updatePost(id, input);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(id);
  }
}
