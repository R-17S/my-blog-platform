import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';
import { CurrentUserId } from '../../../../core/decorators/current-user-id.decorator';

@Controller('comments')
export class CommentsController {
  constructor(
    //private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  async getCommentById(
    @Param('id') id: string,
    @CurrentUserId() userId: string | undefined,
  ) {
    return await this.commentsQueryRepository.getCommentByIdOrError(id, userId);
  }
}
