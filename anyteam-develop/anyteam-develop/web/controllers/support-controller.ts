import * as express from 'express';

import { getPurchaseDetail, getTeamDetail, getUserProfile } from '../helpers/api';

import { CustomRequest } from '../types/request';
import { SupportInfo } from '../assets/types/support/info';

const env = process.env;

const axios = require('axios');

const config = {
  gtm_container_id: env.GTM_CONTAINER_ID,
  script_url: '',
  data: {},
};

module.exports = {
  async index(req: CustomRequest, res: express.Response) {
    try {
      const teamId = Number(req.query.team_id);
      let supportInfo = {} as SupportInfo;
      let supportValid = false;
      if (req.session.supportInfo && req.session.supportInfo?.team_id === teamId) {
        supportInfo = req.session.supportInfo;
        supportValid = true;
      } else {
        const user = await getUserProfile(req.session.token);
        const teamDetail = await getTeamDetail(teamId, req.session.token);
        supportInfo = {
          team_id: teamId,
          team_name: teamDetail.data.name,
          ...user.data,
          gender_type_id: user.data.gender_type,
        }
      }
      const regionGroups = await axios.get(env.API_ROOT + '/api/v1/regions' );
      config.data = {
        supportInfo,
        regionGroups: regionGroups.data,
        supportValid : supportValid,
      }
      config.script_url = '/static/js/support/index.js';
      res.render('index', config);
    } catch (e) {}
  },
  async wallet(req: CustomRequest, res: express.Response) {
    try {
      const response = await axios.get(env.API_ROOT + '/api/v1/users/me/wallet', {
        headers: {
          Authorization: 'Bearer ' + req.session.token,
        }
      });
      const cardType = await checkCardType(response.data.card_no);
      const cardImage = await getCardImage(cardType);
      config.data = {
        number : response.data.card_no,
        expire: `${response.data.expiration_month}/${response.data.expiration_year}`,
        enabled: response.data.enabled,
        cardType: cardType,
        cardImage: cardImage,
      }
      config.script_url = '/static/js/support/wallet.js';
      res.render('index', config);
    } catch (err) {
      res.redirect('/support/wallet/edit');
    }
  },
  async walletEdit(req: CustomRequest, res: express.Response) {
    try {
      const response = await axios.get(env.API_ROOT + '/api/v1/users/me/wallet', {
        headers: {
          Authorization: 'Bearer ' + req.session.token,
        }
      });
      config.data = {
        active : false,
      }
    } catch (err) {
      config.data = {
        active : true,
      }
    }
    config.script_url = '/static/js/support/wallet-edit.js';
    res.render('index', config);
  },
  async confirm(req: CustomRequest, res: express.Response) {
    const response = await axios.get(env.API_ROOT + '/api/v1/users/me/wallet', {
      headers: {
        Authorization: 'Bearer ' + req.session.token,
      }
    });
    config.data = {
      cardNumber: response.data.card_no,
      supportInfo: req.session.supportInfo,
    }
    config.script_url = '/static/js/support/confirm.js';
    res.render('index', config);
  },
  async complete(req: CustomRequest, res: express.Response) {
    const purchaseId = Number(req.params.purchase_id);

    const { data: purchase } = await getPurchaseDetail(purchaseId, req.session.token);

    config.data = {
      organization_id: purchase.organization_id,
      organization_name: purchase.organization_name,
      purchased_at: purchase.purchased_at,
      team_id: purchase.team_id,
      team_name: purchase.team_name,
      type: purchase.type,
      amount: purchase.amount,
      is_anonymous: req.session.supportInfo?.is_anonymous,
      reward: purchase.reward,
    }
    config.script_url = '/static/js/support/complete.js';
    res.render('index', config);
  },
}

async function checkCardType(card_no: string) {
  const firstNumber = card_no.substring(0, 1);
  const cardLength = card_no.length;
  switch (firstNumber) {
    case '2':
      if (cardLength === 16) {
        return 'MASTER';
      }
    case '3':
      if (cardLength === 14) {
        return 'DINERS';
      } else if (cardLength === 15) {
        return 'AMEX';
      } else if (cardLength === 16) {
        return 'JCB';
      } 
    case '4':
      if (cardLength === 16) {
        return 'VISA';
      }
    default:
      return 'VISA';
  }
}

async function getCardImage(cardType: string) {
  switch (cardType) {
    case 'VISA':
      return 'icon-visa.png';
    case 'MASTER':
      return 'icon-mastercard.png';
    case 'AMEX':
      return 'icon-american-express.png';
    case 'JCB':
      return 'icon-jcb.png';
    case 'DINERS':
      return 'icon-dinners-club.png';
    default:
      return 'icon-visa.png';
  }
}