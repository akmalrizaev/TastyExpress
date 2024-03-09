import { UserValidators } from './../validators/UserValidators';
import { UserController } from './../controllers/UserController';
import { Router } from 'express';
import { GlobalMiddleWare } from './../../middlewares/GlobalMiddleWare';

class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.putRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    // this.router.get(
    //   '/test',
    //   UserController.signup,
    //   UserController.test1,
    //   UserController.test2
    // );

    // this.router.get(
    //   '/send/verification/email',
    //   UserValidators.verifyUserForResendEmail(),
    //   GlobalMiddleWare.checkError,
    //   UserController.resendVerificationEmail
    // );

    this.router.get(
      '/send/verification/email',
      GlobalMiddleWare.auth,
      UserController.resendVerificationEmail
    );

    this.router.get(
      '/login',
      UserValidators.login(),
      GlobalMiddleWare.checkError,
      UserController.login
    );

    this.router.get(
      '/reset/password',
      UserValidators.checkResetPasswordEmail(),
      GlobalMiddleWare.checkError,
      UserController.sendResetPasswordOtp
    );

    this.router.get(
      '/verify/resetPasswordToken',
      UserValidators.verifyResetPasswordToken(),
      GlobalMiddleWare.checkError,
      UserController.sendResetPasswordOtp
    );
  }

  postRoutes() {
    this.router.post(
      '/signup',
      UserValidators.signup(),
      GlobalMiddleWare.checkError,
      UserController.signup
    );
  }

  patchRoutes() {
    this.router.patch(
      '/verify',
      UserValidators.verifyUserEmail(),
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      UserController.verify
    );
  }

  putRoutes() {}

  deleteRoutes() {}
}

export default new UserRouter().router;
