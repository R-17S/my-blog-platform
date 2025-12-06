import { Module } from '@nestjs/common';
import { TestingController } from './ api/testing.controller';
import { TestingService } from './ application/testing.service';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BlogsModule } from '../bloggers-platform/blogs/blogs.module';
import { PostsModule } from '../bloggers-platform/posts/posts.module';
import { CommentsModule } from '../bloggers-platform/comments/comments.module';

@Module({
  imports: [UserAccountsModule, BlogsModule, PostsModule, CommentsModule],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
