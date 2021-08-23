const express=require('express');
const router =express.Router();
// router.use('/v1',require('./v1'));
const postsApi = require('../../../controllers/api/v1/posts_api');
router.get('/',postsApi.index);
module.exports = router;