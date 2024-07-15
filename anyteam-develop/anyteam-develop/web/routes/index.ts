import * as express from 'express';

const router = express.Router();

const AuthMiddleware = require('../middlewares/auth');

// LP
const IndexController = require('../controllers/index-controller');
router.get('/', IndexController.index);

// マイページ
const UserController = require('../controllers/user-controller');
router.get('/user', AuthMiddleware.checkAuth, UserController.index);
router.get('/user/profile', AuthMiddleware.checkAuth, UserController.profile);
router.get('/user/email', AuthMiddleware.checkAuth, UserController.email);
router.get(
  '/user/email/verify',
  AuthMiddleware.checkAuth,
  UserController.verifyEmail,
);
router.get('/user/ranking', UserController.ranking);
router.get('/user/withdrawal', AuthMiddleware.checkAuth, UserController.withdrawal);
router.get('/user/supports/:payment_id/reward', AuthMiddleware.checkAuth, UserController.supportReward);
router.get('/user/supports', AuthMiddleware.checkAuth, UserController.supports);
router.get('/user/wallet', AuthMiddleware.checkAuth, UserController.wallet);
router.get(
  '/user/wallet/edit',
  AuthMiddleware.checkAuth,
  UserController.walletEdit,
);
router.get('/user/password', AuthMiddleware.checkAuth, UserController.password);

// 会員登録
const UserRegisterController = require('../controllers/user/register-controller');
router.get('/user/register/', UserRegisterController.index);
router.get('/user/register/confirm', UserRegisterController.confirm);
router.get('/user/register/:register_key', UserRegisterController.account);

// ログイン
const LoginController = require('../controllers/user/login-controller');
router.get('/user/login', AuthMiddleware.checkNotAuth, LoginController.index);

const OrganizationsController = require('../controllers/organizations/index-controller');
router.get('/organizations/:organization_id', OrganizationsController.index);
router.get(
  '/organizations/:organization_id/supporters',
  OrganizationsController.schoolSupporters,
);
router.get(
  '/organizations/:organization_id/teams/:team_id',
  OrganizationsController.team,
);
router.get(
  '/organizations/:organization_id/teams/:team_id/supporters',
  OrganizationsController.teamSupporters,
);

const SupportController = require('../controllers/support-controller');
router.get('/support', AuthMiddleware.checkAuth, SupportController.index);
router.get(
  '/support/wallet',
  AuthMiddleware.checkAuth,
  SupportController.wallet,
);
router.get(
  '/support/wallet/edit',
  AuthMiddleware.checkAuth,
  SupportController.walletEdit,
);
router.get(
  '/support/confirm',
  AuthMiddleware.checkAuth,
  SupportController.confirm,
);
router.get(
  '/support/:purchase_id/complete',
  AuthMiddleware.checkAuth,
  SupportController.complete,
);

const AboutController = require('../controllers/about/index-controller');
router.get('/about', AboutController.index);
router.get('/about/support', AboutController.support);
router.get('/about/privacy', AboutController.privacy);
router.get('/about/company', AboutController.company);
router.get('/about/faq', AboutController.faq);
router.get('/about/faq/register', AboutController.faqRegister);
router.get('/about/faq/login', AboutController.faqLogin);
router.get('/about/faq/donation', AboutController.faqDonation);
router.get('/about/faq/account', AboutController.faqAccount);
router.get('/about/faq/payment', AboutController.faqPayment);
router.get('/about/faq/cancel', AboutController.faqCancel);
router.get('/about/faq/withdrawal', AboutController.faqWithdrawal);
router.get('/about/contact', AboutController.contact);
router.get(
  '/about/commercial-transactions',
  AboutController.commercialTransactions,
);
router.get('/about/terms', AboutController.terms);

const ErrorController = require('../controllers/error-controller');
router.get('/500', ErrorController.internalServerError);

const MaintenanceController = require('../controllers/maintenance-controller');
router.get('/maintenance', MaintenanceController.maintenance);

module.exports = router;
