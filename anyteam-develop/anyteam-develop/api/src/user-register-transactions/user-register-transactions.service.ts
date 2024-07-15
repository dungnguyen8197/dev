import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterTransaction } from 'src/entity/user-register-transaction.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class UserRegisterTransactionService {
  constructor(
    @InjectRepository(UserRegisterTransaction)
    private readonly userRegisterTransactionRepository: Repository<UserRegisterTransaction>,
    private connection: Connection
  ) {}

  async create(email: string): Promise<number> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entity = new UserRegisterTransaction();
      entity.email = email;

      const result = { id: null };
      const insertedEntity = await queryRunner.manager.insert(UserRegisterTransaction, entity);
      insertedEntity.identifiers.map(identifier => {
        result.id = identifier.id;
      });

      if (result.id === null) {
        // TODO: 汎用エラー（保存に失敗）
        throw new BadRequestException();
      }

      await queryRunner.commitTransaction();
      return result.id;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  findOne(id: UserRegisterTransaction['id'])
  : Promise<UserRegisterTransaction|undefined> {
    return this.userRegisterTransactionRepository.findOne(id);
  }
}
