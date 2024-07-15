import bcrypt = require('bcrypt');
import crypto = require('crypto');
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import * as microtime from 'microtime';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  Injectable,
  Logger,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entity/user.entity';
import { Team } from 'src/entity/team.entity';
import { UserProfile } from 'src/entity/user-profile.entity';
import { Wallet } from 'src/entity/wallet.entity';
import { PaymentTransaction } from 'src/entity/payment_transaction.entity';
import { EmailService } from 'src/email/email.service';
import { UserRegisterTransactionService } from 'src/user-register-transactions/user-register-transactions.service';
import { UserRegisterRequest } from 'src/users/dto/register.dto';
import { UserCheckEmailRequest } from './dto/check-email.dto';
import { UserProfileRequest } from './dto/profile.dto';
import { ErrorMessageEntity } from 'src/domain/entity/message/error-message';
import { FilesService } from 'src/files/files.service';
import { UserProfileEntity } from 'src/domain/entity/user/profile';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { UserThumbnailEntity } from 'src/domain/entity/user/thumbnail';
import { UserThumbnailVo } from 'src/domain/value-object/user/thumbnail';
import { UserUpdateEmailRequest } from './dto/update-email.dto';
import { UserEmailUpdateTransactionsService } from 'src/user-email-update-transactions/user-email-update-transactions.service';
import { UserVerifyCodeRequest } from './dto/verify-code.dto';
import { UserEmailUpdateTransaction } from 'src/entity/user-email-update-transaction.entity';
import { PaymentGmoAttribute } from 'src/entity/payment-gmo-attribute.entity';
import { Payment } from 'src/entity/payment.entity';
import { UserPaymentList } from 'src/domain/entity/user/payment-list';
import { UserPaymentEntity } from 'src/domain/entity/user-payment';
import { GetUserPaymentListRequest } from './dto/payment-list.dto';
import { GetWalletResponse, UpdateWalletRequest } from './dto/wallet';
import { GmoService, GMO_JOB_CD_CHECK } from 'src/gmo/gmo.service';
import { PasswordRequest } from './dto/password.dto';
import { GmoErrorCode } from 'src/helper/gmo-error-code';
import { PaymentGMOResponse } from 'src/gmo/dto/payment';
import { GMO_METHOD } from '../gmo/gmo.service';
import { PurchaseRepository } from '../purchases/purchases.repository';
import { Purchase } from 'src/entity/purchase.entity';
import { SUBSCRIPTION } from 'src/domain/value-object/purchase/type';

// TODO: 値ならびに管理方法検討
const ENCRYPTION_KEY = 'HH95XH7sYAbznRBJSUE9W8RQxzQIGSpy';
const BUFFER_KEY = 'RfHBdAR5RJHqp5wm';
const ENCRYPT_METHOD = 'aes-256-cbc';
const ENCODING = 'hex';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private purchaseRepository: PurchaseRepository,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private connection: Connection,
    private readonly configService: ConfigService,
    private readonly userRegisterTransactionService: UserRegisterTransactionService,
    private readonly userEmailUpdateTransactionsService: UserEmailUpdateTransactionsService,
    private readonly emailService: EmailService,
    private readonly filesService: FilesService,
    private readonly gmoService: GmoService,
  ) {}

  async checkEmail(req: UserCheckEmailRequest): Promise<void> {
    const user = await this.findByEmail(req.email);
    if (user) {
      const errorMessageObject = new ErrorMessageEntity(
        'メールアドレス使用済み',
      ); // TODO: 内容調整
      throw new ConflictException(errorMessageObject);
    }

    const transactionId = await this.userRegisterTransactionService.create(
      req.email,
    );
    const appUrl =
      this.configService.get('APP_URL') +
      '/user/register/' +
      this.generateKeyForRegister({ transaction_id: transactionId });

    const msg = {
      // TODO: エンティティ化
      to: req.email,
      from: 'developers@anyteam.jp', // TODO: env管理
      subject: 'subject test',
      text: 'plain text', // TODO: メールテンプレート化
      html: '<strong>' + appUrl + '</strong>', // TODO: メールテンプレート化
    };
    const sendResult = await this.emailService.send(msg);
    // TODO: この後の処理
  }

  async register(req: UserRegisterRequest): Promise<boolean> {
    const { key, password } = req;

    // TODO: 復号化できなかったときに500エラー返してるかも。確認。
    const decryptedKey = JSON.parse(this.decryptedKeyForRegister(key));
    if (!decryptedKey.transaction_id) {
      throw new BadRequestException();
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const transaction = await this.userRegisterTransactionService.findOne(
        decryptedKey.transaction_id,
      );
      if (!transaction || !transaction.email) {
        throw new BadRequestException();
      }

      const currentUser = await this.findByEmail(transaction.email);
      if (currentUser) {
        throw new ConflictException({
          message_type: 'error',
          error: { email: 'メールアドレス使用済み' },
        });
      }

      const userEntity = new User();
      userEntity.uid = uuidv4();
      userEntity.email = transaction.email;
      userEntity.password = await this.hashPassword(password);

      const user = await queryRunner.manager.insert(User, userEntity);

      user.identifiers.map(async (identifier) => {
        if (!identifier.id) {
          throw new BadRequestException();
        }

        const userProfileEntity = new UserProfile();
        userProfileEntity.user_id = identifier.id;

        await queryRunner.manager.insert(UserProfile, userProfileEntity);
      });

      await transaction.remove();
      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findOne(id: User['id'], relations: string[] = []): Promise<User> {
    const user = this.userRepository.findOne(id, {
      where: { is_active: true },
      relations,
    });
    if (!user) {
      throw new BadRequestException();
    }
    return user;
  }

  findByEmail(email: User['email'], relations: string[] = []): Promise<User> {
    const user = this.userRepository.findOne({
      where: { email, is_active: true },
      relations,
    });
    if (!user) {
      throw new BadRequestException();
    }
    return user;
  }

  private generateKeyForRegister(req: { transaction_id: number }): string {
    const iv = Buffer.from(BUFFER_KEY);
    const cipher = crypto.createCipheriv(
      ENCRYPT_METHOD,
      Buffer.from(ENCRYPTION_KEY),
      iv,
    );
    let encrypted = cipher.update(JSON.stringify(req));

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString(ENCODING);
  }

  private decryptedKeyForRegister(req: string): string {
    const iv = Buffer.from(BUFFER_KEY);
    const encryptedText = Buffer.from(req, ENCODING);
    const decipher = crypto.createDecipheriv(
      ENCRYPT_METHOD,
      Buffer.from(ENCRYPTION_KEY),
      iv,
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  // パスワードハッシュ化
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS');
    const salt = await bcrypt.genSalt(parseInt(saltRounds));
    return bcrypt.hashSync(password, salt);
  }

  async updateIcon(icon: Express.Multer.File): Promise<UserThumbnailEntity> {
    const userThumbnail = new UserThumbnailVo(icon.originalname);
    const directoryPath = userThumbnail.getDirectory();
    const resizeIcon = await sharp(icon.buffer).resize(100, 100).toBuffer(); // TODO: resize icon 100 x 100
    const contentType = icon.mimetype;
    try {
      const iconUpload = await this.filesService.uploadPublicFile(
        resizeIcon,
        icon.originalname,
        directoryPath,
        contentType,
      );
      return new UserThumbnailEntity(iconUpload);
    } catch (err) {
      throw err;
    }
  }

  async getProfile(user: JwtPayload): Promise<UserProfileEntity> {
    const userEntity = await this.findOne(user.userId, ['user_profile']);
    const thumbnail = userEntity.user_profile.thumbnail;
    const userThumbnail = new UserThumbnailVo(thumbnail);
    const directoryPath = userThumbnail.getDirectory();
    const userThumbnailUrl =
      thumbnail && thumbnail.length > 0
        ? await this.filesService.getSignedUrlS3(
            userEntity.user_profile.thumbnail,
            directoryPath,
          )
        : null;
    return new UserProfileEntity(
      userEntity,
      userEntity.user_profile,
      userThumbnailUrl,
    );
  }

  async updateProfile(
    user: JwtPayload,
    profileRequest: UserProfileRequest,
  ): Promise<void> {
    const userEntity = await this.findOne(user.userId, ['user_profile']);

    if (
      profileRequest.thumbnail &&
      profileRequest.thumbnail !== userEntity.user_profile.thumbnail
    ) {
      const userThumbnail = new UserThumbnailVo(
        userEntity.user_profile.thumbnail,
      );
      const directoryPath = userThumbnail.getDirectory();

      await this.filesService.deleteFileS3(
        userEntity.user_profile.thumbnail,
        directoryPath,
      );
    }

    await this.userProfileRepository.update(
      userEntity.user_profile.id,
      profileRequest,
    );
  }

  async requestUpdateEmailAddress(
    req: UserUpdateEmailRequest,
    user: JwtPayload,
  ): Promise<boolean> {
    const { email } = req;
    return await this.userEmailUpdateTransactionsService.update(
      email,
      user.userId,
    );
  }

  async updateEmailAddress(
    req: UserVerifyCodeRequest,
    user: JwtPayload,
  ): Promise<boolean> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { code } = req;
      const userEmailUpdateTransaction =
        await this.userEmailUpdateTransactionsService.findVerifyCode(
          code,
          user.userId,
        );

      if (!userEmailUpdateTransaction) {
        throw new BadRequestException();
      }

      const userEntity = await this.findOne(user.userId);
      userEntity.email = userEmailUpdateTransaction.email;
      await queryRunner.manager.update(User, user.userId, userEntity);

      const verifyCodeOld =
        await this.userEmailUpdateTransactionsService.findByUserId(user.userId);

      if (verifyCodeOld) {
        await queryRunner.manager.delete(
          UserEmailUpdateTransaction,
          verifyCodeOld.id,
        );
      }

      await queryRunner.commitTransaction();

      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getPayments(
    user: JwtPayload,
    req: GetUserPaymentListRequest,
  ): Promise<UserPaymentList> {
    const limit = Number(req.limit) || 20;
    const offset = Number(req.offset) || 0;
    try {
      const paymentHistory = (
        await this.getUserPaymentHistory(user.userId, limit, offset)
      ).map((item) => {
        return new UserPaymentEntity(
          item.id,
          item.created_at,
          item.amount,
          item.purchase.type,
          item.purchase.purchase_team_attribute.team.id,
          item.purchase.purchase_team_attribute.team.name,
          item.purchase.purchase_team_attribute.team.organization.name,
        );
      });
      const count = await this.userPaymentHistoryCount(user.userId);
      return new UserPaymentList(paymentHistory, count, Number(offset));
    } catch (err) {
      throw err;
    }
  }

  async getWallet(user: JwtPayload): Promise<GetWalletResponse> {
    try {
      const wallet = await this.walletRepository.findOne({
        where: { user_id: user.userId },
      });
      if (!wallet) {
        throw new NotFoundException();
      }
      return new GetWalletResponse(
        wallet.card_no,
        wallet.payment_method,
        wallet.expiration_year,
        wallet.expiration_month,
        wallet.enabled,
      );
    } catch (err) {
      throw err;
    }
  }

  async updateWallet(user: JwtPayload, req: UpdateWalletRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let wallet = await this.walletRepository.findOne({
        where: { user_id: user.userId },
      });
      const checkHasWallet = wallet ? true : false;
      // 2. クレジットカード情報入力画面でトークンを取得する
      const paymentTransactionEntity = new PaymentTransaction();
      paymentTransactionEntity.user_id = user.userId;
      await queryRunner.manager.insert(
        PaymentTransaction,
        paymentTransactionEntity,
      );
      // 3. walletを作成（更新）し、wallet_idを発行する
      if (wallet) {
        wallet.card_no = req.card_no;
        wallet.expiration_month = req.expiration_month;
        wallet.expiration_year = req.expiration_year;
        wallet.enabled = false; //wallet not exist default enabled false
        await queryRunner.manager.update(Wallet, wallet.id, wallet);
      } else {
        const walletEntity = new Wallet();
        walletEntity.card_no = req.card_no;
        walletEntity.expiration_month = req.expiration_month;
        walletEntity.expiration_year = req.expiration_year;
        walletEntity.user_id = user.userId;
        walletEntity.payment_method = 1; // Default payment method is credit card
        await queryRunner.manager.insert(Wallet, walletEntity);
        wallet = walletEntity;
      }
      // 4. GMOPG APIで取引登録を行う
      // 5. GMOPG APIでクレジット決済の有効性チェックする
      // 6. GMOPG APIでGMO会員登録する
      // 7. GMOPG APIで登録されたGMO会員情報にクレジットカード情報を追加する
      const OrderID = `at-${microtime.now()}`;

      const GMOPGResponse = await this.gmoService.GMOPaymentGeteway(
        req,
        OrderID,
        wallet.id,
        checkHasWallet,
      );
      // 8. 決済処理の結果を保存する
      const paymentEntity = new Payment();
      paymentEntity.wallet_id = wallet.id;
      paymentEntity.purchase_id = null; // Default purchase id is null
      paymentEntity.amount = 0;
      await queryRunner.manager.insert(Payment, paymentEntity);

      const paymentGmoAttributeEntity = new PaymentGmoAttribute();
      paymentGmoAttributeEntity.payment_id = paymentEntity.id;
      paymentGmoAttributeEntity.order_id = OrderID;
      paymentGmoAttributeEntity.job_cd = GMO_JOB_CD_CHECK;
      paymentGmoAttributeEntity.is_success = GMOPGResponse.IsSuccess;
      paymentGmoAttributeEntity.method = GMO_METHOD;
      paymentGmoAttributeEntity.access_id = GMOPGResponse.AccessID;
      paymentGmoAttributeEntity.access_pass = GMOPGResponse.AccessPass;
      paymentGmoAttributeEntity.approve = GMOPGResponse.Approve;
      paymentGmoAttributeEntity.tran_id = GMOPGResponse.TranID;
      paymentGmoAttributeEntity.tran_date = GMOPGResponse.TranDate;
      paymentGmoAttributeEntity.forward = GMOPGResponse.Forward;
      paymentGmoAttributeEntity.error_info = JSON.parse(
        JSON.stringify(GMOPGResponse.ErrorGMO),
      );
      await queryRunner.manager.insert(
        PaymentGmoAttribute,
        paymentGmoAttributeEntity,
      );

      // 9. walletを更新する
      wallet.enabled = GMOPGResponse.IsSuccess;
      await queryRunner.manager.update(Wallet, wallet.id, wallet);
      // 10. ユーザー単位の決済登録トランザクションを終了する
      await queryRunner.manager.delete(
        PaymentTransaction,
        paymentTransactionEntity.id,
      );
      await queryRunner.commitTransaction();
      if (!GMOPGResponse.IsSuccess) {
        await this.sendMailErrorGMO(wallet.id, GMOPGResponse);
        return new BadRequestException(GMOPGResponse.ErrorGMO);
      }
      return { status: HttpStatus.OK };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      Logger.log(`Update Wallet Error: ${user.userId} - ${err}`);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async sendMailErrorGMO(wallet_id: number, GMOPGResponse: PaymentGMOResponse) {
    const messageOptions = {
      to: 'developers@anyteam.jp',
      from: 'developers@anyteam.jp',
      subject: 'Error in GMO Payment',
      html: `
      Wallet: <strong>${wallet_id}</strong>
      <ul>
        <li>- ErrCode : <strong>${GMOPGResponse.ErrorGMO.ErrCode}</strong></li>
        <li>- ErrInfo: <strong>${GMOPGResponse.ErrorGMO.ErrInfo}</strong></li>
        <li>- ErrMessage : <strong>${
          GmoErrorCode[GMOPGResponse.ErrorGMO.ErrInfo]
        }</strong></li>
      </ul>`,
    };
    await this.emailService.send(messageOptions);
  }

  async getUserPaymentHistory(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<any> {
    return await this.paymentRepository.find({
      relations: [
        'purchase',
        'purchase.purchase_team_attribute',
        'purchase.purchase_team_attribute.team',
        'purchase.purchase_team_attribute.team.organization',
      ],
      where: {
        purchase: { user_id: userId },
      },
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });
  }

  async userPaymentHistoryCount(userId: number) {
    return await this.paymentRepository.count({
      relations: ['purchase'],
      where: {
        purchase: { user_id: userId },
      },
    });
  }

  async updatePassword(
    user: JwtPayload,
    passwordRequest: PasswordRequest,
  ): Promise<boolean> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { current_password, new_password } = passwordRequest;

      const userEntity = await this.findOne(user.userId);

      const isPasswordMatching = await bcrypt.compare(
        current_password,
        userEntity.password,
      );
      if (!isPasswordMatching) {
        throw new UnauthorizedException();
      }

      userEntity.password = await this.hashPassword(new_password);

      await queryRunner.manager.update(User, user.userId, userEntity);
      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(user: JwtPayload): Promise<void> {
    try {
      const userEntity = await this.findOne(user.userId);
      const purchases = await this.purchaseRepository.getByUserId(user.userId);
      if (purchases.length > 0) {
        throw new BadRequestException({ has_purchases: true });
      }

      userEntity.is_active = false;
      await this.userRepository.save(userEntity);
    } catch (err) {
      throw err;
    }
  }

  async isSubscribeTeam(user: JwtPayload, teamId: number): Promise<boolean> {
    const team = await this.teamRepository.findOne(teamId);
    if (!team) {
      throw new BadRequestException('Team not found');
    }

    const purchases = await this.purchaseRepository.find({
      relations: ['purchase_team_attribute'],
      where: {
        user_id: user.userId,
        type: SUBSCRIPTION,
        purchase_team_attribute: {
          team_id: teamId,
        },
      },
    });

    return purchases.length !== 0;
  }

  async cancelPurchase(user: JwtPayload, purchaseId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const purchaseEntity = await this.purchaseRepository.findOne(purchaseId);
      if (!purchaseEntity || purchaseEntity.user_id != user.userId) {
        throw new BadRequestException();
      }

      purchaseEntity.is_active = false;
      await queryRunner.manager.update(Purchase, purchaseId, purchaseEntity);
      await queryRunner.commitTransaction();

      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
