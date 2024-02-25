import User from '../models/User';
import { validationResult } from 'express-validator';
import { Utils } from '../utils/Utils';

export class UserController {
  static async signup(req, res, next) {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;

    const data = {
      email,
      verification_token: Utils.generateVerificationToken(),
      verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
      phone,
      password,
      name,
      type,
      status,
    };

    try {
      let user = await new User(data).save();
      // send email to user for verification
      res.send(user);
    } catch (e) {
      next(e);
    }

    // const user = new User({
    //     email,
    //     password
    // });

    // user
    //   .save()
    //   .then((user) => {
    //     res.send(user);
    //   })
    //   .catch((e) => {
    //     next(e);
    //   });
  }

  static async verify(req, res, next) {
    const verification_token = req.body.verification_token;
    const email = req.body.email;
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          verification_token: verification_token,
          verification_token_time: { $gt: Date.now() },
          // type: 'user',
        },
        {
          email_verified: true,
        },
        {
          new: true,
        }
      );
      if (user) {
        res.send(user);
      } else {
        throw new Error(
          'Email Verification Token Is Expired. Please try again...'
        );
      }
    } catch (e) {
      next(e);
    }
  }

  // static test1(req, res, next) {
  //   console.log('test');
  //   (req as any).msg = 'This is a test';
  //   next();
  // }

  // static test2(req, res) {
  //   res.send((req as any).msg);
  // }
}
