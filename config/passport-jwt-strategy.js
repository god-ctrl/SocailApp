const passport=require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial'
}

passport.use(new JWTStrategy(opts,function(jwtPayLoad,done){
     User.findById(jwtPayLoad._id, function(err,user){
         if(err){console.log('Error in finding user in jwt');return;}

         if(user){
             return done(null,user);
         }else{
             console.log("pata nai kyu aya yaha");
             return done(null,false);
         }
     })
}));