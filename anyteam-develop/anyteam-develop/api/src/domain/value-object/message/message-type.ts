import { ApiProperty } from "@nestjs/swagger";

export const DEFAULT_SUCCESS_MESSAGE_TYPE = 'success';
export const DEFAULT_ERROR_MESSAGE_TYPE = 'error';

export class MessageTypeVo {
  @ApiProperty()
  value: string;

  constructor(value: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
