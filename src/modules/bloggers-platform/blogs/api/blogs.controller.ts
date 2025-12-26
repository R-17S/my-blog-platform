import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogInputQuery } from './input-dto/get-blogs-query-params.input-dto';
import { BlogsViewPaginated, BlogViewModel } from './view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogsService } from '../application/blogs.service';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CurrentUserId } from '../../../../core/decorators/current-user-id.decorator';
import { PostInputQuery } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import {
  PostsViewPaginated,
  PostViewModel,
} from '../../posts/api/view-dto/posts.view-dto';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { CreatePostDto } from '../../posts/dto/create-post.dto';
import { PostsService } from '../../posts/application/posts.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  @Get()
  async getBlogs(@Query() query: BlogInputQuery): Promise<BlogsViewPaginated> {
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() input: CreateBlogDto): Promise<BlogViewModel> {
    const newBlogId = await this.blogsService.createBlog(input);
    return await  this.blogsQueryRepository.getBlogByIdOrError(newBlogId);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: PostInputQuery,
    @CurrentUserId() userId: string | undefined, // или использовать кастомный декоратор для userId, что бы я мог потом статус глянуть
  ): Promise<PostsViewPaginated> {
    await this.blogsService.checkBlogExistsOrError(blogId);
    return await this.postsQueryRepository.getPostsByBlogId(
      blogId,
      query,
      userId,
    );
  }

  @Post(':blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() input: CreatePostDto,
  ): Promise<PostViewModel> {
    await this.blogsService.checkBlogExistsOrError(blogId);
    const newPost = await this.postsService.createPost(input, blogId);
    return await this.postsQueryRepository.getPostByIdOrError(newPost);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.blogsQueryRepository.getBlogByIdOrError(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() input: UpdateBlogDto,
  ): Promise<void> {
    await this.blogsService.updateBlog(id, input);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    await this.blogsService.deleteBlog(id);
  }
}
