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
const { basicAuth, selfAuth } = require("../controllers/auth.controller")

// GET all participants
router.get('/', getParticipants)

// GET a queried list of participants
router.get('/query', basicAuth, queryParticipants);
router.get('/queryContests', basicAuth, queryContests);

// GET a single participant
router.get('/participant/:id', basicAuth, getParticipant)

// POST a new participant
router.post('/create', basicAuth, createParticipant)

// POST a new participant
router.post('/createAll', basicAuth, createParticipantsAll)

// DELETE a new participant
router.delete('/delete/:id', basicAuth, deleteParticipant)

// UPDATE a new participant
router.patch('/update/:id', basicAuth, updateParticipant)

module.exports = router