const express=require('express');
const cookieParser= require('cookie-parser');
const port=8000;
const app=express();
const expressLayouts =require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const MongoStore=require('connect-mongo')(session);
const flash = require('connect-flash');
const customMware = require('./config/middleware')



app.use(express.urlencoded({extended:false})); 
app.use(cookieParser());
app.use(express.static('assets'));
app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.use(express.static('./assets'));
//set up the view engine
app.set('view engine','ejs');
app.set('views', './views');

//mongo store is used to store the session cookie

app.use(session({
    name:'codecial',
    //todo change the secret before deploying in production mode
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)

    },
    store:new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function (err){
            console.log(err|| 'connect-mongodb setup ok');
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//use express router
app.use(flash());
app.use(customMware.setFlash);
app.use('/',require('./routes'));
app.listen(port,function(err){
    if(err)
    {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`server is running on port: ${port}`);
});