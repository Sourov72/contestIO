const express = require('express')
const {
    getContest,
    getContests,
    createContest,
    deleteContest,
    updateContest
} = require('../controllers/contest.controller')
const { update } = require('../models/contest.model')


const router = express.Router()

// GET all contests
router.get('/', getContests)

// GET a single contest
router.get('/:id', getContest)

// POST a new contest
router.post('/', createContest)

// DELETE a new contest
router.delete('/:id', deleteContest)

// UPDATE a new contest
router.patch('/:id', updateContest)

module.exports = router