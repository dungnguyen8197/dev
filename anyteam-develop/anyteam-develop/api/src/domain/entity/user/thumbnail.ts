import { ApiProperty } from '@nestjs/swagger';

export class UserThumbnailEntity {
  @ApiProperty({
    example: 'xxxx.jpg',
  })
  thumbnail: string;

  constructor(thumbnail: string) {
    this.thumbnail = thumbnail;
  }
}
