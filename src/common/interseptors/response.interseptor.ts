/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    //const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const statusCode = res.statusCode;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const message = data && typeof data === 'object' ? data.message : null;

        return {
          statusCode,

          data,

          message: message || this.defaultMessage(Number(statusCode)),
          success: this.getSuccess(Number(statusCode || 200)),
        };
      }),
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_arg0: number): any {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSuccess(_arg0: number): any {
    throw new Error('Method not implemented.');
  }
}
