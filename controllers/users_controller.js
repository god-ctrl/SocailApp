const User = require("../models/user");

module.exports.profile=function(req,res){
    if(req.cookies.user_id)
    {
        User.findById(req.cookies.user_id,function(err,user){
            if(user)
            {
                return res.render('user',{
                    title:"User profile",
                    user:user
                });
            }
            else
            {
                return res.redirect('/users/sign-in');
            }
        });
    }
    else
    {
        return res.redirect('/users/sign-in');
    }
    
}
//render sighup page
module.exports.signUp=function(req,res){
    return res.render('user_signup',{
        title:"Codecial| Sign Up"
    })
    
}
//render the signin page
module.exports.signIn=function(req,res){
    return res.render('user_signin',{
        title:"Codecial| Sign In"
    })
    
}
//get the sign up data
module.exports.create=function(req,res){
    if(req.body.password != req.body.confirm_password){
    return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('error in finding user in signUp');return}

        if(!user)
        {
            User.create(req.body,function(err,user){
                if(err){console.log('error in creating  user in signUp');return};
                return res.redirect('/users/sign-in');
                
            })
        }
        else
        {
            return res.redirect('back');
        }
    })
}
//sign-in to create a session for the user
module.exports.createSession= function(req,res){
    //find the user
    User.findOne({email:req.body.email},function(err,user){
        if(err)
        {
            console.log('error in finding user in signing in');
            return;
        }
        if(user)
        {
            //handle user found
            //handle mismatching passwords which dont match
            if(user.password!=req.body.password)
            return res.redirect('/users/sign-up');
            res.cookie('user_id',user.id);
            return res.redirect('/users/profile');
        }
        else
        {
             //handle user not found
             return res.redirect('back');
        }
    });

    

    
}