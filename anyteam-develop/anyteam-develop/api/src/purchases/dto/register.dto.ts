import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BodyRewardFileDto {
  @ApiProperty({ example: 'ご支援感謝状' })
  @IsNotEmpty()
  content: any;

  constructor(userName: string, nameGroup: string, dateTime: Date) {
    const date = new Date(dateTime).getDate();
    const month = new Date(dateTime).getMonth() + 1;
    const year = new Date(dateTime).getFullYear();
    this.content = [
      {
        text: userName,
        top: 100,
        left: 0,
        font_size: 40,
      },
      {
        text: nameGroup + 'は',
        top: 160,
        left: 0,
        font_size: 30,
      },
      {
        text: 'この度、貴殿からのご支援を頂戴いたしました。',
        top: 220,
        left: 0,
        font_size: 30,
      },
      {
        text: 'チーム一同、心より感謝申し上げます。',
        top: 280,
        left: 0,
        font_size: 30,
      },
      {
        text: '今後もチームの成長と発展のため、全力を尽くします。',
        top: 340,
        left: 0,
        font_size: 30,
      },
      {
        text: `${year}年${month}月${date}${nameGroup}一同`,
        top: 430,
        left: 0,
        font_size: 25,
      },
    ];
  }
}

export class PurchaseRequest {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  team_id: number;

  @ApiProperty({ example: 500 })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  type: number;
}

export class PurchaseResponse {
  @ApiProperty({ example: 1 })
  purchase_id: number;
  constructor(purchase_id: number) {
    this.purchase_id = purchase_id;
  }
}
