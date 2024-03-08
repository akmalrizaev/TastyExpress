import User from '../models/User';
import { validationResult } from 'express-validator';
import { Utils } from '../utils/Utils';
import { NodeMailer } from './../utils/NodeMailer';
import { Jwt } from './../utils/Jwt';

export class UserController {
  static async signup(req, res, next) {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;
    const verification_token = Utils.generateVerificationToken();

    try {
      const hash = await Utils.encryptPassword(password);
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
      const payload = {
        user_id: user._id,
        email: user.email,
      };
      const token = Jwt.jwtSign(payload);
      res.json({
        token: token,
        user: user,
      });
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
    // res.send(req.decoded);

    const verification_token = req.body.verification_token;
    const email = req.user.email;
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
          'Wrong Otp or Email Verification Token Is Expired. Please try again...'
        );
      }
    } catch (e) {
      next(e);
    }
  }

  static async resendVerificationEmail(req, res, next) {
    const email = req.user.email;
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

  static async login(req, res, next) {
    const user = req.user;
    const password = req.query.password;

    const data = {
      password: password,
      encrypt_password: user.password,
    };

    try {
      await Utils.comparePassword(data);

      const payload = {
        user_id: user._id,
        email: user.email,
      };
      const token = Jwt.jwtSign(payload);
      res.json({
        token: token,
        user: user,
      });
    } catch (e) {
      next(e);
    }
  }
}
