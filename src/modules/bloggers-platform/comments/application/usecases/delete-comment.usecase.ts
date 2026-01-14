import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

export class DeleteCommentCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand, void>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(input: DeleteCommentCommand): Promise<void> {
    const { id, userId } = input;
    const comment = await this.commentsRepository.findById(id);
    if (!comment)
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Comment not found',
      });

    if (comment.commentatorInfo.userId !== userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'You cannot edit this comment',
      });
    }
    comment.makeDeleted();
    await this.commentsRepository.save(comment);
  }
}
