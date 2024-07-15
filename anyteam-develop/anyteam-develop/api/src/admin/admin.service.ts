import bcrypt = require('bcrypt');
import { JwtService } from '@nestjs/jwt';
import { Administrator } from 'src/entity/administrator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Like, Repository } from 'typeorm';
import { AdminRegisterRequest } from './dto/register.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminLoginResponse } from './dto/admin-login.dto';
import { AccessToken } from 'src/domain/value-object/access-token';
import { ConfigService } from '@nestjs/config';
import { GetListRequest } from './dto/list.dto';
import { CustomLogger } from 'src/logger/logger.service';
import { AdministratorEntity } from 'src/domain/entity/administrator';
import { AdministratorList } from 'src/domain/entity/administrator/list';
import { AdminEditRequest } from './dto/admin-edit.dto';

type PasswordOmitAdmin = Omit<Administrator, 'password'>;

export interface JwtPayload {
  adminId: Administrator['id'];
  email: Administrator['email'];
  isAdmin: boolean;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private connection: Connection,
    private logger: CustomLogger,
  ) {}

  // authentication admin
  async validateAdmin(
    email: Administrator['email'],
    pass: Administrator['password'],
  ): Promise<PasswordOmitAdmin | null> {
    const admin = await this.findByEmail(email);

    if (admin && bcrypt.compareSync(pass, admin.password)) {
      return admin;
    }

    return null;
  }

  findByEmail(
    email: Administrator['email'],
  ): Promise<Administrator | undefined> {
    return this.administratorRepository.findOne({ where: { email } });
  }

  async login(admin: PasswordOmitAdmin | null): Promise<AdminLoginResponse> {
    if (!admin.id) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = {
      adminId: admin.id,
      email: admin.email,
      isAdmin: true,
    };
    const accessToken = new AccessToken(this.jwtService.sign(payload));

    return new AdminLoginResponse(accessToken);
  }

  async store(req: AdminRegisterRequest) {
    const { name, email, password } = req;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentUser = await this.findByEmail(email);
      if (currentUser) {
        throw new ConflictException({
          message_type: 'error',
          error: { email: 'メールアドレス使用済み' },
        });
      }
      const adminEntity = new Administrator();
      adminEntity.name = name;
      adminEntity.email = email;
      adminEntity.password = await this.hashPassword(password);
      await queryRunner.manager.insert(Administrator, adminEntity);
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getList(req: GetListRequest): Promise<AdministratorList> {
    const offset = Number(req.offset) || 0; // TODO: 定数化
    const search = req.search || '';
    try {
      const adminEntityList = (
        await this.findAll(search, offset, req.limit)
      ).map(
        (admin) =>
          new AdministratorEntity(
            admin.id,
            admin.name,
            admin.email,
            admin.created_at,
          ),
      );
      const countAdministrator = await this.count(search);
      return new AdministratorList(adminEntityList, countAdministrator, offset);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async delete(administrator_id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const administrator = await this.administratorRepository.findOne(
        administrator_id,
      );
      if (!administrator) {
        throw new BadRequestException();
      }
      await queryRunner.manager.delete(Administrator, administrator_id);
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async update(req: AdminEditRequest, administrator_id: number) {
    const { name, email, password } = req;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentUser = await this.findByEmail(email);
      if (currentUser && currentUser.id !== administrator_id) {
        throw new ConflictException({
          message_type: 'error',
          error: { email: 'メールアドレス使用済み' },
        });
      }
      const adminCurrent = await this.administratorRepository.findOne(
        administrator_id,
      );
      const adminEntity = adminCurrent;
      adminEntity.name = name;
      adminEntity.email = email;
      if (password && password.length) {
        adminEntity.password = await this.hashPassword(password);
      }
      await queryRunner.manager.update(
        Administrator,
        administrator_id,
        adminEntity,
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

  async findAdmin(administrator_id: number): Promise<AdministratorEntity> {
    const administrator = await this.administratorRepository.findOne(
      administrator_id,
    );
    return new AdministratorEntity(
      administrator.id,
      administrator.name,
      administrator.email,
      administrator.created_at,
    );
  }

  findAll(
    search: string,
    offset: number,
    limit: number,
  ): Promise<Administrator[]> {
    return this.administratorRepository.find({
      where: [{ name: Like(`%${search}%`) }, { email: Like(`%${search}%`) }],
      select: ['id', 'name', 'email', 'created_at'],
      order: { id: 'ASC' },
      skip: offset,
      take: limit || 10, // TODO: 定数化
    });
  }

  count(search: string): Promise<number> {
    return this.administratorRepository.count({
      where: [{ name: Like(`%${search}%`) }, { email: Like(`%${search}%`) }],
    });
  }

  // パスワードハッシュ化
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS');
    const salt = await bcrypt.genSalt(parseInt(saltRounds));
    return bcrypt.hashSync(password, salt);
  }
}
