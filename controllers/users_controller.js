const User = require("../models/user");
const Otp = require("../models/otp");
const Friendship = require("../models/friendship");
const fs = require('fs');
const path = require('path');

const otpMailer = require('../mailers/otp_mailer');
// const queue = require('../config/kue');
// const commentEmailWorker = require('../workers/comment_email_worker');
module.exports.profile=async function(req,res){
    console.log()
    if(req.params.id==req.user._id)
    {
        console.log("redirected");
        return res.redirect('/users/profile');
    }
    user = await User.findById(req.params.id);
    let check=0;
    console.log(user);
    console.log(req.user.friends[0]);
    for(fri of req.user.friends)
    {
        if(fri==user.id)
        {
            check=1;
        }
    }
    console.log(check)
    if(check==1)
    {
        return res.render('user' ,{
            title: "User",
            profile_user: user,
            check: 1
        });
    }
    let request=await Friendship.findOne({from_user:req.body.user,to_user:user});
    if(request)
    {
        console.log('kaise aya idhar');
        console.log(request);
        return res.render('user' ,{
            title: "User",
            profile_user: user,
            check:2
        });
    }
    request=await Friendship.findOne({to_user:req.body.user,from_user:user});
    if(request)
    {
        // console.lor
        return res.render('user' ,{
            title: "User",
            profile_user: user,
            check:3
        });
    }
    return res.render('user' ,{
        title: "User",
        profile_user: user,
        check:4
    });
     
   
}
module.exports.profile2=async function(req,res){
        let requests = await Friendship.find({
            to_user:req.user._id
        })
        .populate('from_user');

        let user=await User.findOne(req.user)
        .populate({
            path:'friends',
            model:'User'
        })
        console.log(user.friends[0].name);
        console.log(user.friends[0]);
        return res.render('user' ,{
            title: "User",
            me:user,
            requests:requests
    });
   
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
                    if(user.avatar)
                    {
                        try{
                            fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                        }
                        catch(err)
                        {
                            console.log('file was not found');
                        }
                    }
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
module.exports.updatePassword=async function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    let userToChange=await User.findOne({email:req.body.email});
    if(userToChange)
    {
        let ottp=await Otp.findOne({email:req.body.email,code:req.body.otp});
        // console.log(ottp.email,);
        if(ottp) 
        {
            let time=new Date().getTime();
            console.log(time);
            console.log(ottp.expireIn);
            if(ottp.expireIn<time)
            {
                req.flash('error','invalid otp');
                return res.redirect('back');
            }
            else
            {
                userToChange.password = req.body.password;
                userToChange.save();
                req.flash('success','password changed');
                return res.redirect('/users/sign-in');
            }
        }
        else
        {
            req.flash('error','invalid otp');
            return res.redirect('back');
        }
    }
    else
    {
        req.flash('error','User not found');
        return res.redirect('back');
    }
}

//render sighup page
module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    //Nothing is uploaded.....
    return res.render('user_signup',{
        title:"Socail App| Sign Up"
    })
    
}
//render the signin page
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_signin',{
        title:"Social App | Sign In"
    })
    
}
module.exports.getEmail=function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('forgotPassword',{
        title:"forgot PassWord"
    });
}
module.exports.getOtp=async function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    if(req.body.email)
    {
        let mail=await User.findOne({email:req.body.email});
        if(mail)
        {
            //After creating Otp 
            let otpCode = Math.floor((Math.random() * 10000)+1);
            let ootp = await Otp.create({
                email:req.body.email,
                code:otpCode,
                expireIn: new Date().getTime() + 300*1000
            });
            // let otpResponse = await otpData.save();
            otpMailer.newOtp(ootp);
            res.redirect('/users/resetPassword');
        }
        else
        {
            console.log(mail);
            req.flash('error','Email is invalid');
            return res.redirect('back');
        }
    }
    else
    {
        console.log('the email was not given from the form');
        return res.redirect('back');
    }
}
module.exports.resetPassword=function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('resetPassword',{
        title:"forgot PassWord"
    });
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