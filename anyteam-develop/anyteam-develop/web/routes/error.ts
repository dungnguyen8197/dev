import * as express from 'express';
const router = express.Router();

const ErrorController = require('../controllers/error-controller');
router.get('/', ErrorController.notFound);

module.exports = router;