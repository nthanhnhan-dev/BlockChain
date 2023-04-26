const moneyM = require("../model/convertmoney.m")
const userM = require("../model/login.m")
exports.sendmoney = async (req, res, next) => {
    if (req.method == "GET") {
        const user = await userM.getUserByName(req.session.user);
        const alluser = await userM.getAllUserExceptOwner(req.session.user);
        res.render('./convertmoney/sendmoney',
            {
                account: req.session.user,
                user: user[0],
                alluser: alluser,
            });
    }
    else if (req.method == "POST") {
        console.log(req.body)
    }

}