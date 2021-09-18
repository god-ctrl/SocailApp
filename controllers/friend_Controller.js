const User = require('../models/user');
const Friendship = require("../models/friendship");
module.exports.sendRequest = async function (req,res) {
    try
    {
        if(req.user._id==req.query.id)
        {
            req.flash('error','invalid request');
            return res.redirect('back');
        }
        let check=0;
        for(j of req.user.friends)
        {
            if(j==req.query.id)
            {
                check=1;
            }
        }
        if(check>0)
        {
            req.flash('error','you are already a friend');
            return res.redirect('back');
        }
        // console.log()
        let friendship= await Friendship.findOne({
            from_user: req.user._id,
            to_user: req.query.id

        });
        console.log(friendship);
        if(friendship)
        {
            req.flash('error','you have already send him a req');
            return res.redirect('back');
        }
        let friendship2= await Friendship.findOne({
            from_user: req.query.id,
            to_user: req.user._id

        });
        if(friendship2)
        {
            req.flash('error','he has send you a request just accept it');
            return res.redirect('back');
        }
        await Friendship.create({
            from_user: req.user._id,
            to_user: req.query.id
        })
        
        req.flash('success','request send');
        return res.redirect('back');
        
    }
    catch(err) {
        console.log(err);
        return res.json(500,{
            message: 'Internal Server Error'
        });
    }
}
module.exports.acceptRequest= async function(req,res){
    let newFriendUser = await User.findById(req.params.id);
    // console.log(newFriendUser);
    console.log(req.params.id);
    console.log(newFriendUser);
    let friendShip=await Friendship.findOne({
        from_user: newFriendUser,
        to_user: req.user
    });
    if(friendShip){
        await Friendship.deleteOne(friendShip);
        await newFriendUser.friends.push(req.user);
        await req.user.friends.push(newFriendUser);
        newFriendUser.save();
        req.user.save();
    }
   
    
    return res.redirect('back');
}