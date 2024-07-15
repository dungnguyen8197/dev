import * as express from 'express';

import { CustomRequest } from '../../types/request';
import { UserProfileRequest } from '../../assets/types/user/profile';

const env = process.env;

const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  confirmationEmail: async function (
    req: CustomRequest,
    res: express.Response,
  ) {
    try {
      const response = await axios.post(
        env.API_ROOT + '/api/v1/users/confirmation/email',
        {
          email: req.body.email,
        },
      );
      return res.json(response.data);
    } catch (error: any) {
      res.status(error.response.status).send(error.response.data);
    }
  },

  userRegister: async function (req: CustomRequest, res: express.Response) {
    try {
      const response = await axios.post(
        env.API_ROOT + '/api/v1/users/register',
        {
          key: req.body.key,
          password: req.body.password,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          firstname_kana: req.body.firstname_kana,
          lastname_kana: req.body.lastname_kana,
        },
      );
      return res.json(response.data);
    } catch (error: any) {
      res.status(error.status).send(error.statusText);
    }
  },

  updateProfile: async function (req: CustomRequest, res: express.Response) {
    const profile = JSON.parse(req.body.profile) as UserProfileRequest;

    if (req.file) {
      const formData = new FormData();
      formData.append('thumbnail', req.file.buffer, req.file.originalname);

      try {
        const response = await axios.put(
          env.API_ROOT + '/api/v1/users/me/thumbnail',
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: 'Bearer ' + req.session.token,
            },
          },
        );
        profile.thumbnail = response.data.thumbnail;
      } catch (error) {
        res.status(400).send();
      }
    }

    try {
      await axios.patch(env.API_ROOT + '/api/v1/users/me/profile', profile, {
        headers: {
          Authorization: 'Bearer ' + req.session.token,
        },
      });
      res.status(200).send();
    } catch (error) {
      res.status(400).send();
    }
  },

  changePassword: async function (req: CustomRequest, res: express.Response) {
    try {
      const response = await axios.patch(
        env.API_ROOT + '/api/v1/users/me/password',
        {
          current_password: req.body.current_password.trim(),
          new_password: req.body.new_password.trim(),
        },
        {
          headers: {
            Authorization: 'Bearer ' + req.session.token,
          },
        },
      );
      return res.json(response.data);
    } catch (error: any) {
      res.status(error.response.status).send(error.response.statusText);
    }
  },

  emailChangeCode: async function (req: CustomRequest, res: express.Response) {
    try {
      const response = await axios.post(
        env.API_ROOT + '/api/v1/users/email-change-code',
        {
          email: req.body.email,
        },
        {
          headers: {
            Authorization: 'Bearer ' + req.session.token,
          },
        },
      );
      res.status(200).send();
    } catch (error: any) {
      res.status(error.response.status).send(error.response.statusText);
    }
  },

  emailVerifyCode: async function (req: CustomRequest, res: express.Response) {
    try {
      const response = await axios.patch(
        env.API_ROOT + '/api/v1/users/email',
        {
          code: req.body.code,
        },
        {
          headers: {
            Authorization: 'Bearer ' + req.session.token,
          },
        },
      );
      return res.json(response.data);
    } catch (error: any) {
      res.status(error.response.status).send(error.response.statusText);
    }
  },

  userLogout: function (req: CustomRequest, res: express.Response) {
    if (req.session.token) req.session.token = '';
    res.status(200).send();
  },
};
