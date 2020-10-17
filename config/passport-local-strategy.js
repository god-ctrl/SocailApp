const passport=require('passport');
const User = require('../models/user');

const LocalStrategy=require('passport-local').Strategy;


//authentication using passort
passport.use(new LocalStrategy({
    usernameField: 'email'
    },
    function(email,password,done){
        //find a user and establish the identity
        User.findOne({email:email},function(err,user){
            if(err){
                console.log('error in finding user--->password');
                return done(err);
            }
            if(!user||user.password!=password)
            {
                console.log('invalid username and password');
                return done(null,false);
            }
            return done(null,user);

        });
    }
));
//serialising to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
});



//serialising the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('error in finding user--->password');
            return done(err);
        }
        return done(null,user);
    });
});

//check if the user is authenticated
passport.checkAuthentication=function(req,res,next){
    //if(the user is signed in)
    if(req.isAuthenticated())
    {
        return next();//this should run when it is authenticate
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');

}
passport.setAuthenticatedUser=function(req,res ,next)
{
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the  session cookie and we are just sending this to the locals for the views
        res.locals.user=req.user;
    } 
    next();
}

module.exports=passport;
//this file seems fine ,  ya