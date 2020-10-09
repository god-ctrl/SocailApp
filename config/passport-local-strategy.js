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


module.exports=passport;
