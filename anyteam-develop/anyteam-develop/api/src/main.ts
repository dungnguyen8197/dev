import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomLogger } from './logger/logger.service';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule, { logger: false });
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(CustomLogger));
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true }));

  // TODO: CORS有効化（一旦ローカルだけ）
  app.enableCors({
    origin: '*',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  const configService = app.get(ConfigService);

  // TODO: nowvoiceに揃える形でscriptに移管したら処理消す
  if (configService.get('NODE_ENV') === 'develop') {
    const config = new DocumentBuilder()
      .setTitle('ANYTEAM API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);

    fs.writeFileSync(
      path.join(__dirname, 'openapi.json'),
      JSON.stringify(document, undefined, 2),
    );
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
