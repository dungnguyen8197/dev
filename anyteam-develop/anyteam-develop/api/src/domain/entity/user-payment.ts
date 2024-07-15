import * as moment from 'moment';

import { ApiProperty } from '@nestjs/swagger';
import { PaymentAmountVo } from '../value-object/payment/amount';
import { PurchaseTypeVo } from '../value-object/purchase/type';
import { TeamFullNameVo } from '../value-object/team/full-name';

export class UserPaymentEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2021-12-01 00:00:00' })
  created_at: Date | string;

  @ApiProperty({ example: 1500 })
  amount: number;

  @ApiProperty({ example: '定期' })
  type: string;

  @ApiProperty({ example: 10 })
  team_id: number;

  @ApiProperty({ example: '運動通信高校アメリカンフットボール部' })
  team_name: string;

  constructor(
    id: number,
    created_at: Date | string,
    amount: number,
    type: number,
    team_id: number,
    team_name: string,
    organization_name: string,
  ) {
    const amountVo = new PaymentAmountVo(amount);
    const typeVo = new PurchaseTypeVo(type);
    const teamNameVo = new TeamFullNameVo(organization_name, team_name);

    this.id = id;
    this.created_at = moment(created_at).format('YYYY-MM-DD HH:mm:ss');
    this.amount = amountVo.getValue();
    this.type = typeVo.getLabel();
    this.team_id = team_id;
    this.team_name = teamNameVo.getFullName();
  }
}
