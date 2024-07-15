import * as express from 'express';

import { CustomRequest } from '../types/request';
import { PAYMENTS_PER_PAGE } from '../constants/pagination';
import { getUserProfile, getPurchaseDetail } from '../helpers/api';


const env = process.env;

const axios = require('axios');

const config = {
  gtm_container_id: env.GTM_CONTAINER_ID,
  script_url: '',
  data: {},
};

module.exports = {
  index: async function (req: CustomRequest, res: express.Response) {
    const user = await getUserProfile(req.session.token);
    config.data = user.data;
    config.script_url = '/static/js/user/index.js';
    res.render('index', config);
  },

  profile: async function (req: CustomRequest, res: express.Response) {
    const user = await getUserProfile(req.session.token);
    const regionGroups = await axios.get(env.API_ROOT + '/api/v1/regions');

    config.data = {
      user: user.data,
      regionGroups: regionGroups.data,
    };
    config.script_url = '/static/js/user/profile.js';
    res.render('index', config);
  },

  email: async function (req: CustomRequest, res: express.Response) {
    try {
      const user = await getUserProfile(req.session.token);
      config.data = {
        user: user.data,
      };
    } catch (error) {}

    config.script_url = '/static/js/user/email.js';
    res.render('index', config);
  },

  verifyEmail: function (req: CustomRequest, res: express.Response) {
    config.script_url = '/static/js/user/verify-email.js';
    res.render('index', config);
  },

  ranking: function (req: CustomRequest, res: express.Response) {
    config.script_url = '/static/js/user/ranking.js';
    res.render('index', config);
  },

  supports: async function (req: CustomRequest, res: express.Response) {
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * PAYMENTS_PER_PAGE;

    try {
      const response = await axios.get(
        env.API_ROOT + '/api/v1/users/me/payments',
        {
          headers: {
            Authorization: 'Bearer ' + req.session.token,
          },
          params: {
            offset,
            limit: PAYMENTS_PER_PAGE,
          },
        },
      );

      config.data = {
        list: response.data.list,
        total: response.data.count,
        page,
      };
    } catch (err) {}

    config.script_url = '/static/js/user/supports.js';
    res.render('index', config);
  },

  async supportReward(req: CustomRequest, res: express.Response) {
    const paymentId = Number(req.params.payment_id);

    const { data: purchase } = await getPurchaseDetail(paymentId, req.session.token);

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
    config.script_url = '/static/js/user/support-reward.js';
    res.render('index', config);
  },

  async wallet(req: CustomRequest, res: express.Response) {
    try {
      const response = await axios.get(
        env.API_ROOT + '/api/v1/users/me/wallet',
        {
          headers: {
            Authorization: 'Bearer ' + req.session.token,
          },
        },
      );
      const cardType = await checkCardType(response.data.card_no);
      const cardImage = await getCardImage(cardType);
      config.data = {
        number: response.data.card_no,
        expire: `${response.data.expiration_month}/${response.data.expiration_year}`,
        enabled: response.data.enabled,
        cardType: cardType,
        cardImage: cardImage,
      };
    } catch (err) {
      config.data = {};
    }

    config.script_url = '/static/js/user/wallet.js';
    res.render('index', config);
  },

  walletEdit: async function (req: CustomRequest, res: express.Response) {
    try {
      const response = await axios.get(
        env.API_ROOT + '/api/v1/users/me/wallet',
        {
          headers: {
            Authorization: 'Bearer ' + req.session.token,
          },
        },
      );

      config.data = {
        wallet: response.data,
      };
    } catch (err) {
      config.data = {};
    }

    config.script_url = '/static/js/user/wallet-edit.js';
    res.render('index', config);
  },

  password: function (req: CustomRequest, res: express.Response) {
    config.script_url = '/static/js/user/password.js';
    res.render('index', config);
  },

  withdrawal: function (req: CustomRequest, res: express.Response) {
    config.script_url = '/static/js/user/withdrawal.js';
    res.render('index', config);
  },
};

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
