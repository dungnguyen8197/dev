import * as express from 'express';

import { CustomRequest } from '../../types/request';
import { GMOUpdateRequest } from './../../assets/types/gmo';
import { GmoErrorCode } from '../../constants/gmo-error-code';
import { SupportInfo } from './../../assets/types/support/info';
import { UserProfileRequest } from '../../assets/types/user/profile';
import { createPurchase } from '../../helpers/api';
import { PurchaseCreateRequest } from './../../assets/types/purchase';

const axios = require('axios'); 

const env = process.env;


module.exports = {
  index(req: CustomRequest, res: express.Response) {
    req.session.supportInfo = req.body as SupportInfo;
    res.send('OK');
  },
  async execute(req: CustomRequest, res: express.Response) {
    const info = req.session.supportInfo as SupportInfo;
    const userProfile: UserProfileRequest = {
      firstname: info.firstname,
      lastname: info.lastname,
      firstname_kana: info.firstname_kana,
      lastname_kana: info.lastname_kana,
      is_anonymous: info.is_anonymous,
      gender_type_id: info.gender_type_id,
      birthday: info.birthday,
      postal_code: info.postal_code,
      region_id: info.region_id,
      address: info.address,
      municipalities: info.municipalities,
      building_name: info.building_name,
      university_name: info.university_name,
      university_club: info.university_club,
      high_school_name: info.high_school_name,
      high_school_club: info.high_school_club,
      junior_high_school_name: info.junior_high_school_name,
      junior_high_school_club: info.junior_high_school_club,
      favorite_competition1: info.favorite_competition1,
      favorite_competition2: info.favorite_competition2,
      favorite_competition3: info.favorite_competition3,
      favorite_team1: info.favorite_team1,
      favorite_team2: info.favorite_team2,
      favorite_team3: info.favorite_team3,
    }

    try {
      await axios.patch(env.API_ROOT + '/api/v1/users/me/profile', userProfile, {
        headers: {
          Authorization: 'Bearer ' + req.session.token,
        },
      });

      const purchaseRequest: PurchaseCreateRequest = {
        amount: info.support_amount as number,
        type: info.support_type as number,
        team_id: info.team_id as number,
      }
      const { purchase_id } = await createPurchase(purchaseRequest, req.session.token);
      res.status(200).send({ purchase_id });
    } catch (error) {
      res.status(400).send();
    }
  },
  async wallet(req: CustomRequest, res: express.Response) {
    const GMORequest = req.body as GMOUpdateRequest;
    try {
      const response = await axios.patch(env.API_ROOT + '/api/v1/users/me/wallet', GMORequest, {
        headers: {
          'Authorization': 'Bearer ' + req.session.token,
        },
      });
      if (response.data.status !== 200) {
        const ErrInfo: string = response.data.response.ErrInfo;
        const Message = GmoErrorCode[ErrInfo];
        res.status(response.data.status).send({
          ErrCode : response.data.response.ErrCode,
          ErrInfo : ErrInfo,
          Message : Message,
        });
      } else {
        res.status(200).send('Success');
      }
      
    } catch (error: any) {
      res.status(error.response.status).send(error.response.statusText);
    }
  }
}