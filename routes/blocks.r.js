
const app=require('express')
const router=app.Router()
const BlockC=require('../controller/blocks.c')


router.get('/blockchain',BlockC.createBlockChain)


router.post('/blockchain',BlockC.createBlockChain)



module.exports=router;