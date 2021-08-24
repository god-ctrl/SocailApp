const express=require('express');
const router =express.Router();
// router.use('/v1',require('./v1'));
const usersApi = require('../../../controllers/api/v1/users_api');
router.post('/create-session',usersApi.createSession);

module.exports = router;