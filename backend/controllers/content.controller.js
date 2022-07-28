const ContentModel = require('../models/content.model')
const mongoose = require('mongoose')

// get all contents
const getContents = async (req, res) => {  
    const contents = await ContentModel.find({}).sort({createdAt : -1})
    
    res.status(200).json(contents)
}

// get single content
const getContent = async (req, res) => {
    const {id} = req.params 
    console.log("id ", id);
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No such content'})
    }

    const content = await ContentModel.find({ _id: id })
    // console.log("content info",content)
    
    if (!content) {
        return res.status(404).json({error : 'No such content'})
    }
    
    res.status(200).json(content)
}

// get queried list of contents
const queryContents = async (req, res) => {

    var query = {}
    var limit = 20
    var skip = 0
    for (var key in req.query) {
        if (req.query[key] == "") {
          continue;
        }
        var len = 1
        if( typeof(req.query[key]) === "object") {
            len = req.query[key].length
        }
        else {
            req.query[key] = [req.query[key]]
        }
        console.log(req.query[key]);
        query[key] = {}
        for(let i = 0; i < len; i++) {
            const arr = req.query[key][i].split(",");
            if(arr[1] === '') {
                continue;
            }
            switch (arr[0]) {
              case "eq":
                query[key]['$eq'] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1])
                break;
              case "lt":
                query[key]['$lt'] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1])
                break;
              case "lte":
                query[key]['$lte'] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1])
                break;
              case "gt":
                query[key]['$gt'] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1])
                break;
              case "gte":
                query[key]['$gte'] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1])
                break;
              case "regex":
                query[key] = {'$regex' : isNaN(arr[1]) ? arr[1] : parseInt(arr[1]), '$options' : 'i'}
                break;
              case "limit":
                limit = parseInt(arr[1]);
                break;
              case "skip":
                skip = parseInt(arr[1]);
                break;
        
              default:
                break;
            }
        }
      }
    // console.log(query)
    const contents = await ContentModel.find(query).limit(limit).skip(skip)
    const cnt = await ContentModel.count(query)
    res.status(200).json({
        contents : contents,
        count : cnt
    })
}

// create new content
const createContent = async (req, res) => {
    // get the values from the request's body
    const {participantID, type, title, description, link} = req.body
    try {
        // try to create a new document
        const content = await ContentModel.create({participantID, type, title, description, link})
        res.status(200).json(content)
    } catch (error) {
        // if failed, return error
        res.status(400).json({error : error.message})
    }
}

// delete a content
const deleteContent = async (req, res) => {
    const {id} = req.params 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No such content'})
    }

    const content = await ContentModel.findByIdAndDelete(id)
    if (!content) {
        return res.status(404).json({error : 'No such content'})
    }
    res.status(200).json(content)
}

// update a content
const updateContent = async (req, res) => {
    const {id} = req.params 
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No such content'})
    }

    const content = await ContentModel.findByIdAndUpdate(id, {
        ...req.body
    })

    if (!content) {
        return res.status(404).json({error : 'No such content'})
    }
    res.status(200).json(content)
}

// export
module.exports = {
    getContent,
    getContents,
    queryContents,
    createContent,
    deleteContent,
    updateContent
}
