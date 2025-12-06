import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUserId } from '../interfaces/request-with-user.interface';

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUserId>();
    return request.userId ?? undefined;
  },
);
