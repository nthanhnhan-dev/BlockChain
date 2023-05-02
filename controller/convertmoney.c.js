const moneyM = require("../model/convertmoney.m")
const userM = require("../model/login.m")
const blockM = require("../model/block.m")
const bcrypt = require("bcryptjs");
const hash = require('crypto-js/sha256');
const he = require('he');

exports.pending = async (req, res, next) => {
    if (req.method == "GET") {
        const transaction_BD = await moneyM.getAllTransactions();

        res.render("convertmoney/pending", {
            transaction: transaction_BD,
            account: req.session.user
        })
    }
    else if (req.method == "POST") {
        const sender = req.body.sender
        const password = req.body.password;
        const userDatabase = await userM.getUserByName(sender);
        const compare = bcrypt.compareSync(password, userDatabase[0].PASSWORD);
        const sender_username = await moneyM.getUserNameByOwner(req.body.sender);
        const receiver_username = await moneyM.getUserNameByOwner(req.body.receiver)
        const balance = (await userM.getUserBalance(sender_username[0].USERNAME))[0].BALANCE
        const user = await userM.getUserByName(req.session.user);
        const alluser = await userM.getAllUserExceptOwner(req.session.user);
        if (compare) {
            const transaction = {
                FROM: (await moneyM.getAccountNoByUsername(sender_username[0].USERNAME))[0].ACCOUNT_NO,
                TO: (await moneyM.getAccountNoByUsername(receiver_username[0].USERNAME))[0].ACCOUNT_NO,
                AMOUNT: req.body.money,
                MESSAGE: req.body.message
            }
            if (balance < req.body.money) {
                res.render("convertmoney/wrongpassword", {
                    errorBalance: "Not enough money",
                    account: req.session.user,
                    user: user[0],
                    alluser: alluser,
                })
            }
            else {
                await moneyM.addTransaction(transaction);
                await userM.updateBalance(balance - transaction.AMOUNT, transaction.FROM)

                res.redirect('/sendmoney')
            }

        }
        else {

            res.render("convertmoney/wrongpassword", {
                errorPassword: "Wrong password",
                account: req.session.user,
                user: user[0],
                alluser: alluser,
            })
        }

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
        console.log("from sendmoney", req.body)

    }

}

exports.history = async (req, res, next) => {
    const user = req.session.user
    const transaction_BD = await moneyM.getTransactionByUsername(user);
    res.render("convertmoney/history", {
        account: req.session.user,
        transaction: transaction_BD
    })
}