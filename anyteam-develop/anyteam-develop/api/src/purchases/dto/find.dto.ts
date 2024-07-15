import * as moment from 'moment';

import { ApiProperty } from '@nestjs/swagger';
import { Purchase } from 'src/entity/purchase.entity';

export class FindPurchaseByIdResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  type: number;

  @ApiProperty({ example: 1000 })
  amount: number;

  @ApiProperty({ example: '2021-07-01 00:00:00' })
  purchased_at: Date | string;

  @ApiProperty({ example: 1 })
  organization_id: number;

  @ApiProperty({ example: '運動大学' })
  organization_name: string;

  @ApiProperty({ example: 1 })
  team_id: number;

  @ApiProperty({ example: 'アイスホッケー部' })
  team_name: string;

  @ApiProperty({
    example:
      'https://resource.anyteam.jp/images/rewards/reward-20211224012345678.png',
  })
  reward: string;

  constructor(
    purchases: Purchase,
    purchase_team_id: number,
    team_name: string,
    organization_id: number,
    organization_name: string,
    rewardUrl: string,
  ) {
    this.id = purchases.id;
    this.type = purchases.type;
    this.amount = purchases.amount;
    this.purchased_at = moment(purchases.created_at).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    this.organization_id = organization_id;
    this.organization_name = organization_name;
    this.team_id = purchase_team_id;
    this.team_name = team_name;
    this.reward = rewardUrl;
  }
}
