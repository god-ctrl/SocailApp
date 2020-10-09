const express=require('express');
const cookieParser= require('cookie-parser');
const port=7777;
const app=express();
const expressLayouts =require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy')
app.use(express.urlencoded({extended:false})); 
app.use(cookieParser());
app.use(express.static('assets'));
app.use(expressLayouts);
//etract style and scripts from sub pages into the layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.use(express.static('./assets'));
//use express router
app.use('/',require('./routes'));
//set up the view engine
app.set('view engine','ejs');
app.set('views', './views');

app.use(session({
    name:'codecial',
    //todo change the secret before deploying in production mode
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)

    }
}));
app.use(passport.initialize());
app.use(passport.session);

app.listen(port,function(err){
    if(err)
    {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`server is running on port: ${port}`);
});

