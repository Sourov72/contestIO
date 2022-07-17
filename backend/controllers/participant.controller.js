const ParticipantModel = require('../models/participant.model')
const mongoose = require('mongoose')

// get all participants
const getParticipants = async (req, res) => {
    const participants = await ParticipantModel.find({}).sort({createdAt : -1})
    
    res.status(200).json(participants)
}

// get single participant
const getParticipant = async (req, res) => {
    const {id} = req.params 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No such participant'})
    }

    const participant = await ParticipantModel.find(id)
    
    if (!participant) {
        return res.status(404).json({error : 'No such participant'})
    }
    res.status(200).json(participant)
}

// get queried list of participants
const queryParticipants = async (req, res) => {

    var query = {}
    var limit = 20
    var skip = 0
    for (var key in req.query) {
        if(req.query[key] == '') {
            continue
        }
        const arr = req.query[key].split(",")
        switch (arr[0]) {
            case "eq":
                query[key] = {$eq: arr[1]}
                break;
            case "lt":
                query[key] = {$lt: arr[1]}
                break;
            case "lte":
                query[key] = {$lte: arr[1]}
                break;
            case "gt":
                query[key] = {$gt: arr[1]}
                break;
            case "gte":
                query[key] = {$gte: arr[1]}
                break;
            case "regex":
                query[key] = {$regex: arr[1]}
                break;
            case "limit":
                limit = parseInt(arr[1])
                break;
            case "skip":
                skip = parseInt(arr[1])
                break;
        
            default:
                break;
        }
    }
    // console.log(query)
    const participants = await ParticipantModel.find(query).limit(limit).skip(skip)
    const cnt = await ParticipantModel.count(query)
    res.status(200).json({
        participants : participants,
        count : cnt
    })
}

// create new participant
const createParticipant = async (req, res) => {
    // get the values from the request's body
    const {userID, contestID, type} = req.body
    try {
        // try to create a new document
        const participant = await ParticipantModel.create({userID, contestID, type})
        res.status(200).json(participant)
    } catch (error) {
        // if failed, return error
        res.status(400).json({error : error.message})
    }
}

// delete a participant
const deleteParticipant = async (req, res) => {
    const {id} = req.params 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No such participant'})
    }

    const participant = await ParticipantModel.findByIdAndDelete(id)
    if (!participant) {
        return res.status(404).json({error : 'No such participant'})
    }
    res.status(200).json(participant)
}

// update a participant
const updateParticipant = async (req, res) => {
    const {id} = req.params 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No such participant'})
    }

    const participant = await ParticipantModel.findByIdAndUpdate(id, {
        ...req.body
    })

    if (!participant) {
        return res.status(404).json({error : 'No such participant'})
    }
    res.status(200).json(participant)
}

// export
module.exports = {
    getParticipant,
    getParticipants,
    queryParticipants,
    createParticipant,
    deleteParticipant,
    updateParticipant
}