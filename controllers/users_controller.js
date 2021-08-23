const User = require("../models/user");

module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user' ,{
            title: "User",
            profile_user: user
        });
    })
   
}
module.exports.profile2=function(req,res){
    
        return res.render('user' ,{
            title: "User"
    })
   
}
module.exports.update =  async (req,res) => {
    if(req.user.id = req.params.id){
        try{
         let user = await User.findById(req.params.id);
         User.uploadedAvatar(req,res,(err)=>{
             if(err){console.log(`Multer error`,err);return;}
             else
             {
                console.log(req.file);
                user.name = req.body.name,
                user.email = req.body.email
                if(req.file){
                    
                    //saving the path of uploaded file into avatar field in user
                    user.avatar = User.avatar_path + '\\' +req.file.filename ;
                }
                user.save();
                return res.redirect('back')
            }
         })
        }catch (err){
         req.flash('error',err);
         return res.redirect('back')
        }
 
        
 
    }else{
         req.flash('error','Unauthorized!');
         return res.status(401).send('Unauthorized')
    }
 }


//render sighup page
module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    //Nothing is uploaded.....
    return res.render('user_signup',{
        title:"Codecial| Sign Up"
    })
    
}
//render the signin page
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
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
            return res.redirect('/users/sign-in');
        }
    })
}
//sign-in to create a session for the user
module.exports.createSession= function(req,res){
    req.flash('success','login successful');
    return res.redirect('/users/profile');
}
module.exports.destroySession= function(req,res){
    req.logout();
    req.flash('success','you have logged out successfully');
    return res.redirect('/');
}