import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { swaggerConfig } from './config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common';
//import {config} from './config/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  const documentFactory = () =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(swaggerConfig.title)
        .setDescription(swaggerConfig.description)
        .setVersion(swaggerConfig.version)
        .addSecurity('bearer', {
          type: 'http',
          scheme: 'bearer',
        })
        .build(),
    );
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
