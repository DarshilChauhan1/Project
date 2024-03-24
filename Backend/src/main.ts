import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFiler } from './exceptionfilter/exceptionhandling.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new AllExceptionFiler())
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
