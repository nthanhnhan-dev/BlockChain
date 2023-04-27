const app = require('express')
const router = app.Router()
const BlockC = require('../controller/convertmoney.c')


router.get('/sendmoney', BlockC.sendmoney)


router.post('/sendmoney', BlockC.sendmoney)
router.get('/pending', BlockC.pending)
router.post('/pending', BlockC.pending)
router.get('/history', BlockC.history);




module.exports = router;