import { ApiProperty } from '@nestjs/swagger';
import { FilesService } from 'src/files/files.service';

const DIRECTORY_PATH = 'images/thumbnails/';

export class UserThumbnailVo {
  @ApiProperty()
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  getDirectory(): string {
    return DIRECTORY_PATH;
  }

  getPath(): string {
    return DIRECTORY_PATH + this.value;
  }

  getUrl(): string {
    return this.value && this.value.length > 0
      ? process.env.AWS_BUCKET_URL + this.getPath()
      : null;
  }
}
