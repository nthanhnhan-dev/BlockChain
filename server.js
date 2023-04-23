const express=require('express')
const exphbs=require('express-handlebars')
const port=3000;
const app=express();

/* must */
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json());

app.engine('hbs',exphbs.engine({
    layoutsDir:'./views/_layouts',
    defaultLayout:'main.hbs',
    partialsDir:'./views/_partials',
    extname:'hbs'
}))


app.set('view engine','hbs')

app.get('/',function(req,res){
    res.render('home')
})

const blockRouter=require('./routes/blocks.r');
app.use('/',blockRouter)
const convertRouter=require('./routes/convertmoney.r');
app.use('/',convertRouter)
const loginRouter=require('./routes/login.r');
app.use('/',loginRouter)

app.listen(port,function(){
    console.log(`Server is running at http://localhost:${port}`);
})