import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export default class CreateOrganizationTypes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into('organization_types')
      .values([{ name: '学校' }])
      .execute();
  }
}
