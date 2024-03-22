import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Project')
  .setDescription('Access and Refresh Token')
  .setVersion('1.0')
  .addTag('project')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
