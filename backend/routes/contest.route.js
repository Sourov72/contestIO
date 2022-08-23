const express = require('express')
const {
    getContest,
    getContests,
    queryContests,
    createContest,
    deleteContest,
    updateContest,
    createCategory,
    getContestCategories,
    getContestvoterAnonymity,
} = require('../controllers/contest.controller')
const router = express.Router()
const { basicAuth, selfAuth, optionalAuth } = require("../controllers/auth.controller")

// GET all contests
router.get('/', optionalAuth, getContests)

// GET a queried list of contests
router.get('/query', optionalAuth, queryContests);

// GET a single contest
router.get('/contest/:id', optionalAuth, getContest)

// POST a new contest
router.post('/create', basicAuth, createContest)

router.post('/category', basicAuth, createCategory)

router.get('/getcatogory/:id', optionalAuth, getContestCategories)

router.get('/getvoteranonymity', basicAuth, getContestvoterAnonymity)

// DELETE a new contest
router.delete('/delete/:id', basicAuth, deleteContest)

// UPDATE a new contest
router.patch('/update/:id', basicAuth, updateContest)


module.exports = router