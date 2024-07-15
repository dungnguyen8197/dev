import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorMessageEntity } from 'src/domain/entity/message/error-message';
import { EmailService } from 'src/email/email.service';
import { UserEmailUpdateTransaction } from 'src/entity/user-email-update-transaction.entity';
import { User } from 'src/entity/user.entity';
import { Connection, MoreThan, Repository } from 'typeorm';

@Injectable()
export class UserEmailUpdateTransactionsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserEmailUpdateTransaction)
    private readonly userEmailUpdateTransactionRepository: Repository<UserEmailUpdateTransaction>,
    private readonly emailService: EmailService,
    private connection: Connection,
  ) {}

  async update(email: string, user_id: number): Promise<boolean> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userCheckEmail = await this.userRepository.findOne({
        where: { email, is_active: true },
      });

      if (userCheckEmail) {
        const errorMessageObject = new ErrorMessageEntity(
          'メールアドレス使用済み',
        );
        throw new ConflictException(errorMessageObject);
      }

      const verifyCodeOld = await this.findByUserId(user_id);
      if (verifyCodeOld) {
        await queryRunner.manager.delete(
          UserEmailUpdateTransaction,
          verifyCodeOld.id,
        );
      }

      const verifyCodeNew = String(Math.random()).substring(2, 8); // TODO: set verify code length 6 characters

      const entity = new UserEmailUpdateTransaction();
      entity.email = email;
      entity.code = verifyCodeNew;
      entity.user_id = user_id;

      const result = { id: null };
      const insertedEntity = await queryRunner.manager.insert(
        UserEmailUpdateTransaction,
        entity,
      );

      insertedEntity.identifiers.map((identifier) => {
        result.id = identifier.id;
      });

      if (result.id === null) {
        // TODO: 汎用エラー（保存に失敗）
        throw new BadRequestException();
      }

      const msg = {
        // TODO: エンティティ化
        to: email,
        from: 'developers@anyteam.jp', // TODO: env管理
        subject: 'subject test',
        text: 'plain text', // TODO: メールテンプレート化
        html: '<strong>Code : ' + verifyCodeNew + '</strong>', // TODO: メールテンプレート化
      };
      await this.emailService.send(msg);

      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findVerifyCode(
    code: string,
    user_id: number,
  ): Promise<UserEmailUpdateTransaction> {
    const timeline = await this.getTimelineExpired(24); //TODO: set time expired 24h

    const userEmailUpdateTransaction =
      await this.userEmailUpdateTransactionRepository.findOne({
        where: {
          code: code,
          user_id: user_id,
          created_at: MoreThan(new Date(timeline)),
        },
      });
    return userEmailUpdateTransaction;
  }

  async findByUserId(user_id: number): Promise<UserEmailUpdateTransaction> {
    return await this.userEmailUpdateTransactionRepository.findOne({
      where: { user_id: user_id },
    });
  }

  async getTimelineExpired(hours) {
    const now = new Date();
    const result = new Date().setHours(now.getHours() - hours);
    return result;
  }
}
