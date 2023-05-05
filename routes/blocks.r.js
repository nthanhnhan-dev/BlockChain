
const app = require('express')
const router = app.Router()
const BlockC = require('../controller/blocks.c')


router.get('/blockchain', BlockC.getAllBlockChain)


router.post('/blockchain', BlockC.createBlockChain)



module.exports = router;