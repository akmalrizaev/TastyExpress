import { Utils } from '../utils/Utils';
import { Environment } from './environment';

Utils.dotenvConfigs();

export const ProdEnvironment: Environment = {
  db_uri: process.env.PROD_DB_URI,
};
