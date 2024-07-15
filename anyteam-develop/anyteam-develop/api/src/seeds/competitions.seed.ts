import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export class CreateCompetitions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into('competitions')
      .values([
        {
          name: '陸上',
        },
        {
          name: '水泳',
        },
        {
          name: '水球',
        },
        {
          name: '体操',
        },
        {
          name: '新体操',
        },
        {
          name: '自転車',
        },
        {
          name: '柔道',
        },
        {
          name: 'レスリング',
        },
        {
          name: '空手道',
        },
        {
          name: '少林寺拳法',
        },
        {
          name: 'ボクシング',
        },
        {
          name: 'テコンドー',
        },
        {
          name: '相撲',
        },
        {
          name: '剣道',
        },
        {
          name: 'フェンシング',
        },
        {
          name: '弓道',
        },
        {
          name: 'アーチェリー',
        },
        {
          name: '射撃',
        },
        {
          name: 'ラクロス',
        },
        {
          name: 'ハンドボール',
        },
        {
          name: 'バレーボール',
        },
        {
          name: 'バスケットボール',
        },
        {
          name: 'サッカー',
        },
        {
          name: 'ラグビー',
        },
        {
          name: 'アメリカンフットボール',
        },
        {
          name: 'ホッケー',
        },
        {
          name: '野球',
        },
        {
          name: 'ソフトボール',
        },
        {
          name: 'テニス',
        },
        {
          name: '卓球',
        },
        {
          name: 'バドミントン',
        },
        {
          name: 'スキー',
        },
        {
          name: 'スノーボード',
        },
        {
          name: 'スケート',
        },
        {
          name: 'ゴルフ',
        },
        {
          name: 'ボート',
        },
        {
          name: 'カヌー',
        },
        {
          name: 'セーリング',
        },
        {
          name: 'サーフィン',
        },
        {
          name: '馬術',
        },
      ])
      .execute();
  }
}
