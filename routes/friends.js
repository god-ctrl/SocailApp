const express=require('express');
const router=express.Router();
const passport=require('passport');
const friendController = require('../controllers/friend_controller');

router.get('/friendRequest/',passport.checkAuthentication,friendController.sendRequest);
router.get('/acceptRequest/:id',passport.checkAuthentication,friendController.acceptRequest);

module.exports=router;