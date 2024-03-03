import { body } from 'express-validator';
import { nextTick } from 'process';
import User from '../models/User';

export class UserValidators {
  static signup() {
    return [
      body('name', 'Name is required').isString(),
      body('phone', 'Phone number is required').isString(),
      body('email', 'Email is required')
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
            // type: 'user',
          })
            .then((user) => {
              if (user) {
                // throw new Error('User Already Exists');
                throw 'User Already Exists';
              } else {
                return true;
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body('password', 'Password is required')
        .isAlphanumeric()
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8-20 characters'),
      body('type', 'User role type is required').isString(),
      body('status', 'User status is required').isString(),
      // .custom((value, { req }) => {
      //     if(req.body.email) return true;
      //     else {
      //         throw new Error('Email is not available for validation');
      //     }
      // }),
    ];
  }

  static verifyUserEmail() {
    return [
      body(
        'verification_token',
        'Email verification token is required'
      ).isNumeric(),
      body('email', 'Email is required').isEmail(),
    ];
  }
}
