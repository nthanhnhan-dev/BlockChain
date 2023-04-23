const app=require('express')
const router=app.Router()
const BlockC=require('../controller/convertmoney.c')


router.get('/sendmoney',BlockC.sendmoney)


router.post('/sendmoney',BlockC.sendmoney)



module.exports=router;