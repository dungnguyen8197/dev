import bcrypt = require('bcrypt');
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from 'src/domain/value-object/access-token';
import { OrganizationUser } from 'src/entity/organization-user.entity';
import { Connection, Repository } from 'typeorm';
import { OrganizationUserLoginResponse } from './dto/organization-login.dto';
import { CurrentLoginUserResponse } from './dto/current-login-user.dto';
import { CustomLogger } from '../logger/logger.service';
import { Organization } from '../entity/organization.entity';
import { ConfigService } from '@nestjs/config';
import { OrganizationUserList } from './dto/list.dto';
import { OrganizationUserEntity } from 'src/domain/entity/organization-user';
import { OrganizationUserCreateRequest } from './dto/organization-user-create.dto';
import { OrganizationUserFindResponse } from './dto/organization-user-find.dto';
import { OrganizationUserUpdateRequest } from './dto/organization-user-update.dto';
import { EmailService } from 'src/email/email.service';

type PasswordOmitOrganizationUser = Omit<OrganizationUser, 'password'>;

export interface JwtPayload {
  organizationUserId: OrganizationUser['id'];
  email: OrganizationUser['email'];
  organizationId: OrganizationUser['organization_id'];
}

@Injectable()
export class OrganizationUsersService {
  constructor(
    @InjectRepository(OrganizationUser)
    private organizationUserRepository: Repository<OrganizationUser>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private connection: Connection,
    private logger: CustomLogger,
  ) {}

  // Authentication Organization User
  async validateOrganizationUser(
    email: OrganizationUser['email'],
    pass: OrganizationUser['password'],
  ): Promise<PasswordOmitOrganizationUser | null> {
    const organizationUser = await this.findByEmail(email);

    if (
      organizationUser &&
      bcrypt.compareSync(pass, organizationUser.password)
    ) {
      return organizationUser;
    }

    return null;
  }

  // Find organization user by email
  findByEmail(
    email: OrganizationUser['email'],
  ): Promise<OrganizationUser | undefined> {
    return this.organizationUserRepository.findOne({ where: { email } });
  }

  async login(
    organizationUser: PasswordOmitOrganizationUser | null,
  ): Promise<OrganizationUserLoginResponse> {
    if (!organizationUser.id) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = {
      organizationUserId: organizationUser.id,
      email: organizationUser.email,
      organizationId: organizationUser.organization_id,
    };
    const accessToken = new AccessToken(this.jwtService.sign(payload));

    return new OrganizationUserLoginResponse(
      accessToken,
      organizationUser.is_temporary,
    );
  }

  async create(
    req: OrganizationUserCreateRequest,
    organization_id: number,
  ): Promise<void> {
    const { email, role } = req;
    const password = Math.random().toString(36).substring(2, 10);

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organization = await this.organizationRepository.findOne(
        organization_id,
      );
      if (!organization) {
        throw new BadRequestException();
      }

      const currentOrganizationUser = await this.findByEmail(email);
      if (currentOrganizationUser) {
        throw new ConflictException({
          message_type: 'error',
          error: { email: 'メールアドレス使用済み' },
        });
      }

      const organizationUserEntity = new OrganizationUser();
      organizationUserEntity.email = email;
      organizationUserEntity.name = '';
      organizationUserEntity.password = await this.hashPassword(password);
      organizationUserEntity.is_temporary = true;
      organizationUserEntity.organization_id = organization_id;

      if (role) {
        organizationUserEntity.role = role;
      }

      await queryRunner.manager.insert(
        OrganizationUser,
        organizationUserEntity,
      );
      await queryRunner.commitTransaction();
      await this.sendMail(req, password);
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS');
    const salt = await bcrypt.genSalt(parseInt(saltRounds));
    return bcrypt.hashSync(password, salt);
  }

  async getList(organization_id: number): Promise<OrganizationUserList> {
    try {
      const organization = await this.organizationRepository.findOne(
        organization_id,
      );
      if (!organization) {
        throw new BadRequestException();
      }

      const organizationUserEntityList = (
        await this.findAllByOrganizationId(organization_id)
      ).map((organizationUser) => {
        return new OrganizationUserEntity(
          organizationUser.id,
          organizationUser.name,
          organizationUser.email,
          organizationUser.role,
        );
      });
      return new OrganizationUserList(organizationUserEntityList);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  // Find all organization user by organization id
  findAllByOrganizationId(
    organization_id: number,
  ): Promise<OrganizationUser[]> {
    return this.organizationUserRepository.find({
      where: { organization_id: organization_id },
      select: ['id', 'name', 'email', 'role'],
      order: { id: 'ASC' },
    });
  }

  async update(
    req: OrganizationUserUpdateRequest,
    organization_id: number,
    organization_user_id: number,
  ): Promise<any> {
    const { name, email, password, role } = req;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organization = await this.organizationRepository.findOne(
        organization_id,
      );
      if (!organization) {
        throw new BadRequestException();
      }

      const organizationUser = await this.organizationUserRepository.findOne(
        organization_user_id,
      );
      if (
        !organizationUser ||
        organizationUser.organization_id !== organization_id
      ) {
        throw new BadRequestException();
      }

      const currentOrganizationUser = await this.findByEmail(email);
      if (
        currentOrganizationUser &&
        currentOrganizationUser.id !== organization_user_id
      ) {
        throw new ConflictException({
          message_type: 'error',
          error: { email: 'メールアドレス使用済み' },
        });
      }

      const organizationUserEntity = organizationUser;
      organizationUserEntity.name = name;
      organizationUserEntity.email = email;
      organizationUserEntity.is_temporary = false;

      if (password) {
        organizationUserEntity.password = await this.hashPassword(password);
      }
      if (role) {
        organizationUserEntity.role = role;
      }

      await queryRunner.manager.update(
        OrganizationUser,
        organization_user_id,
        organizationUserEntity,
      );

      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(organization_id: number, organization_user_id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organization = await this.organizationRepository.findOne(
        organization_id,
      );
      if (!organization) {
        throw new BadRequestException();
      }

      const organizationUser = await this.organizationUserRepository.findOne(
        organization_user_id,
      );
      if (
        !organizationUser ||
        organizationUser.organization_id !== organization_id
      ) {
        throw new BadRequestException();
      }

      await queryRunner.manager.delete(OrganizationUser, organization_user_id);
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async currentLoginUser(
    payload: JwtPayload,
  ): Promise<CurrentLoginUserResponse> {
    const organizationUser = await this.organizationUserRepository.findOne(
      payload.organizationUserId,
    );
    const organization = await this.organizationRepository.findOne(
      organizationUser.organization_id,
    );

    return new CurrentLoginUserResponse(
      organizationUser.id,
      organizationUser.name,
      organizationUser.email,
      organizationUser.role,
      organizationUser.organization_id,
      organization.is_group,
    );
  }

  async find(
    organization_id: number,
    organization_user_id: number,
  ): Promise<OrganizationUserFindResponse> {
    const organization = await this.organizationRepository.findOne(
      organization_id,
    );
    if (!organization) {
      throw new BadRequestException();
    }

    const organizationUser = await this.organizationUserRepository.findOne(
      organization_user_id,
    );
    if (
      !organizationUser ||
      organizationUser.organization_id !== organization_id
    ) {
      throw new BadRequestException();
    }

    if (
      !organizationUser ||
      organizationUser.organization_id !== organization_id
    ) {
      throw new BadRequestException();
    }

    return new OrganizationUserFindResponse(
      organizationUser.id,
      organizationUser.name,
      organizationUser.email,
      organizationUser.role,
    );
  }

  async sendMail(
    req: OrganizationUserCreateRequest,
    password: string,
  ): Promise<any> {
    const appUrl = this.configService.get('PORTAL_URL') + '/login?is_initial=1';

    const msg = {
      // TODO: エンティティ化
      to: req.email,
      from: 'developers@anyteam.jp', // TODO: env管理
      subject: 'subject test',
      text: 'plain text', // TODO: メールテンプレート化
      html:
        '<strong>' +
        appUrl +
        '</strong></br><p><strong>Password : </strong><strong>' +
        password +
        '</strong><p>', // TODO: メールテンプレート化
    };
    await this.emailService.send(msg);
    return;
  }
}
