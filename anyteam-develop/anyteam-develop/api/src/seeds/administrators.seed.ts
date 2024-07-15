import bcrypt = require('bcrypt');
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export class CreateAdministrators implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const password = await this.hashPassword('spbl2020');
    await connection
      .createQueryBuilder()
      .insert()
      .into('administrators')
      .values([
        {
          name: 'Administrator',
          email: 'developers@anyteam.jp',
          password: password,
        },
      ])
      .execute();
  }

  // パスワードハッシュ化
  private async hashPassword(password: string): Promise<string> {
    const configService = new ConfigService();
    const saltRounds = configService.get('BCRYPT_SALT_ROUNDS');
    const salt = await bcrypt.genSalt(parseInt(saltRounds));
    return bcrypt.hashSync(password, salt);
  }
}
