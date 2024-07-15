import * as express from 'express';

const env = process.env;

const config = {
  gtm_container_id: env.GTM_CONTAINER_ID,
  script_url: '',
};

module.exports = {
  maintenance: function (req: express.Request, res: express.Response) {
    config.script_url = '/static/js/maintenance.js';
    res.render('index', config);
  },
};
