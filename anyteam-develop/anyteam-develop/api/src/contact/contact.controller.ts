import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { UserContactRequest } from './dto/user-contact.dto';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('api/v1/contact')
  @ApiOperation({
    tags: ['other'],
    summary: '/api/v1/contact',
    description: 'Post user contact',
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async createUserContact(@Body() userContactRequest: UserContactRequest) {
    return this.contactService.createUserContact(userContactRequest);
  }
}
