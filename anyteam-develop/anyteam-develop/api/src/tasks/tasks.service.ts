import * as fs from 'fs';

import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';

import { RewardFilenameVo } from 'src/domain/value-object/reward/filename';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    try {
      const path = new RewardFilenameVo().getDirectoryTmp();
      fs.readdirSync(path).forEach((f) => fs.rmSync(`${path}/${f}`));
      this.logger.log('Called every midnight.');
    } catch (err) {
      this.logger.error(err);
    }
  }
}
