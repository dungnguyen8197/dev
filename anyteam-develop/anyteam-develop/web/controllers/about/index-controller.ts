import * as express from 'express';

const env = process.env;

const config = {
  gtm_container_id: env.GTM_CONTAINER_ID,
  script_url: '',
};

module.exports = {
  index: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/index.js';
    res.render('index', config);
  },
  support: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/support.js';
    res.render('index', config);
  },
  privacy: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/privacy.js';
    res.render('index', config);
  },
  company: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/company.js';
    res.render('index', config);
  },
  faq: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/faq/index.js';
    res.render('index', config);
  },
  faqRegister: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/faq/register.js';
    res.render('index', config);
  },
  faqLogin: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/faq/login.js';
    res.render('index', config);
  },
  faqDonation: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/faq/donation.js';
    res.render('index', config);
  },
  faqAccount: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/faq/account.js';
    res.render('index', config);
  },
  faqPayment: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/faq/payment.js';
    res.render('index', config);
  },
  faqCancel: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/faq/cancel.js';
    res.render('index', config);
  },
  faqWithdrawal: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/faq/withdrawal.js';
    res.render('index', config);
  },
  contact: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/contact.js';
    res.render('index', config);
  },
  commercialTransactions: function (req: express.Request, res: express.Response) {
    config.script_url = '/static/js/about/commercial-transactions.js';
    res.render('index', config);
  },
  terms: function (req: any, res: express.Response) {
    config.script_url = '/static/js/about/terms.js';
    res.render('index', config);
  },
};
