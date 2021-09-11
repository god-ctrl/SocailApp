const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.toogleLike = async function (req,res) {
    try
    {
        // likes/to
        let likeable;
        let deleted = false; 
        if(req.query.type == 'Posts')
        {
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else
        {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

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
            return response.json(200,{
                message:"request successful",
                data:{
                    deleted:deleted
                }
            });
        }
    }
    catch(err) {
        console.log(err);
        return res.json(500,{
            message: 'Internal Server Error'
        });
    }
}