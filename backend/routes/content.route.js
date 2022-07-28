const express = require('express')
const {
    getContent,
    getContents,
    queryContents,
    createContent,
    deleteContent,
    updateContent
} = require('../controllers/content.controller')


const router = express.Router()

// GET all contents
router.get('/', getContents)

// GET a queried list of contents
router.get('/query', queryContents);

// GET a single content
router.get('/content/:id', getContent)

// POST a new content
router.post('/create', createContent)

// DELETE a new content
router.delete('/delete/:id', deleteContent)

// UPDATE a new content
router.patch('/update/:id', updateContent)

module.exports = router