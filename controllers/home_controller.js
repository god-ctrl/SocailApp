const Post = require("../models/post");

const User = require("../models/user");
module.exports.home= async function(req,res){
   
        

        
        try{
        //populate the user of each post
        let posts =await Post.find({})
        .populate('user')
        .populate({
            path:'comments',
            populate : {
                path: 'user'
            }
        });

        let users =  await User.find({});
        
            return res.render('home',{
            title: "Codecial|Home",
            posts: posts,
            all_users: users
        }); 
    }catch(err){
        console.log('error',err);
    }  
    
}