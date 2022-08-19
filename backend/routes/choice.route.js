const express = require('express')
const {
    getChoice,
    getChoices,
    queryChoices,
    createChoice,
    deleteChoice,
    updateChoice
} = require('../controllers/choice.controller')
const { basicAuth, selfAuth } = require("../controllers/auth.controller")
const router = express.Router()

// GET all choices
router.get('/', getChoices)

// GET a queried list of choices
router.get('/query', queryChoices);

// GET a single choice
router.get('/choice/:id', getChoice)

// POST a new choice
router.post('/create', basicAuth, createChoice)

// DELETE a new choice
router.delete('/delete/:id', basicAuth, deleteChoice)

// UPDATE a new choice
router.patch('/update/:id', basicAuth, updateChoice)

module.exports = router