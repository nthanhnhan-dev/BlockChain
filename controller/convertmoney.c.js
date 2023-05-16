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

        //console.log(userDatabase)
        const compare = bcrypt.compareSync(password, userDatabase[0].PASSWORD);

        const sender_username = req.body.sender;
        const receiver_username = req.body.receiver

        const balance_sender = (await userM.getUserBalance(sender_username))[0].BALANCE
        const balance_receiver = (await userM.getUserBalance(receiver_username))[0].BALANCE
        const user = await userM.getUserByName(req.session.user);
        const alluser = await userM.getAllUserExceptOwner(req.session.user);
        if (compare) {
            const transaction = {
                FROM: (await moneyM.getAccountNoByUsername(sender_username))[0].ACCOUNT_NO,
                TO: (await moneyM.getAccountNoByUsername(receiver_username))[0].ACCOUNT_NO,
                AMOUNT: Number(req.body.money),
                MESSAGE: req.body.message,
                TIMESTAMP: new Date(),
            }
            if (balance_sender < req.body.money) {
                res.render("convertmoney/wrongpassword", {
                    errorBalance: "Not enough money",
                    account: req.session.user,
                    user: user[0],
                    alluser: alluser,
                })
            }
            else {
                await moneyM.addTransaction(transaction);
                await userM.updateBalance(balance_sender - transaction.AMOUNT, transaction.FROM)
                await userM.updateBalance(balance_receiver + transaction.AMOUNT, transaction.TO)

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
exports.coinhistory = async (req, res, next) => {
    const user = req.session.user
    const coin_transaction_BD = await userM.getCoinTransactionByUsername(user);
    if (Object.keys(coin_transaction_BD).length === 0) {
        res.render("convertmoney/history", {
            account: req.session.user,
            transaction: coin_transaction_BD
        })
    }
    else {
        for (var i = 0; i < Object.keys(coin_transaction_BD).length; i++) {
            coin_transaction_BD[i].ID_TRANSACTION = coin_transaction_BD[i].ID_TRANSACTION_COIN;

            delete coin_transaction_BD[0].ID_TRANSACTION_COIN;
        }

        res.render("convertmoney/history", {
            account: req.session.user,
            transaction: coin_transaction_BD
        })
    }

}
exports.sendcoin = async (req, res, next) => {
    if (req.method === "GET") {
        const user = await userM.getUserByName(req.session.user);
        const alluser = await userM.getAllUserExceptOwner(req.session.user);
        res.render("convertmoney/sendcoin", {
            account: req.session.user,
            user: user[0],
            alluser: alluser,
        })
    }
    else if (req.method === "POST") {
        //console.log(req.body)
        const sender = req.body.sender
        const password = req.body.password;
        const userDatabase = await userM.getUserByName(sender);
        const compare = bcrypt.compareSync(password, userDatabase[0].PASSWORD);
        const sender_username = req.body.sender;
        const receiver_username = req.body.receiver
        const coin_sender = (await userM.getReward(sender_username))[0].REWARDS
        const coin_receiver = (await userM.getReward(receiver_username))[0].REWARDS
        const user = await userM.getUserByName(req.session.user);
        const alluser = await userM.getAllUserExceptOwner(req.session.user);
        const balance_sender = (await userM.getUserBalance(sender_username))[0].BALANCE
        if (compare) {
            const transaction_coin = {
                FROM: (await moneyM.getAccountNoByUsername(sender_username))[0].ACCOUNT_NO,
                TO: (await moneyM.getAccountNoByUsername(receiver_username))[0].ACCOUNT_NO,
                AMOUNT: Number(req.body.coin),
                TIMESTAMP: new Date()
            }
            if (coin_sender < req.body.coin) {
                res.render("convertmoney/wrongpassword_coin", {
                    errorBalance: "Not enough coin",
                    account: req.session.user,
                    user: user[0],
                    alluser: alluser,
                })
            }
            else {
                await userM.addCoinTransaction(transaction_coin);
                await userM.updateReward(sender_username, coin_sender - transaction_coin.AMOUNT)
                await userM.updateReward(receiver_username, coin_receiver + transaction_coin.AMOUNT);
                await userM.updateBalance(balance_sender - Number(req.body.fee), sender_username)
                res.redirect('/sendcoin')
            }

        }
        else {

            res.render("convertmoney/wrongpassword_coin", {
                errorPassword: "Wrong password",
                account: req.session.user,
                user: user[0],
                alluser: alluser,
            })
        }
    }
}