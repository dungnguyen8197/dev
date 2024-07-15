import * as express from 'express';

import { getListOrganizationTeams, getTeamDetail, getOrganizationInformation } from '../../helpers/api';
import { CustomRequest } from './../../types/request';

const env = process.env;

const config = {
  gtm_container_id: env.GTM_CONTAINER_ID,
  script_url: '',
  data: {},
};

module.exports = {
  index: async function (req: CustomRequest, res: express.Response) {
    config.script_url = '/static/js/organizations/index.js';

    try {
      const organizationId = Number(req.params.organization_id);

      const organization = await getOrganizationInformation(organizationId);

      const listOrganizationTeams = await getListOrganizationTeams(
        Number(req.params.organization_id),
        req.session.token
      );

      config.data = {
        organization: organization.data,
        organizationActivities: listOrganizationTeams.data,
        isAuthen: !!req.session.token,
      };
    } catch (err) {}

    res.render('index', config);
  },

  schoolSupporters: function (req: CustomRequest, res: express.Response) {
    config.script_url = '/static/js/organizations/school-supporters.js';
    res.render('index', config);
  },

  team: async function (req: CustomRequest, res: express.Response) {
    try {
      const teamDetail = await getTeamDetail(
        Number(req.params.team_id),
        req.session.token
      );
      const listOrganizationTeams = await getListOrganizationTeams(
        Number(req.params.organization_id),
        req.session.token
      );
      config.data = {
        checkLogin : req.session.token ? true : false,
        listOrganizationTeams: listOrganizationTeams.data,
        teamDetail: teamDetail.data,
      };
    } catch (err) {}
    
    config.script_url = '/static/js/organizations/team.js'
    res.render('index', config);
  },

  teamSupporters: function (req: CustomRequest, res: express.Response) {
    config.script_url = '/static/js/organizations/team-supporters.js';
    res.render('index', config);
  },
};
