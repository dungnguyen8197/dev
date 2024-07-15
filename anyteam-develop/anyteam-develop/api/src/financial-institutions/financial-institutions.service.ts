import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialInstitution } from 'src/entity/financial_institution.entity';
import { Repository } from 'typeorm';
import {
  FindFinancialInstitutionRequest,
  FindFinancialInstitutionResponse,
} from './dto/find.dto';

@Injectable()
export class FinancialInstitutionsService {
  constructor(
    @InjectRepository(FinancialInstitution)
    private readonly financialInstitutionRepository: Repository<FinancialInstitution>,
  ) {}

  async findByCode(
    req: FindFinancialInstitutionRequest,
  ): Promise<FindFinancialInstitutionResponse> {
    const { code, shop_code } = req;

    const conditionQuery = {};
    conditionQuery['code'] = code;
    if (shop_code) {
      conditionQuery['shop_code'] = shop_code;
    }

    try {
      const entity = await this.financialInstitutionRepository.findOne({
        where: conditionQuery,
      });

      if (!entity) {
        throw new NotFoundException();
      }

      return new FindFinancialInstitutionResponse(
        entity.name,
        entity.name_kana,
        !!shop_code ? entity.shop_name : null,
        !!shop_code ? entity.shop_name_kana : null,
      );
    } catch (err) {
      throw err;
    }
  }
}
