const express=require('express');

const port=8000;
const app=express();


//use express router
app.use('/',require('./routes'));
//set up the view engine
app.set('view engine','ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.listen(port,function(err){
    if(err)
    {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`server is running on port: ${port}`);
});

//abhi kuch implement nhi kra? nai sir net bass ek post request bhejke koi bhi  info render karne ke lia kaha
//acha theek h!