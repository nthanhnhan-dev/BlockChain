const moneyM = require("../model/convertmoney.m")
const userM = require("../model/login.m")
const bcrypt = require("bcryptjs");
const hash = require('crypto-js/sha256');
const he = require('he');

exports.pending = async (req, res, next) => {
    if (req.method == "GET") {
        const transaction_BD = await moneyM.getAllTransactions();

        res.render("convertmoney/pending", {
            transaction: transaction_BD
        })
    }
    else if (req.method == "POST") {
        const sender = req.body.sender
        const password = req.body.password;
        const userDatabase = await userM.getUserByName(sender);
        const compare = bcrypt.compareSync(password, userDatabase[0].PASSWORD);
        const sender_username = await moneyM.getUserNameByOwner(req.body.sender);
        const receiver_username = await moneyM.getUserNameByOwner(req.body.receiver)
        if (compare) {
            const transaction = {
                FROM: (await moneyM.getAccountNoByUsername(sender_username[0].USERNAME))[0].ACCOUNT_NO,
                TO: (await moneyM.getAccountNoByUsername(receiver_username[0].USERNAME))[0].ACCOUNT_NO,
                AMOUNT: req.body.money
            }
            await moneyM.addTransaction(transaction);
            res.redirect('/sendmoney')
        }
        else {
            res.render("convertmoney/sendmoney", {
                error: "Wrong password"
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

exports.getTransactions = async (req, res, next) => {
    const id = req.params.id
    const transactions = await homeM.getAllTransactions(id);
    const displayTransaction = []




    for (let i = 0; i < transactions.length; i++) {
        var sender = await homeM.getUserById(transactions[i].from)
        var receiver = await homeM.getUserById(transactions[i].to)

        displayTransaction[i] = {
            id: transactions[i].id,
            sender: sender.account_no,
            receiver: receiver.account_no,
            amount: transactions[i].amount,
            time: transactions[i].trans_time,

        }


    }
    res.render("transaction", {
        transactions: displayTransaction,
        title: "Transacations",
        empty: displayTransaction.length === 0
    })
}