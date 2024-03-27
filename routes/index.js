var express = require('express');
const auth = require('../middlewares/auth');
var router = express.Router();
const controller = require('../controllers/index');
const validator = require('../validations/index');
const upload = require('../middlewares/upload');

/* GET home page. */
router.get(`/`, controller.index);
router.post(`/register`, validator.register(), controller.register);
router.post(`/login`, validator.login(), controller.login);
router.get('/profile', auth.verifyToken, controller.profile);
router.put('/profile', auth.verifyToken, validator.profile(), controller.updateProfile);
router.post('/avatar', auth.verifyToken, upload.single('avatar'), controller.avatar);

module.exports = router;