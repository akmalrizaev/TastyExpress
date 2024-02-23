import { UserValidators } from './../validators/UserValidators';
import { UserController } from './../controllers/UserController';
import { Router } from 'express';

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
  }

  postRoutes() {
    this.router.post('/signup', UserValidators.signup(), UserController.signup);
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new UserRouter().router;
