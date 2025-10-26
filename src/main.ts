import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // سمح لـ localhost:3000
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS', // الطرق المسموحة
    credentials: true, // مهم عشان الكوكيات
  });

  const config = new DocumentBuilder()

    .setTitle('Rewayati API') // عنوان الوثائق
    .setDescription('API Documentation for Rewayati project') // الوصف
    .setVersion('1.0') // رقم الإصدار
    .addBearerAuth() // لو تستخدم JWT أو Authorization header
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
