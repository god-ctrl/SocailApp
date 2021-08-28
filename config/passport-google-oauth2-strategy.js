
const passport=require('passport');
const User = require('../models/user');

const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
//tell passport to use new strategy for google login
passport.use(new googleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/users/auth/google/callback"
    },

    function(accessToken, refreshToken,profile,done) {
        //find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err,user){
            if(err){console.log('error in google strategy passport',err);}
            console.log(profile);
            if(user)
            {
                //if user is found then great
                return done(null,user);
            }
            else
            {
                //if user is not found then just create a new user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){console.log('error in google strategy passport',err);}
                    return done(null,user);
                });
            }
        });
    }
));
module.exports = passport;