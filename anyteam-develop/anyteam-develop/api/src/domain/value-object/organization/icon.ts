import { ApiProperty } from '@nestjs/swagger';

const DIRECTORY_PATH = 'images/thumbnails/';

export class OrganizationIconVo {
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
    return process.env.AWS_BUCKET_URL + this.getPath();
  }
}
