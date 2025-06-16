import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './utils/filters/exceptions.filter';
import { MyLogger } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  const logger = app.get(MyLogger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(logger));

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', error.stack || error.message, 'Process');
  });

  process.on('unhandledRejection', (reason: unknown) => {
    const message =
      reason instanceof Error ? reason.stack || reason.message : String(reason);
    logger.error('Unhandled Promise Rejection', message, 'Process');
  });

  await app.listen(port);
}
bootstrap();
