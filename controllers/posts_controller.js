const Post=require('../models/post');

const Comment=require('../models/comment');
const Like=require('../models/like');


module.exports.create= async function(req,res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            
            return res.status(200).json({
                data: {
                    post:post
                },
                message: "Post created"

            });
        }
        req.flash('success','Post Published successfully');
        return res.redirect('back');
    }
    catch(err) {
        req.flash('error',err);
        return;
    }
}


module.exports.destroy = async function(req,res){
    try{
        let post= await Post.findById(req.params.id);

        if(post.user == req.user.id){
            await Like.deleteMany({
                likeable:post,
                onModel:'Post'
            });
            await Like.deleteMany({
                _id: {$in: post.comments}
            })

            post.remove();
            
            await Comment.deleteMany({post:req.params.id});
            req.flash('success','Deleted successfully');
            return res.redirect('back');
    
        }
        else
        {
            return res.redirect('back');
        }
    }
    catch(err)
    {
        req.flash('error',err);
        return;
    };
    return;
  
}