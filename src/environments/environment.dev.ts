import { Utils } from '../utils/Utils';
import { Environment } from './environment';

Utils.dotenvConfigs();

export const DevEnvironment: Environment = {
  db_uri: process.env.DEV_DB_URI,
};
