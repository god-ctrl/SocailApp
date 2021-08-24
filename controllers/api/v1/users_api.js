const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession= async function(req,res){
    try{
        let user = await User.findOne({email: req.body.email});
        if( !user || (user.password != req.body.password)) {
            // console.log(user);
            console.log(user.password);
            console.log(req.body.password);
            return res.json(422,{
                
                message: "Invalid username or password:P"
            });
        }
        return res.json(200,{
            message: 'Sign in successful,token provided keep it safe',
            data :{
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '10000'})
            }
        });
    }
    catch(err)
    {
        console.log('Error in jwt authentication: ',err);
        return res.json(500,{
            message: 'internal server error'
        });
    }
}