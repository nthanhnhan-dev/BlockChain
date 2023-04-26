const express = require('express')
const exphbs = require('express-handlebars')
const port = 3000;
const app = express();
var session = require("cookie-session");
/* must */
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static("public"));

app.engine('hbs', exphbs.engine({
    layoutsDir: './views/_layouts',
    defaultLayout: 'main.hbs',
    partialsDir: './views/_partials',
    extname: 'hbs'
}))
app.use(
    session({
        secret: "best secret key",
        resave: true,
        cookie: { secure: false },
        saveUninitialized: true,
    })
);


app.set('view engine', 'hbs')

app.get('/', function (req, res) {
    res.render('home')
})

app.use('/', require('./routes/blocks.r'))

app.use('/', require('./routes/convertmoney.r'));

app.use('/', require('./routes/login.r'));

app.listen(port, function () {
    console.log(`Server is running at http://localhost:${port}`);
})