const moneyM = require("../model/convertmoney.m")
const userM = require("../model/login.m")


const hash = require('crypto-js/sha256');
const he = require('he');

exports.pending = async (req, res, next) => {
    if (req.method == "GET") {
        res.render("convertmoney/pending", {

        })
    }
    else if (req.method == "POST") {
    }
}


exports.sendmoney = async (req, res, next) => {
    if (req.method == "GET") {
        const user = await userM.getUserByName(req.session.user);
        const alluser = await userM.getAllUserExceptOwner(req.session.user);
        res.render('convertmoney/sendmoney',
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