const moneyM = require("../model/convertmoney.m")
const userM = require("../model/login.m")
exports.sendmoney = async (req, res, next) => {
    const user = await userM.getUserByName(req.session.user);
    console.log(user[0].Balance)
    res.render('./convertmoney/sendmoney',
        {
            account: req.session.user,
            user: user[0],
        });

}