import { ApiProperty } from '@nestjs/swagger';

const NAME_LINES = [
  { id: 1, name: 'ア行' },
  { id: 2, name: 'カ行' },
  { id: 3, name: 'サ行' },
  { id: 4, name: 'タ行' },
  { id: 5, name: 'ナ行' },
  { id: 6, name: 'ハ行' },
  { id: 7, name: 'マ行' },
  { id: 8, name: 'ヤ行' },
  { id: 9, name: 'ラ行' },
  { id: 10, name: 'ワ行' },
];

export class NameLineVo {
  @ApiProperty({ example: 'ア行' })
  readonly name: string;

  constructor(id: number) {
    this.name = NAME_LINES.find((group) => group.id === id).name;
  }

  getName() {
    return this.name || '';
  }
}
