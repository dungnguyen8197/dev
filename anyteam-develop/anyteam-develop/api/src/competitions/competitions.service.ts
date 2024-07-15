import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AdminGetCompetitionEntity,
  CompetitionEntity,
} from 'src/domain/entity/competition';
import { Competition } from 'src/entity/competition.entity';
import { Connection, Like, Repository } from 'typeorm';
import {
  AdminGetCompetitionsList,
  AdminGetListRequest,
  CompetitionsList,
} from './dto/list.dto';
import { CustomLogger } from 'src/logger/logger.service';
import { AdminRegisterRequest } from './dto/register.dto';
import { AdminUpdateRequest } from './dto/update.dto';
import { Team } from 'src/entity/team.entity';

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectRepository(Competition)
    private competitionsRepository: Repository<Competition>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    private logger: CustomLogger,
    private connection: Connection,
  ) {}

  async getList(): Promise<CompetitionsList> {
    try {
      const competitionsList = (await this.findAll()).map((competition) => {
        return new CompetitionEntity(competition.id, competition.name);
      });

      return new CompetitionsList(competitionsList);
    } catch (err) {
      throw err;
    }
  }

  async adminGetList(
    req: AdminGetListRequest,
  ): Promise<AdminGetCompetitionsList> {
    const { search, limit, offset } = req;
    try {
      const competitionsList = (
        await this.adminFindAll(search, limit, offset)
      ).map((competition) => {
        return new AdminGetCompetitionEntity(
          competition.id,
          competition.name,
          competition.created_at,
        );
      });
      const countCompetitions = await this.adminCount(search);
      return new AdminGetCompetitionsList(
        competitionsList,
        countCompetitions,
        offset,
      );
    } catch (err) {
      throw err;
    }
  }

  async adminRegister(req: AdminRegisterRequest): Promise<CompetitionsList> {
    const { name } = req;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentCompetition = await this.competitionsRepository.findOne({
        where: { name },
      });
      if (currentCompetition) {
        throw new ConflictException({
          message_type: 'error',
          error: { name: '競技名が既に存在しています。' },
        });
      }
      const competitionEntity = new Competition();
      competitionEntity.name = name;

      await queryRunner.manager.insert(Competition, competitionEntity);
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async adminUpdate(
    req: AdminUpdateRequest,
    competition_id: number,
  ): Promise<any> {
    const { name } = req;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const competition = await this.competitionsRepository.findOne(
        competition_id,
      );
      if (!competition) {
        throw new BadRequestException();
      }

      const currentCompetition = await this.competitionsRepository.findOne({
        where: { name },
      });
      if (currentCompetition && currentCompetition.id !== competition_id) {
        throw new ConflictException({
          message_type: 'error',
          error: { name: '競技名が既に存在しています。' },
        });
      }

      const competitionEntity = competition;
      competitionEntity.name = name;
      await queryRunner.manager.update(
        Competition,
        competition_id,
        competitionEntity,
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

  async adminGetDetail(competition_id: number) {
    try {
      const competition = await this.competitionsRepository.findOne(
        competition_id,
      );
      if (!competition) {
        throw new BadRequestException();
      }
      return new AdminGetCompetitionEntity(
        competition.id,
        competition.name,
        competition.created_at,
      );
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async adminDelete(competition_id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const competition = await this.competitionsRepository.findOne(
        competition_id,
      );
      if (!competition) {
        throw new BadRequestException();
      }

      const checkRelation = await this.teamRepository.findOne({
        where: { competition_id },
      });
      if (checkRelation) {
        throw new ForbiddenException();
      }

      await queryRunner.manager.delete(Competition, competition_id);
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      this.logger.error(err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Admin find all competitions
  async adminFindAll(
    search: string,
    limit: number,
    offset: number,
  ): Promise<AdminGetCompetitionEntity[]> {
    const conditionQuery = {};

    if (search && search.length > 0) {
      conditionQuery['name'] = Like(`%${search}%`);
    }

    return this.competitionsRepository.find({
      where: conditionQuery,
      select: ['id', 'name', 'created_at'],
      order: { id: 'ASC' },
      skip: offset || 0,
      take: limit || 10, // TODO: 定数化
    });
  }

  // Admin count competitions
  async adminCount(search: string): Promise<number> {
    const conditionQuery = {};

    if (search && search.length > 0) {
      conditionQuery['name'] = Like(`%${search}%`);
    }
    return await this.competitionsRepository.count({ where: conditionQuery });
  }

  // Find all competitions
  findAll(): Promise<Competition[]> {
    return this.competitionsRepository.find({
      select: ['id', 'name'],
      order: { id: 'ASC' },
    });
  }
}
