import { Environment } from './environment';

export const DevEnvironment: Environment = {
  db_uri: process.env.DEV_DB_URI,
};
