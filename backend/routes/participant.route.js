const express = require('express')
const {
    getParticipant,
    getParticipants,
    queryParticipants,
    queryContests,
    createParticipant,
    createParticipantsAll,
    deleteParticipant,
    updateParticipant,
    blockuser,
} = require('../controllers/participant.controller')
const router = express.Router()
const { basicAuth, selfAuth, optionalAuth } = require("../controllers/auth.controller")

// GET all participants
router.get('/', optionalAuth, getParticipants)

// GET a queried list of participants
router.get('/query', optionalAuth, queryParticipants);
router.get('/queryContests', optionalAuth, queryContests);

// GET a single participant
router.get('/getparticipant', optionalAuth, getParticipant)

// POST a new participant
router.post('/create', basicAuth, createParticipant)

router.post('/blockuser', basicAuth, blockuser)

// POST a new participant
router.post('/createAll', basicAuth, createParticipantsAll)

// DELETE a new participant
router.delete('/delete', basicAuth, deleteParticipant)

// UPDATE a new participant
router.patch('/update/:id', basicAuth, updateParticipant)

module.exports = router