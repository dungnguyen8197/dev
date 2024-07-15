import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export default class CreateOrganizationDivisionTypes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into('organization_division_types')
      .values([
        { name: '大学', organization_type_id: 1 },
        { name: '高校', organization_type_id: 1 },
        { name: '中学', organization_type_id: 1 },
      ])
      .execute();
  }
}
