import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { Request } from 'express';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

@Injectable()
export class PostRateLimitGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // трекаем по IP
    return Promise.resolve(req.ip as string);
  }

  protected getLimit(context: ExecutionContext): number {
    // только для POST
    const request: Request = context.switchToHttp().getRequest<Request>();
    return request.method === 'POST' ? 5 : Number.MAX_SAFE_INTEGER;
  }

  protected getTtl(): number {
    return 10; // окно в секундах
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    // помечаем параметры как "использованные", иначе не работает это что такое вообще?
    void context;
    void throttlerLimitDetail;
    // await добавлен, что за танцы с бубном, бля просто ужас похоже на какой то обряд
    await Promise.resolve();
    throw new DomainException({
      code: DomainExceptionCode.TooManyRequests,
      message: 'More than 5 attempts from one IP-address during 10 seconds',
    });
  }
}
