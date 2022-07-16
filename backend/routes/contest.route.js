const express = require('express')
const {
    getContest,
    getContests,
    queryContests,
    createContest,
    deleteContest,
    updateContest
} = require('../controllers/contest.controller')
const { update } = require('../models/contest.model')


const router = express.Router()

// GET all contests
router.get('/', getContests)

// GET a queried list of contests
router.get('/query', queryContests);

// GET a single contest
router.get('/contest/:id', getContest)

// POST a new contest
router.post('/create', createContest)

// DELETE a new contest
router.delete('/delete/:id', deleteContest)

// UPDATE a new contest
router.patch('/update/:id', updateContest)

module.exports = router