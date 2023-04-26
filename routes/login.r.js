const app = require('express')
const router = app.Router()
const BlockC = require('../controller/login.c')


router.get('/login/signin', BlockC.signin)
router.post('/login/signin', BlockC.signin)
router.get('/login/profile', BlockC.profile);

router.get('/login/signup', BlockC.signup)
router.post('/login/signup', BlockC.signup)
router.post('/logout', BlockC.logout);



module.exports = router;