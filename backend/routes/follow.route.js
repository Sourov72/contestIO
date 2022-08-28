const express = require('express')
const {
    getFollowList,
    createFollow,
    unfollow,
    getNotification,
    getUserFollowList,
    isFollowed,
} = require('../controllers/follow.controller')
const router = express.Router()

//get if the user is following the contests
router.get('/',isFollowed);

router.get('/getNotification',getNotification);

router.post('/createFollow',createFollow);

router.delete('/unfollow',unfollow);

module.exports = router


