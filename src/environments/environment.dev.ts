import { Utils } from '../utils/Utils';
import { Environment } from './environment';

Utils.dotenvConfigs();

export const DevEnvironment: Environment = {
  db_uri: process.env.DEV_DB_URI,
  jwt_secret_key: 'secret_key_dev',
  gmail_auth: {
    user: process.env.DEV_MAIL_USER,
    pass: process.env.DEV_MAIL_PASS,
  },
};
