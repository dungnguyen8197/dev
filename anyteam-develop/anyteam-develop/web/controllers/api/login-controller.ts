import * as express from 'express';
const env = process.env;

const axios = require('axios');

module.exports = {
  index: function (req: any, res: express.Response) {
    axios
      .post(env.API_ROOT + '/api/v1/users/login', {
        email: req.body.email,
        password: req.body.password,
      })
      .then((response: any) => {
        if (response.data.access_token) {
          req.session.token = response.data.access_token;
          // TODO: レスポンスメッセージ
          return res.json({ message: 'success' });
        }
        throw new Error('access token is none.');
      })
      .catch((error: any) => {
        res.status(400).send('Bad Request');
        // TODO: エラーレスポンスの扱い
        //console.log(error.response)
      });
  },
};
