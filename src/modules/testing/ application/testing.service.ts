import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../user-accounts/infrastructure/users.repository';
import { BlogsRepository } from '../../bloggers-platform/blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../bloggers-platform/posts/infrastructure/posts.repository';
import { CommentsRepository } from '../../bloggers-platform/comments/infrastructure/comments.repository';

@Injectable()
export class TestingService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async clearDatabase(): Promise<void> {
    await Promise.all([
      this.usersRepository.deleteAll(),
      this.blogsRepository.deleteAll(),
      this.postsRepository.deleteAll(),
      this.commentsRepository.deleteAll(),
    ]);
  }
}
