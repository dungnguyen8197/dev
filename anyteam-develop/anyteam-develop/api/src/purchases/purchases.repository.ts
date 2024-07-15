import { EntityRepository, Repository, getConnection } from 'typeorm';

import { JwtPayload } from 'src/auth/jwt.strategy';
import { Purchase } from 'src/entity/purchase.entity';
import { PurchaseRequest } from './dto/register.dto';

@EntityRepository(Purchase)
export class PurchaseRepository extends Repository<Purchase> {
  async getPurchaseDetail(purchase_id): Promise<Purchase> {
    const conditionQuery = this.createQueryBuilder(
      'purchases',
    ).leftJoinAndSelect(
      'purchases.purchase_team_attribute',
      'purchase_team_attribute',
    );
    conditionQuery.leftJoinAndSelect('purchases.reward', 'reward');
    conditionQuery.leftJoinAndSelect('purchase_team_attribute.team', 'team');
    conditionQuery.leftJoinAndSelect('team.organization', 'organization');

    const purchase = await conditionQuery
      .where('purchases.id = :id', { id: purchase_id })
      .getOne();
    return purchase;
  }

  async createPurchase(
    user: JwtPayload,
    purchaseRequest: PurchaseRequest,
    purchasedAt: Date,
  ): Promise<Purchase> {
    const { amount, type } = purchaseRequest;
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const purchaserEntity = new Purchase();
      purchaserEntity.amount = amount;
      purchaserEntity.user_id = user.userId;
      purchaserEntity.status = 1; //TODO : はdefaultのvalidでOKです。
      purchaserEntity.type = type;
      purchaserEntity.purchased_at = purchasedAt;
      await queryRunner.manager.insert(Purchase, purchaserEntity);

      await queryRunner.commitTransaction();
      return purchaserEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getByUserId(userId: number): Promise<Purchase[]> {
    const conditionQuery = this.createQueryBuilder(
      'purchases',
    ).leftJoinAndSelect(
      'purchases.purchase_team_attribute',
      'purchase_team_attribute',
    );
    conditionQuery.leftJoinAndSelect('purchases.reward', 'reward');
    conditionQuery.leftJoinAndSelect('purchase_team_attribute.team', 'team');
    conditionQuery.leftJoinAndSelect('team.organization', 'organization');

    return await conditionQuery
      .where('purchases.user_id = :userId', { userId })
      .andWhere('purchases.is_active = :isActive', { isActive: true })
      .getMany();
  }
}
