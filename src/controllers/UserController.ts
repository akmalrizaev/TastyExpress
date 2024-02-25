import User from '../models/User';
import { validationResult } from 'express-validator';

export class UserController {
  static async signup(req, res, next) {
    const errors = validationResult(req);
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array().map((x) => x.msg) });
      next(new Error(errors.array()[0].msg));
    }

    const data = {
      email,
      phone,
      password,
      name,
      type,
      status,
    };

    try {
      let user = await new User(data).save();
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

  // static test1(req, res, next) {
  //   console.log('test');
  //   (req as any).msg = 'This is a test';
  //   next();
  // }

  // static test2(req, res) {
  //   res.send((req as any).msg);
  // }
}
