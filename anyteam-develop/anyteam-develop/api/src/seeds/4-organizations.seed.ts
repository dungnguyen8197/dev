import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export class CreateOrganizations implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into('organizations')
      .values([
        {
          name: '運動通信大学',
          name_line_id: 1,
          region_id: 1,
          division_type_id: 1,
          status: 0,
        },
        {
          name: 'スポブル高校',
          name_line_id: 3,
          region_id: 2,
          division_type_id: 2,
          status: 0,
        },
      ])
      .execute();
  }
}
