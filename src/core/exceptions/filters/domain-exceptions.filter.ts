import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainExceptionCode } from '../domain-exception-codes';
import { DomainException } from '../domain-exceptions';
import { ErrorResponseBody } from './error-response-body.type';
import { Response, Request } from 'express';
import { SwaggerErrorResponse } from '../swagger-dto';

//Ошибки класса DomainException (instanceof DomainException)
@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    console.log('🔥 Может ты уже начнёшь работать', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.mapToHttpStatus(exception.code);
    //const responseBody = this.buildResponseBody(exception, request.url); // это человеческая версия ошибки
    if (
      exception.code === DomainExceptionCode.Unauthorized ||
      exception.code === DomainExceptionCode.NotFound ||
      exception.code === DomainExceptionCode.BadRequest
    ) {
      response.status(status).end();
      return;
    }
    const responseBody = this.mapToSwaggerFormat(exception);

    response.status(status).json(responseBody);
  }

  private mapToHttpStatus(code: DomainExceptionCode): number {
    switch (code) {
      case DomainExceptionCode.BadRequest:
      case DomainExceptionCode.ValidationError:
      case DomainExceptionCode.ConfirmationCodeExpired:
      case DomainExceptionCode.EmailNotConfirmed:
      case DomainExceptionCode.PasswordRecoveryCodeExpired:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      case DomainExceptionCode.InternalServerError:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case DomainExceptionCode.TooManyRequests:
        return HttpStatus.TOO_MANY_REQUESTS;
      default:
        return HttpStatus.I_AM_A_TEAPOT;
    }
  }

  private buildResponseBody(
    exception: DomainException,
    requestUrl: string,
  ): ErrorResponseBody {
    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message: exception.message,
      code: exception.code,
      extensions: exception.extensions,
    };
  }

  private mapToSwaggerFormat(exception: DomainException): SwaggerErrorResponse {
    return {
      errorsMessages: exception.extensions.map((e) => ({
        message: e.message,
        field: e.key,
      })),
    };
  }
}
