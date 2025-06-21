const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')
const auth = require('../middleware/auth')

router.post('/register', authCtrl.register)

router.post('/login', authCtrl.login)

router.post('/logout', authCtrl.logout)

router.post('/refresh_token', authCtrl.generateAccessToken)
router.post('/send_activation_email', auth, authCtrl.sendActivationEmail);
router.post('/activate', authCtrl.activationAccount);


module.exports = router