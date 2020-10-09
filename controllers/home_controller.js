
module.exports.home=function(req,res){
   
        console.log(req.cookies);
        // res.cookie('user_id',25);
        //res.cookie('p',23);
        return res.render('home',{
            title: "Codecial"
        });
    
}