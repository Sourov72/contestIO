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
    console.log("id ", id);
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No such contest'})
    }

    const contest = await ContestModel.find({ _id: id })
    // console.log("contest info",contest)
    
    if (!contest) {
        return res.status(404).json({error : 'No such contest'})
    }
    
    res.status(200).json(contest)
}

// get queried list of contests
const queryContests = async (req, res) => {

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
    const contests = await ContestModel.find(query).limit(limit).skip(skip)
    const cnt = await ContestModel.count(query)
    res.status(200).json({
        contests : contests,
        count : cnt
    })
}

// create new contest
const createContest = async (req, res) => {
    // get the values from the request's body
    const {hostID, title, type, objective, description, voteWeight, juryVoteWeight, voterAnonymity, startTime, registrationEndTime, endTime} = req.body
    try {
        // try to create a new document
        const contest = await ContestModel.create({ hostID, title, type, objective, description, voteWeight, juryVoteWeight, voterAnonymity, startTime, registrationEndTime, endTime})
        console.log('thik moto hoise', contest)
        res.status(200).json(contest)
    } catch (error) {
        // if failed, return error
        console.log('create contest pera', error.message)
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
    queryContests,
    createContest,
    deleteContest,
    updateContest
}