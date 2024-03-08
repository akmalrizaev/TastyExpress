import * as dotenv from 'dotenv';

import { getEnvironmentVariables } from '../environments/environment';
import * as jwt from 'jsonwebtoken';

export class Jwt {
  static jwtSign(payload, expires_in: string = '180d') {
    jwt.sign(payload, getEnvironmentVariables().jwt_secret_key, {
      expiresIn: expires_in,
    });
  }

  static jwtVerify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getEnvironmentVariables().jwt_secret_key,
        (err, decoded) => {
          if (err) reject(err);
          else if (!decoded) reject(new Error('User is not authorised.'));
          else resolve(decoded);
        }
      );
    });
  }
}
