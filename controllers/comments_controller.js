const Comment=require('../models/comment');

const Post=require('../models/post');


module.exports.create = async function(req, res){
    try{
        let post= await Post.findById(req.body.post);
        if(post){
            let comment= await Comment.create({
                content:req.body.content,
                post : req.body.post,
                user : req.user._id
            });
           
            post.comments.push(comment);
            post.save();
            req.flash('success','Commented successfully');
            res.redirect('/');
            
        }
    }
    catch(err){
         req.flash('error',err);
         return;
    };
}

module.exports.destroy =  function(req, res){
    Comment.findById(req.params.id,function(err,comment){
        
        if(comment)
        {
            let userId = -1;
            Post.findById(comment.post,function(err,post){
                if(err)
                {
                    req.flash('error',err);
                    return;
                }
                userId=post.user;
                
                if(req.user.id==userId)
                {
                    let postId=comment.post;
                    req.flash('success','Deleted successfully');
                    comment.remove();

                    Post.findByIdAndUpdate(postId,{$pull: {comments:req.params.id}},function(err,post){
                    return res.redirect('back');
                     });
                }
                else if(comment.user==req.user.id)
                {
                    let postId=comment.post;

                    comment.remove();
                    req.flash('success','Deleted successfully');
                    Post.findByIdAndUpdate(postId,{$pull: {comments:req.params.id}},function(err,post){
                        return res.redirect('back');
                    });
                }
                else
                {
                    return res.redirect('back');
                }
            });
            
        }
        else{
            return res.redirect('back');
        }
    })
}