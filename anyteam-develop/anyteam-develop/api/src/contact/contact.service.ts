import { EmailService } from 'src/email/email.service';
import { Injectable } from '@nestjs/common';
import { UserContactRequest } from './dto/user-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly emailService: EmailService) {}

  async createUserContact(
    userContactRequest: UserContactRequest,
  ): Promise<void> {
    await this.sendMail(userContactRequest);
    return;
  }

  async sendMail(userContactRequest: UserContactRequest): Promise<void> {
    const { email, title, message } = userContactRequest;
    const msg = {
      to: 'developers@anyteam.jp',
      from: email,
      subject: title,
      text: message,
    };
    await this.emailService.send(msg);
    return;
  }
}
