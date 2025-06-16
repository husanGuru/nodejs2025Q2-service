import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  BadGatewayException,
  GatewayTimeoutException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MyLogger } from '../../logger/logger.service';

@Catch(
  InternalServerErrorException,
  BadGatewayException,
  GatewayTimeoutException,
)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: MyLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(1);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      `Error on ${request.method} ${request.url}`,
      (exception as any)?.stack || '',
      'ExceptionFilter',
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Internal server error',
    });
  }
}
