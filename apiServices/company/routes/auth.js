const router = require('express').Router();

const { controllerRegister, controllerLogin } = require('../controllers/company');

router.post('/login', controllerLogin);

router.post('/register', controllerRegister)

module.exports = router;