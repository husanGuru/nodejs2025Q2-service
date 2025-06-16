import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from 'src/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: MyLogger) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, url, body } = request;

    response.on('finish', () => {
      const { statusCode } = response;

      this.logger.log(`${method} ${url} ${statusCode} ${JSON.stringify(body)}`);
    });

    next();
  }
}
