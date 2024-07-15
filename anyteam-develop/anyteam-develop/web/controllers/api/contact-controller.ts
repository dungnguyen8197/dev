import * as express from 'express';

import { CustomRequest } from '../../types/request';

const env = process.env;
const axios = require('axios');

module.exports = {
  sendToDev: async function (req: CustomRequest, res: express.Response) {
    try {
      await axios.post(env.API_ROOT + '/api/v1/contact', {
        email: req.body.email,
        title: req.body.title,
        message: req.body.message,
      });
      return res.json(true);
    } catch (error: any) {
      res.status(error.response.status).send(error.response.statusText);
    }
  },
};
