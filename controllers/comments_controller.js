const Comment = require('../models/comment');

const Post = require('../models/post');
const Like=require('../models/like');
const commentMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
module.exports.create = async function(req, res){
    try{
        let post= await Post.findById(req.body.post);
        if(post){
            console.log('heelo im ahere');
            let comment= await Comment.create({
                content:req.body.content,
                post : req.body.post,
                user : req.user._id
            });
            console.log('heelo im ahere2');
            
            post.comments.push(comment);
            post.save();
            
            comment = await comment.populate('user', 'name email').execPopulate();
            // commentMailer.newComment(comment);
            let job=queue.create('emails',comment).save(function(err){
                if(err)
                {
                    console.log('err in creating queue for comment email',err);
                    return;
                }
                console.log('new comment mail added to delayed jobs queue',job.id);
            });
            
            req.flash('success','Commented successfully');
            console.log('heelo im ahere2');
            res.redirect('/');
            
        }
    }
    catch(err){
         req.flash('error',err);
         return;
    };
}

module.exports.destroy = async function(req, res){
    comment=await Comment.findById(req.params.id);
        
    if(comment)
    {
            let userId = -1;
            post = await Post.findById(comment.post);
            
            userId=post.user;
            
            if(req.user.id==userId)
            {
                let postId=comment.post;
                await Like.deleteMany({
                    likeable:comment,
                    onModel:'Comment'
                });
                req.flash('success','Deleted successfully');
                comment.remove();

                await Post.findByIdAndUpdate(postId,{$pull: {comments:req.params.id}})
                return res.redirect('back');
                
            }
            else if(comment.user==req.user.id)
            {
                let postId=comment.post;
                await Like.deleteMany({
                    likeable:comment,
                    onModel:'Comment'
                });
                comment.remove();
                req.flash('success','Deleted successfully');
                await Post.findByIdAndUpdate(postId,{$pull: {comments:req.params.id}})
                return res.redirect('back');
                
            }
            else
            {
                return res.redirect('back');
            }
        
        
    }
    else{
        return res.redirect('back');
    }
    
}