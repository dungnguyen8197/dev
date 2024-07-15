import { ApiProperty } from '@nestjs/swagger';

const DIRECTORY_PATH = 'images/rewards/';
const DIRECTORY_PATH_TMP = 'images/rewards/output/';
const DIRECTORY_PATH_OGP_DEFAULT = 'images/rewards/default/OGP_default.png';

export class RewardFilenameVo {
  @ApiProperty()
  readonly value: string;

  constructor(value?: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  getDirectory(): string {
    return DIRECTORY_PATH;
  }

  getDirectoryTmp(): string {
    return DIRECTORY_PATH_TMP;
  }

  getPathTmp(): string {
    return DIRECTORY_PATH_TMP + this.value;
  }

  getPathOGPTmp(): string {
    return DIRECTORY_PATH_TMP + 'OGP_' + this.value;
  }

  getPathOGPDefault(): string {
    return DIRECTORY_PATH_OGP_DEFAULT;
  }
}
