require('./db/mongoose')
const express = require("express")
const userRouter =  require("./router/userRouter")
const profileRouter =  require("./router/profileRouter")
const path = require("path");
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const app = express();

const port = process.env.PORT || 3000;

app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultView: 'main',
    layoutsDir   : path.join(__dirname,'../views/layouts')
}));


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));
// app.use(express.static(path.join(__dirname,'../views')));
app.use(express.static(path.join(__dirname,'../views')));
app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/profile', profileRouter);


app.get('/', function (req, res) {
    res.redirect('/user/home')
});


app.listen(port, ()=> {  
    console.log("Server is running on the port "+ port);
})