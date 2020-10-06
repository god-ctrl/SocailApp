module.exports.profile=function(req,res){
    return res.render('user',{
        title: "User"
    });
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
    //to do later
}
//sign-in to create a session for the user
module.exports.createSession= function(req,res){
    //to do later
}