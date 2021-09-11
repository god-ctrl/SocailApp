const mongoose=require('mongoose');
const likeSchema=new mongoose.Schema({
    
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likeable:{
        type :mongoose.Schema.Types.ObjectId,
        required :true,
        refPath: 'onModel'
    },
    //include the ids of comments in an array

    onModel: {
        
            type:String,
            required: true,
            enum: ['Post','Comment']
        
        
    }
},{
    timestamps:true
});

const Like = mongoose.model('Like',likeSchema);
module.exports=Like;