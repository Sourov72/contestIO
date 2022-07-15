const ContestModel = require('../models/contest.model')
const mongoose = require('mongoose')

// get all contests
const getContests = async (req, res) => {
    const contests = await ContestModel.find({}).sort({createdAt : -1})
    
    res.status(200).json(contests)
}

// get single contest
const getContest = async (req, res) => {
    const {id} = req.params 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No such contest'})
    }

    const contest = await ContestModel.findById(id)
    
    if (!contest) {
        return res.status(404).json({error : 'No such contest'})
    }
    res.status(200).json(contest)
}

// create new contest
const createContest = async (req, res) => {
    // get the values from the request's body
    const {contestID, hostID, title, type, objective} = req.body
    try {
        // try to create a new document
        const contest = await ContestModel.create({contestID, hostID, title, type, objective})
        res.status(200).json(contest)
    } catch (error) {
        // if failed, return error
        console.log(error.message)
        res.status(400).json({error : error.message})
    }
}

// delete a contest
const deleteContest = async (req, res) => {
    const {id} = req.params 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No such contest'})
    }

    const contest = await ContestModel.findByIdAndDelete(id)
    if (!contest) {
        return res.status(404).json({error : 'No such contest'})
    }
    res.status(200).json(contest)
}

// update a contest
const updateContest = async (req, res) => {
    const {id} = req.params 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No such contest'})
    }

    const contest = await ContestModel.findByIdAndUpdate(id, {
        ...req.body
    })

    if (!contest) {
        return res.status(404).json({error : 'No such contest'})
    }
    res.status(200).json(contest)
}

// export
module.exports = {
    getContest,
    getContests,
    createContest,
    deleteContest,
    updateContest
}