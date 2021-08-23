const express=require('express');
const router =express.Router();
router.use(express.urlencoded({ extended: true }));
const homeController = require('../controllers/home_controller');

console.log('router started');
router.get('/',homeController.home);

 



router.use('/users',require('./users'));

router.use('/posts',require('./posts'));

router.use('/comments',require('./comments'));
//for any further routes,access from here
//router.use('/routerName',require('./routerFile));
router.use('/editor',require('./editor'));

router.use('/api',require('./api'));
module.exports = router;
