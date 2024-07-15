import bcrypt = require('bcrypt');
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export class CreateOrganizationUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const password = await this.hashPassword('test2021');
    await connection
      .createQueryBuilder()
      .insert()
      .into('organization_users')
      .values([
        {
          name: 'test1',
          email: 'test1@anyteam.jp',
          password: password,
          organization_id: 1,
          is_temporary: true,
        },
        {
          name: 'test2',
          email: 'test2@anyteam.jp',
          password: password,
          organization_id: 2,
          is_temporary: true,
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
