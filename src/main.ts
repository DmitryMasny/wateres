import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5500;
  const app = await NestFactory.create(AppModule);

  // Устанавливаем глобальный префикс для всех маршрутов
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder().setTitle('Wateres').setDescription('Документация REST API').setVersion('1.0.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => {
    console.log(`App start on port ${PORT}`);
  });
}
bootstrap();
