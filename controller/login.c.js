const bcrypt = require("bcryptjs");
const userM = require("../model/login.m");
const saltRounds = 10;
exports.signin = async (req, res, next) => {
    if (req.method == "GET") {
        res.render('./login/signin');
    }
    else if (req.method == "POST") {
        const username = req.body.username;
        const password = req.body.password;

        const userDatabase = await userM.getUserByName(username);
        //console.log(userDatabase)
        console.log(password)
        console.log(userDatabase[0].Password)
        if (userDatabase.length === 0) {
            return res.send("Ivalid User");
        } else {
            const compare = bcrypt.compareSync(password, userDatabase[0].Password);
            if (compare) {
                console.log("true")
                res.render('blockchain/blockchain')
            } else {
                res.redirect('/login/signin')

            }
        }
    }
}

exports.signup = async (req, res, next) => {
    if (req.method == "GET") {
        res.render('./login/signup');
    }
    else if (req.method == "POST") {
        const existAccount = await userM.checkExist(
            req.body.f_Username,
            req.body.f_Email,
            req.body.f_account_no,
        );
        console.log(existAccount[0].exist)
        if (existAccount[0].exist == 1) {
            res.render('login/signup')
        }
        else if (existAccount[0].exist == 0) {
            const passwordHased = await bcrypt.hash(req.body.f_Password, saltRounds);
            const user = {
                ID_User: req.body.f
            }
            res.redirect('/login/signin')
        }



    }
}