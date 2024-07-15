import { ApiProperty } from '@nestjs/swagger';
import { DEFAULT_ERROR_MESSAGE_TYPE, MessageTypeVo } from 'src/domain/value-object/message/message-type';

export class ErrorMessageEntity {
  constructor (error: any) {
    const messageTypeVo = new MessageTypeVo(DEFAULT_ERROR_MESSAGE_TYPE);
    this.message_type = messageTypeVo.getValue();
    this.error = error;
  }

  @ApiProperty({ example: DEFAULT_ERROR_MESSAGE_TYPE })
  message_type: string;

  @ApiProperty({ example: '' })
  error: any;
}