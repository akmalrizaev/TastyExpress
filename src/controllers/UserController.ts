import User from '../models/User';
import { validationResult } from 'express-validator';
import { Utils } from '../utils/Utils';
import { NodeMailer } from './../utils/NodeMailer';
import * as Bcrypt from 'bcrypt';

export class UserController {
  private static encryptPassword(req, res, next) {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  static async signup(req, res, next) {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    // const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;
    const verification_token = Utils.generateVerificationToken();

    try {
      const hash = await UserController.encryptPassword(req, res, next);
      const data = {
        email,
        verification_token: verification_token,
        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        phone,
        password: hash,
        name,
        type,
        status,
      };

      let user = await new User(data).save();
      res.send(user);
      // send email to user for verification
      await NodeMailer.sendMail({
        to: [user.email],
        subject: 'Email Verification',
        html: `<h1>Your Otp is ${verification_token}`,
      });
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

  static async resendVerificationEmail(req, res, next) {
    const email = req.query.email;
    const verification_token = Utils.generateVerificationToken();
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );
      if (user) {
        await NodeMailer.sendMail({
          to: [user.email],
          subject: 'Resend Email Verification',
          html: `<h1>Your Otp is ${verification_token}`,
        });
        res.json({ success: true });
      } else {
        throw new Error('User does not exist');
      }
    } catch (e) {
      next(e);
    }
  }
}
