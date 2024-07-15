import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export class FinancialInstitutions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into('financial_institutions')
      .values([
        {
          code: '0009',
          shop_code: '216',
          name: '三井住友銀行',
          name_kana: 'ミツイスミトモギンコウ',
          shop_name: '新橋',
          shop_name_kana: 'シンバシ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0009',
          shop_code: '639',
          name: '三井住友銀行',
          name_kana: 'ミツイスミトモギンコウ',
          shop_name: '霞が関',
          shop_name_kana: 'カスミガセキ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0009',
          shop_code: '225',
          name: '三井住友銀行',
          name_kana: 'ミツイスミトモギンコウ',
          shop_name: '池袋',
          shop_name_kana: 'イケブクロ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0017',
          shop_code: '502',
          name: '埼玉りそな銀行',
          name_kana: 'サイタマリソナギンコウ',
          shop_name: '新狭山',
          shop_name_kana: 'シンサヤマ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0017',
          shop_code: '369',
          name: '埼玉りそな銀行',
          name_kana: 'サイタマリソナギンコウ',
          shop_name: '大宮',
          shop_name_kana: 'オオミヤ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0017',
          shop_code: '384',
          name: '埼玉りそな銀行',
          name_kana: 'サイタマリソナギンコウ',
          shop_name: '川越',
          shop_name_kana: 'カワゴエ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0001',
          shop_code: '051',
          name: 'みずほ銀行',
          name_kana: 'ミズホギンコウ',
          shop_name: '新橋中央',
          shop_name_kana: 'シンバシチュウオウ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0001',
          shop_code: '046',
          name: 'みずほ銀行',
          name_kana: 'ミズホギンコウ',
          shop_name: '虎ノ門',
          shop_name_kana: 'トラノモン',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0001',
          shop_code: '230',
          name: 'みずほ銀行',
          name_kana: 'ミズホギンコウ',
          shop_name: '池袋',
          shop_name_kana: 'イケブクロ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0002',
          shop_code: '359',
          name: '三菱UFJ銀行',
          name_kana: 'ミツビシユーエフジェーギンコウ',
          shop_name: '池袋',
          shop_name_kana: 'イケブクロ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0002',
          shop_code: '348',
          name: '三菱UFJ銀行',
          name_kana: 'ミツビシユーエフジェーギンコウ',
          shop_name: '新橋駅前',
          shop_name_kana: 'シンバシエキマエ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0002',
          shop_code: '558',
          name: '三菱UFJ銀行',
          name_kana: 'ミツビシユーエフジェーギンコウ',
          shop_name: '浜松町',
          shop_name_kana: 'ハママツチョウ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0010',
          shop_code: '328',
          name: 'りそな銀行',
          name_kana: 'リソナギンコウ',
          shop_name: '衆議院',
          shop_name_kana: 'シュウギイン',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0010',
          shop_code: '269',
          name: 'りそな銀行',
          name_kana: 'リソナギンコウ',
          shop_name: '赤坂',
          shop_name_kana: 'アカサカ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0010',
          shop_code: '329',
          name: 'りそな銀行',
          name_kana: 'リソナギンコウ',
          shop_name: '参議院',
          shop_name_kana: 'サンギイン',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0288',
          shop_code: '260',
          name: '三菱UFJ信託銀行',
          name_kana: 'ミツビシユーエフジェーシンタクギンコウ',
          shop_name: '渋谷',
          shop_name_kana: 'シブヤ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0288',
          shop_code: '270',
          name: '三菱UFJ信託銀行',
          name_kana: 'ミツビシユーエフジェーシンタクギンコウ',
          shop_name: '五反田',
          shop_name_kana: 'ゴタンダ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0288',
          shop_code: '290',
          name: '三菱UFJ信託銀行',
          name_kana: 'ミツビシユーエフジェーシンタクギンコウ',
          shop_name: '中野',
          shop_name_kana: 'ナカノ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0289',
          shop_code: '024',
          name: 'みずほ信託銀行',
          name_kana: 'ミズホシンタクギンコウ',
          shop_name: '上野',
          shop_name_kana: 'ウエノ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0289',
          shop_code: '046',
          name: 'みずほ信託銀行',
          name_kana: 'ミズホシンタクギンコウ',
          shop_name: '千葉',
          shop_name_kana: 'チバ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0289',
          shop_code: '036',
          name: 'みずほ信託銀行',
          name_kana: 'ミズホシンタクギンコウ',
          shop_name: '三鷹',
          shop_name_kana: 'ミタカ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0294',
          shop_code: '161',
          name: '三井住友信託銀行',
          name_kana: 'ミツイスミトモシンタクギンコウ',
          shop_name: '目黒',
          shop_name_kana: 'メグロ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0294',
          shop_code: '520',
          name: '三井住友信託銀行',
          name_kana: 'ミツイスミトモシンタクギンコウ',
          shop_name: '新宿',
          shop_name_kana: 'シンジュク',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0294',
          shop_code: '180',
          name: '三井住友信託銀行',
          name_kana: 'ミツイスミトモシンタクギンコウ',
          shop_name: '三軒茶屋',
          shop_name_kana: 'サンゲンジャヤ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0133',
          shop_code: '004',
          name: '武蔵野銀行',
          name_kana: 'ムサシノギンコウ',
          shop_name: '川口',
          shop_name_kana: 'カワグチ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0133',
          shop_code: '027',
          name: '武蔵野銀行',
          name_kana: 'ムサシノギンコウ',
          shop_name: '戸田',
          shop_name_kana: 'トダ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0133',
          shop_code: '105',
          name: '武蔵野銀行',
          name_kana: 'ムサシノギンコウ',
          shop_name: '池袋',
          shop_name_kana: 'イケブクロ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0304',
          shop_code: '032',
          name: '野村信託銀行',
          name_kana: 'ノムラシンタクギンコウ',
          shop_name: '渋谷32',
          shop_name_kana: 'シブヤサンニ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0304',
          shop_code: '023',
          name: '野村信託銀行',
          name_kana: 'ノムラシンタクギンコウ',
          shop_name: '千住',
          shop_name_kana: 'センジュ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
        {
          code: '0304',
          shop_code: '019',
          name: '野村信託銀行',
          name_kana: 'ノムラシンタクギンコウ',
          shop_name: '新橋',
          shop_name_kana: 'シンバシ',
          postal_code: '012-3456',
          location: '港区西新橋1-1-1',
          telephone_number: '00-0000-0000',
          bill_exchange_number: '0000',
          sort_code: 1,
        },
      ])
      .execute();
  }
}
