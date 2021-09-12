const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.toogleLike = async function (req,res) {
    try
    {
        // likes/to
        let likeable;
        let deleted = false; 
        console.log(req.query.id);
        console.log(req.query.type);
        if(req.query.type == 'Post')
        {
            console.log('i am here')
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else
        {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }
        console.log(likeable);
        //check if a like already exists
        let existingLike =await Like.findOne({
            likeable: req.query.id,
            onModel:req.query.type,
            user:req.user._id
        });
        
        if(existingLike) {
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
            if(req.query.type=='Post')
            req.flash('success','you just disliked a post');
            else
            req.flash('success','you just disliked a comment');
            return res.redirect('back');
        }
        else
        {
            let newLike = await Like.create({
                user:req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            
            likeable.likes.push(newLike);
            likeable.save();
            if(req.query.type=='Post')
            req.flash('success','you just liked a post');
            else
            req.flash('success','you just liked a comment');
      
            return res.redirect('back');
        }
    }
    catch(err) {
        console.log(err);
        return res.json(500,{
            message: 'Internal Server Error'
        });
    }
}