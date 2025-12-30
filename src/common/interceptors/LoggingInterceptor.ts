import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    console.log('Before...', {
      method: request.method,
      url: request.url,
      body: request.body,
    });

    const now = Date.now();

    return next.handle().pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`)),
      map((data) => ({
        statusCode: response.statusCode,
        message: 'Success',
        data,
      })),
    );
  }
}
