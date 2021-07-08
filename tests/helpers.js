import { ClientFunction } from 'testcafe';
import axios from 'axios';
import config from './config';

export * from '../server/src/testUtils';

/* global baseUrl */
export const login = ClientFunction((email, password) => window.fetch(`${baseUrl}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: email,
    password: password
  })
}), {
  dependencies: {
    baseUrl: config.baseUrl
  },
});

export const deleteIntegrationtestUser = async (baseUrl) => {
  await axios({
    url: `${baseUrl}/api/integrationTest`,
    method: 'delete'
  });
};
