import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../app.module';

async function exportOpenapiJson() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  if (configService.get('NODE_ENV') !== 'develop') {
    return; // do nothing
  }

  const config = new DocumentBuilder()
    .setTitle('ANYTEAM API')
    .setVersion('1.0.0') // TODO: バージョン指定方法検討
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // ファイル出力
  fs.writeFileSync('./openapi.json', JSON.stringify(document, undefined, 2));
}

exportOpenapiJson();
