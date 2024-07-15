import { changePassword } from './../assets/api/users/index';
import * as express from 'express';

const router = express.Router();

const multer = require('multer')();
const AuthMiddleware = require('../middlewares/auth');

// ログインAPI
const LoginApiController = require('../controllers/api/login-controller');
router.post('/login', LoginApiController.index);

const UserApiController = require('../controllers/api/user-controller');
router.post('/users/confirmation/email', UserApiController.confirmationEmail);
router.post('/users/register', UserApiController.userRegister);
router.post(
  '/user/profile',
  AuthMiddleware.checkAuth,
  multer.single('thumbnail'),
  UserApiController.updateProfile,
);
router.post(
  '/user/email',
  AuthMiddleware.checkAuth,
  UserApiController.emailChangeCode,
);
router.patch(
  '/user/email/verify',
  AuthMiddleware.checkAuth,
  UserApiController.emailVerifyCode,
);
router.post(
  '/user/logout',
  AuthMiddleware.checkAuth,
  UserApiController.userLogout,
);

router.patch(
  '/user/change-password',
  AuthMiddleware.checkAuth,
  UserApiController.changePassword,
);

const SupportApiController = require('../controllers/api/support-controller');
router.post('/support', AuthMiddleware.checkAuth, SupportApiController.index);
router.post(
  '/support/execute',
  AuthMiddleware.checkAuth,
  SupportApiController.execute,
);
router.patch(
  '/support/wallet',
  AuthMiddleware.checkAuth,
  SupportApiController.wallet,
);

const ContactApiController = require('../controllers/api/contact-controller');
router.post('/contact', ContactApiController.sendToDev);

module.exports = router;
