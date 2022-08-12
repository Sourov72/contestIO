const express = require('express')
const {
    getParticipant,
    getParticipants,
    queryParticipants,
    queryContests,
    createParticipant,
    createParticipantsAll,
    deleteParticipant,
    updateParticipant
} = require('../controllers/participant.controller')


const router = express.Router()

// GET all participants
router.get('/', getParticipants)

// GET a queried list of participants
router.get('/query', queryParticipants);
router.get('/queryContests', queryContests);

// GET a single participant
router.get('/getparticipant', getParticipant)

// POST a new participant
router.post('/create', createParticipant)

// POST a new participant
router.post('/createAll', createParticipantsAll)

// DELETE a new participant
router.delete('/delete', deleteParticipant)

// UPDATE a new participant
router.patch('/update/:id', updateParticipant)

module.exports = router