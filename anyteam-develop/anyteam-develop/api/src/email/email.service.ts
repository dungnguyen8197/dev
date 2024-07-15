import sendgrid = require('@sendgrid/mail');
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    sendgrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async send(msg) { // TODO: MessageObject作る
    await sendgrid.send(msg);
  }
}
