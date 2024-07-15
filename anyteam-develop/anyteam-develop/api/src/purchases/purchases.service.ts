import * as fs from 'fs';
import * as sharp from 'sharp';
import * as microtime from 'microtime';

import {
  BodyRewardFileDto,
  PurchaseRequest,
  PurchaseResponse,
} from './dto/register.dto';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { RewardFilenameVo } from 'src/domain/value-object/reward/filename';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindPurchaseByIdResponse } from './dto/find.dto';
import { PurchaseRepository } from './purchases.repository';
import { TeamFullNameVo } from 'src/domain/value-object/team/full-name';
import { Team } from 'src/entity/team.entity';
import { Reward } from 'src/entity/reward.entity';
import { PurchaseTeamAttribute } from 'src/entity/purchase-team-attribute.entity';
import { PaymentTransaction } from 'src/entity/payment_transaction.entity';
import {
  GmoService,
  GMO_JOB_CD_CAPTURE,
  GMO_METHOD,
} from 'src/gmo/gmo.service';
import { RegisterGMOResponse } from 'src/gmo/dto/register';
import { GmoErrorCode } from 'src/helper/gmo-error-code';
import { PurchaseValidateCardGMOResponse } from 'src/gmo/dto/validate-card';
import { ErrorGMOResponse } from '../gmo/dto/error';
import { EmailService } from 'src/email/email.service';
import { Payment } from 'src/entity/payment.entity';
import { PaymentGmoAttribute } from 'src/entity/payment-gmo-attribute.entity';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionRepository: Repository<PaymentTransaction>,
    private purchaseRepository: PurchaseRepository,
    private readonly filesService: FilesService,
    private readonly gmoService: GmoService,
    private readonly emailService: EmailService,
    private connection: Connection,
  ) {}

  async create(jwtPayload: JwtPayload, req: PurchaseRequest) {
    const date = new Date();

    if (
      (await this.paymentTransactionRepository.count({
        user_id: jwtPayload.userId,
      })) > 0
    ) {
      throw new BadRequestException();
    }
    const paymentTransaction = await this.paymentTransactionRepository
      .create({
        user_id: jwtPayload.userId,
      })
      .save();
    const {
      AccessID,
      AccessPass,
      Approve,
      Forward,
      TranID,
      TranDate,
      OrderID,
      allSuccess,
    } = await this.validateCreditCardGMO(jwtPayload.userId, req.amount);

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne(jwtPayload.userId, {
        where: { is_active: true },
        relations: ['user_profile', 'wallet'],
      });
      const team = await this.teamRepository.findOne(req.team_id, {
        relations: ['organization'],
      });

      if (!team || !user) {
        throw new BadRequestException();
      }

      const purchaseEntity = await this.purchaseRepository.createPurchase(
        jwtPayload,
        req,
        date,
      );
      await this.insertPurchaseTeamAttribute(
        queryRunner,
        req.team_id,
        purchaseEntity.id,
      );

      const payment = await this.insertPayment(
        queryRunner,
        jwtPayload.userId,
        purchaseEntity.id,
        req.amount,
      );

      await this.insertPaymentGMOAttribute(
        queryRunner,
        payment.id,
        OrderID,
        allSuccess,
        AccessID,
        AccessPass,
        Approve,
        Forward,
        TranID,
        TranDate,
      );

      const reward = await this.rewardUploadS3(team, user, date);
      await this.insertReward(queryRunner, reward, purchaseEntity.id);

      await queryRunner.commitTransaction();
      await this.paymentTransactionRepository.delete(paymentTransaction.id);

      return new PurchaseResponse(purchaseEntity.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async insertPurchaseTeamAttribute(
    queryRunner: QueryRunner,
    teamId: number,
    purchaseId: number,
  ): Promise<void> {
    const purchaseTeamAttributeEntity = new PurchaseTeamAttribute();
    purchaseTeamAttributeEntity.team_id = teamId;
    purchaseTeamAttributeEntity.purchase_id = purchaseId;
    await queryRunner.manager.insert(
      PurchaseTeamAttribute,
      purchaseTeamAttributeEntity,
    );
  }

  async insertReward(
    queryRunner: QueryRunner,
    reward: string,
    purchaseId: number,
  ): Promise<void> {
    const rewardEntity = new Reward();
    rewardEntity.filename = reward;
    rewardEntity.purchase_id = purchaseId;

    await queryRunner.manager.insert(Reward, rewardEntity);
  }

  async insertPayment(
    queryRunner: QueryRunner,
    userId: number,
    purchaseId: number,
    amount: number,
  ): Promise<Payment> {
    const user = await this.userRepository.findOne(userId, {
      where: { is_active: true },
      relations: ['wallet'],
    });
    if (!user) {
      throw new BadRequestException();
    }
    const paymentEntity = new Payment();
    paymentEntity.wallet_id = user.wallet.id;
    paymentEntity.purchase_id = purchaseId;
    paymentEntity.amount = amount;
    await queryRunner.manager.insert(Payment, paymentEntity);
    return paymentEntity;
  }

  async insertPaymentGMOAttribute(
    queryRunner: QueryRunner,
    paymentId: number,
    OrderID: string,
    allSuccess: boolean,
    AccessID: string,
    AccessPass: string,
    Approve: string,
    Forward: string,
    TranID: string,
    TranDate: string,
  ): Promise<void> {
    const paymentGmoAttributeEntity = new PaymentGmoAttribute();
    paymentGmoAttributeEntity.payment_id = paymentId;
    paymentGmoAttributeEntity.order_id = OrderID;
    paymentGmoAttributeEntity.is_success = allSuccess;
    paymentGmoAttributeEntity.job_cd = GMO_JOB_CD_CAPTURE;
    paymentGmoAttributeEntity.method = GMO_METHOD;
    paymentGmoAttributeEntity.access_id = AccessID;
    paymentGmoAttributeEntity.access_pass = AccessPass;
    paymentGmoAttributeEntity.approve = Approve;
    paymentGmoAttributeEntity.forward = Forward;
    paymentGmoAttributeEntity.tran_id = TranID;
    paymentGmoAttributeEntity.tran_date = TranDate;

    await queryRunner.manager.insert(
      PaymentGmoAttribute,
      paymentGmoAttributeEntity,
    );
  }

  async validateCreditCardGMO(userId: number, amount: number) {
    const user = await this.userRepository.findOne(userId, {
      where: { is_active: true },
      relations: ['wallet'],
    });
    if (!user) {
      throw new BadRequestException();
    }
    let allSuccess = true;
    const OrderID = `at-${microtime.now()}`;
    const registerTransactionResult =
      await this.gmoService.registerTransactionGMO(OrderID, amount);
    if (registerTransactionResult instanceof ErrorGMOResponse) {
      await this.sendMailErrorGMO(registerTransactionResult);
      allSuccess = false;
    }
    const { AccessID, AccessPass } =
      registerTransactionResult as RegisterGMOResponse;

    const validateResult = await this.gmoService.purchaseValidateCreditCardGMO(
      AccessID,
      AccessPass,
      OrderID,
      user.wallet.id,
    );
    if (validateResult instanceof ErrorGMOResponse) {
      await this.sendMailErrorGMO(validateResult);
      allSuccess = false;
    }
    const { Approve, Forward, TranID, TranDate } =
      validateResult as PurchaseValidateCardGMOResponse;

    return {
      AccessID,
      AccessPass,
      Approve,
      Forward,
      TranID,
      TranDate,
      OrderID,
      allSuccess,
    };
  }

  async getPurchaseDetail(
    jwtPayload: JwtPayload,
    purchase_id: number,
  ): Promise<FindPurchaseByIdResponse> {
    try {
      const purchase = await this.purchaseRepository.getPurchaseDetail(
        purchase_id,
      );

      if (!purchase) {
        throw new NotFoundException();
      }

      if (purchase && purchase.user_id !== jwtPayload.userId) {
        throw new ForbiddenException();
      }

      const reward = purchase.reward;
      const rewardUrl = await this.getRewardUrl(reward.filename);

      return new FindPurchaseByIdResponse(
        purchase,
        purchase.purchase_team_attribute.team_id,
        purchase.purchase_team_attribute.team.name,
        purchase.purchase_team_attribute.team.organization_id,
        purchase.purchase_team_attribute.team.organization.name,
        rewardUrl,
      );
    } catch (err) {
      return err;
    }
  }

  async getRewardUrl(fileName: string): Promise<string> {
    const rewardFilename = new RewardFilenameVo(fileName);
    const directoryPath = rewardFilename.getDirectory();
    const rewardUrl = await this.filesService.getSignedUrlS3(
      fileName,
      directoryPath,
    );
    return rewardUrl;
  }

  async rewardUploadS3(team: Team, user: User, date: Date): Promise<string> {
    const bodyReward = this.createRewardContent(team, user, date);
    const rewardFileName = uuidv4() + '.png';
    await this.createFileReward(bodyReward.content, rewardFileName);
    const rewardImage = new RewardFilenameVo(rewardFileName);
    const directoryPath = rewardImage.getDirectory();
    const contentType = 'image/png';
    // Upload reward
    const path = rewardImage.getPathTmp();
    const buffer = fs.readFileSync(path);
    await this.filesService.uploadPublicFile(
      buffer,
      rewardFileName,
      directoryPath,
      contentType,
    );

    // Upload reward OGP
    const pathOGP = rewardImage.getPathOGPTmp();
    const bufferOGP = fs.readFileSync(pathOGP);
    const image = await this.filesService.uploadPublicFile(
      bufferOGP,
      rewardFileName,
      directoryPath,
      contentType,
    );

    return image;
  }

  createRewardContent(team: Team, user: User, date: Date): BodyRewardFileDto {
    const teamFullName = new TeamFullNameVo(team.organization.name, team.name);
    const nameGroup = teamFullName.getFullName();
    const userName = `${user.user_profile.lastname} ${user.user_profile.firstname}`;

    return new BodyRewardFileDto(userName, nameGroup, date);
  }

  async createFileReward(req, rewardFileName: string) {
    const rewardImage = new RewardFilenameVo(rewardFileName);
    const rewardPath = rewardImage.getPathTmp();
    const rewardPathOGP = rewardImage.getPathOGPTmp();
    const rewardPathOGPDefault = rewardImage.getPathOGPDefault();

    try {
      const width = 1200;
      const height = 200;
      const svgImageArray = [];

      req.map(function (item) {
        const svgImage = `
        <svg width="${width}" height="${height}">
          <style>
          .title { fill: #001; font-size: ${item.font_size}px; font-weight: bold;}
          </style>
          <text x="50%" y="50%" text-anchor="middle" class="title">${item.text}</text>
        </svg>
        `;
        const svgBuffer = Buffer.from(svgImage);
        svgImageArray.push({
          input: svgBuffer,
          top: item.top,
          left: item.left,
        });
      });

      // Create  file reward OGP
      await sharp(rewardPathOGPDefault)
        .composite(svgImageArray)
        .toFile(rewardPathOGP);

      // Create  file reward web
      await sharp(rewardPathOGP).resize(360, 189).toFile(rewardPath);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async sendMailErrorGMO(GMOPGResponse: ErrorGMOResponse) {
    const messageOptions = {
      to: 'developers@anyteam.jp',
      from: 'developers@anyteam.jp',
      subject: 'Error in GMO Payment',
      html: `
      <ul>
        <li>- ErrCode : <strong>${GMOPGResponse.ErrCode}</strong></li>
        <li>- ErrInfo: <strong>${GMOPGResponse.ErrInfo}</strong></li>
        <li>- ErrMessage : <strong>${
          GmoErrorCode[GMOPGResponse.ErrInfo]
        }</strong></li>
      </ul>`,
    };
    await this.emailService.send(messageOptions);
  }
}
