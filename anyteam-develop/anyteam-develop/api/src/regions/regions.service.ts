import { Injectable } from '@nestjs/common';
import { Region } from '../entity/region.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLogger } from '../logger/logger.service';
import { RegionGroup, RegionGroups } from '../domain/entity/region/group';
import { RegionEntity } from '../domain/entity/region';
import { RegionGroupNameVo } from '../domain/value-object/region/group-name';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private regionsRepository: Repository<Region>,
    private logger: CustomLogger,
  ) {}

  async getList(): Promise<RegionGroups> {
    const regions = await this.findAll();
    return { groups: this.groupRegions(regions) };
  }

  findAll(): Promise<Region[]> {
    return this.regionsRepository.find({
      select: ['id', 'name', 'region_group_id'],
      order: {
        id: 'ASC',
      },
    });
  }

  groupRegions(regions: Region[]) {
    const groups: RegionGroup[] = [];

    regions.map((region) => {
      const groupName = new RegionGroupNameVo(region.region_group_id);
      const indexOfGroup = groups.findIndex(
        (group) => group.region_group_id === region.region_group_id,
      );
      const regionEntity = new RegionEntity(region.id, region.name);

      if (indexOfGroup === -1) {
        groups.push({
          region_group_id: region.region_group_id,
          name: groupName.getName(),
          list: [regionEntity],
        });
      } else {
        groups[indexOfGroup].list.push(regionEntity);
      }
    });

    return groups;
  }
}
