import * as express from 'express';

const env = process.env;

const config = {
  gtm_container_id: env.GTM_CONTAINER_ID,
  script_url: ''
};

module.exports = {
  notFound: function (req: express.Request, res: express.Response) {
    config.script_url = '/static/js/not-found.js';
    res.render('index', config);
  },
  internalServerError: function (req: express.Request, res: express.Response) {
    config.script_url = '/static/js/internal-server-error.js'
    res.render('index', config);
  }
}