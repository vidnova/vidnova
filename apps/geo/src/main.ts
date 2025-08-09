import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const constrains = validationErrors[0].constraints;
        return new BadRequestException(constrains);
      },
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 4002);
}

bootstrap();
