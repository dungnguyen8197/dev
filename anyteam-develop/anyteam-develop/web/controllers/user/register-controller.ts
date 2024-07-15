import * as express from 'express';

const env = process.env;

const axios = require('axios');

const config = {
  gtm_container_id: env.GTM_CONTAINER_ID,
  script_url: '',
  data: '',
};

module.exports = {
  index: function (req: express.Request, res: express.Response) {
    config.script_url = '/static/js/user/register.js';
    res.render('index', config);
  },

  confirm: function (req: express.Request, res: express.Response) {
    config.script_url = '/static/js/user/register/confirm.js';
    res.render('index', config);
  },

  account: function (req: express.Request, res: express.Response) {
    config.script_url = '/static/js/user/register/account.js';
    res.render('index', config);
  }
}