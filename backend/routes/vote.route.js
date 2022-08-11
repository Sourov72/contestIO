const express = require('express')
const {
    getVote,
    getVotes,
    queryVotes,
    createVote,
    deleteVote,
    updateVote
} = require('../controllers/vote.controller')


const router = express.Router()

// GET all votes
router.get('/', getVotes)

// GET a queried list of votes
router.get('/query', queryVotes);

// GET a single vote
router.get('/vote', getVote)

// POST a new vote
router.post('/create', createVote)

// DELETE a new vote
router.delete('/delete', deleteVote)

// UPDATE a new vote
router.patch('/update/:id', updateVote)

module.exports = router