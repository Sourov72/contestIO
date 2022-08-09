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
    newvoteradd,
} = require('../controllers/contest.controller')


const router = express.Router()

// GET all contests
router.get('/', getContests)

// GET a queried list of contests
router.get('/query', queryContests);

// GET a single contest
router.get('/contest/:id', getContest)

// POST a new contest
router.post('/create', createContest)

router.post('/category', createCategory)

router.get('/getcatogory/:id', getContestCategories)

// DELETE a new contest
router.delete('/delete/:id', deleteContest)

// UPDATE a new contest
router.patch('/update/:id', updateContest)

router.post('/voteradd/:id', newvoteradd)

module.exports = router