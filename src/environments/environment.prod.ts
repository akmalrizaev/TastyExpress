import { Utils } from '../utils/Utils';
import { Environment } from './environment';

Utils.dotenvConfigs();

export const ProdEnvironment: Environment = {
  db_uri: process.env.PROD_DB_URI,
  jwt_secret_key: 'secret_key_prod',
  gmail_auth: {
    user: process.env.PROD_MAIL_USER,
    pass: process.env.PROD_MAIL_PASS,
  },
};

// https://myaccount.google.com/lesssecureapps
