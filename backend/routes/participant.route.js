const express = require('express')
const {
    getParticipant,
    getParticipants,
    queryParticipants,
    createParticipant,
    deleteParticipant,
    updateParticipant
} = require('../controllers/participant.controller')


const router = express.Router()

// GET all participants
router.get('/', getParticipants)

// GET a queried list of participants
router.get('/query', queryParticipants);

// GET a single participant
router.get('/participant/:id', getParticipant)

// POST a new participant
router.post('/create', createParticipant)

// DELETE a new participant
router.delete('/delete/:id', deleteParticipant)

// UPDATE a new participant
router.patch('/update/:id', updateParticipant)

module.exports = router