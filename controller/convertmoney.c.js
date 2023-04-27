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

        const username = req.body.sender
        const password = req.body.password;

        console.log(req.body)
        const userDatabase = await userM.getUserByName(username);
        const compare = bcrypt.compareSync(password, userDatabase[0].Password);
        if (compare) {
            const transaction = {
                From: req.body.sender,
                To: req.body.receiver,
                Amount: req.body.money
            }
            await moneyM.addTransaction(transaction);

            res.render("convertmoney/pending", {
                transaction: transaction
            })
        }
        else {
            res.render("convertmoney/sendmoney", {
                error: "Wrong password"
            })
        }

        res.render("convertmoney/pending", {

        })
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