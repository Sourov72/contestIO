const express = require('express')
const {
    getContent,
    getContents,
    queryContents,
    createContent,
    deleteContent,
    updateContent,
    getallContent,
    getuserContent,
} = require('../controllers/content.controller')
const { basicAuth, selfAuth } = require("../controllers/auth.controller")
const router = express.Router()

// GET all contents
router.get('/', getContents)

// GET a queried list of contents
router.get('/query', queryContents);

// GET a single content
router.get('/content/:id', getContent)


// POST a new content
router.post('/create', basicAuth, createContent)

router.get('/getallcontent', getallContent)

router.post('/getusercontent', getuserContent)

// DELETE a new content
router.delete('/delete', basicAuth, deleteContent)

// UPDATE a new content
router.patch('/update/:id', basicAuth, updateContent)

module.exports = router