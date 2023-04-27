const bcrypt = require("bcryptjs");
const userM = require("../model/login.m");
const saltRounds = 10;
exports.signin = async (req, res, next) => {
    if (req.method == "GET") {
        // if (req.session.user) res.redirect("/");

        res.render('login/signin');
    }
    else if (req.method == "POST") {
        const username = req.body.username;
        const password = req.body.password;
        const userDatabase = await userM.getUserByName(username);

        if (userDatabase.length === 0) {
            res.render('login/signin', {
                error: "Username invalid.Create one !",
            });
        } else {
            const compare = bcrypt.compareSync(password, userDatabase[0].PASSWORD);
            if (compare) {
                req.session.user = req.body.username;

                res.render('blockchain/blockchain', {
                    account: req.session.user,
                })
            } else {
                res.render('login/signin', {
                    error: "Password incorrect",
                });

            }
        }
    }
}

exports.signup = async (req, res, next) => {
    if (req.method == "GET") {
        req.session.user = req.body.f_Username;

        res.render('./login/signup');
    }
    else if (req.method == "POST") {
        const existAccount = await userM.checkExist(
            req.body.f_Username,
            req.body.f_Email,
            req.body.f_account_no,
        );
        if (existAccount[0].exist == 1) {
            res.render('login/signup', {
                error: "Username,Email and Account Number already exists"
            })
        }
        else if (existAccount[0].exist == 0) {
            const passwordHased = await bcrypt.hash(req.body.f_Password, saltRounds);
            const user = {

                ACCOUNT_NO: req.body.f_account_no,
                OWNER: req.body.f_Name,
                BALANCE: req.body.f_balance,
                USERNAME: req.body.f_Username,
                PASSWORD: passwordHased,
                EMAIL: req.body.f_Email,


            }
            await userM.addUser(user);
            req.session.user = req.body.username;

            res.redirect('/login/signin')
        }



    }
}

exports.profile = async (req, res, next) => {
    const user = await userM.getUserByName(req.session.user);

    res.render('login/profile',
        {
            account: req.session.user,
            user: user[0],
        }
    )
}
exports.logout = async (req, res, next) => {
    req.session.user = null;
    res.redirect("/login/signin");
}