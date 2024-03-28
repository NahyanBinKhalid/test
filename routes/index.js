var express = require('express');
const auth = require('../middlewares/auth');
var router = express.Router();
const controller = require('../controllers/index');
const validator = require('../validations/index');
const upload = require('../middlewares/upload');
const analytics = require('../middlewares/analytics');

/* GET home page. */
router.get(`/`, analytics.statistics, controller.index);
router.post(`/register`, analytics.statistics, validator.register(), controller.register);
router.post(`/login`, analytics.statistics, validator.login(), controller.login);
router.get('/profile', analytics.statistics, auth.verifyToken, controller.profile);
router.put('/profile', analytics.statistics, auth.verifyToken, validator.profile(), controller.updateProfile);
router.post('/avatar', analytics.statistics, auth.verifyToken, upload.single('avatar'), controller.avatar);

module.exports = router;