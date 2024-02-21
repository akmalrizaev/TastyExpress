import * as dotenv from 'dotenv';

export class Utils {
  static dotenvConfigs() {
    dotenv.config({ path: '.env' });
  }
}
