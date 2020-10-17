const Post=require('../models/post');

const Comment=require('../models/comment');


module.exports.create=function(req,res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    },function(err,post){
        if(err)
        {
            console.log('error in creating a post');
            return;
        }
        return res.redirect('back');
    })
}


module.exports.destroy = function(req,res){
    Post.findById(req.params.id,function(err,post){
        //.id means converting the objectId into String
        if(post.user == req.user.id){
            post.remove();

            Comment.deleteMany({post:req.params.id},function(err){
                if(err)
                {
                    console.log('error in deleting comments of the post');
                    return;
                }
                return res.redirect('back');
            });

        }
        else
        {
            return res.redirect('back');
        }
    });
}