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
} = require('../controllers/contest.controller')
const router = express.Router()
const { basicAuth, selfAuth } = require("../controllers/auth.controller")

// GET all contests
router.get('/', basicAuth, getContests)

// GET a queried list of contests
router.get('/query', basicAuth, queryContests);

// GET a single contest
router.get('/contest/:id', basicAuth, getContest)

// POST a new contest
router.post('/create', basicAuth, createContest)

router.post('/category', basicAuth, createCategory)

router.get('/getcatogory/:id', basicAuth, getContestCategories)

// DELETE a new contest
router.delete('/delete/:id', basicAuth, deleteContest)

// UPDATE a new contest
router.patch('/update/:id', basicAuth, updateContest)


module.exports = router