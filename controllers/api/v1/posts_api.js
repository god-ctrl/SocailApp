const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
module.exports.index= async function(req,res){
    let posts =await Post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate : {
            path: 'user'
        }
    });  
    return res.json(200,{
        message: "List of posts",
        posts: posts
    })
}

module.exports.destroy = async function(req,res){
    try{
        let post= await Post.findById(req.params.id);

        // if(post.user == req.user.id){
            post.remove();
            
            await Comment.deleteMany({post:req.params.id});
            // req.flash('success','Deleted successfully');
            
            return res.status(200).json({
                message: 'Deleted successfully'
            });
        
    
        
    }
    catch(err)
    {
        console.log(err);
       return res.json(500,{

            message: 'internal server error'
       });
    };
   
   
}
