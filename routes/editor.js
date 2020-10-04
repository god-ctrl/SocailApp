const express=require('express');
const router=express.Router();
const editController=require('../controllers/editor_controller');
router.get('/edit',editController.edit);
module.exports=router;
