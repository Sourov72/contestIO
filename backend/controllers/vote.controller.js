const VoteModel = require("../models/vote.model");
const mongoose = require("mongoose");


// get all votes
const getVotes = async (req, res) => {
  const votes = await VoteModel.find({}).sort({ createdAt: -1 });

  res.status(200).json(votes);
};

// get single vote
const getVote = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such vote" });
  }

  const vote = await VoteModel.find(id);

  if (!vote) {
    return res.status(404).json({ error: "No such vote" });
  }
  res.status(200).json(vote);
};

// get queried list of votes
const queryVotes = async (req, res) => {
  var query = {};
  var limit = 20;
  var skip = 0;
//   console.log('req. query:', req.query)
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
          case "bitsAnySet":
            query[key]['$bitsAnySet'] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1])
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
   
  console.log('query: ',query);

  const votes = await VoteModel.find(query).limit(limit).skip(skip)

  res.status(200).json({
    votes: votes,
    count: votes.length,
  });
};

// create new vote
const createVote = async (req, res) => {
  // get the values from the request's body
  const { categoryID, contestID, contentID } = req.body;
  try {
    // try to create a new document
    const vote = await VoteModel.create({
        categoryID,
        contestID,
        contentID
    });
    res.status(200).json(vote);
  } catch (error) {
    // if failed, return error
    console.log("create vote error!", error);
    res.status(400).json({ error: error.message });
  }
};

// delete a vote
const deleteVote = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such vote" });
  }

  const vote = await VoteModel.findByIdAndDelete(id);
  if (!vote) {
    return res.status(404).json({ error: "No such vote" });
  }
  res.status(200).json(vote);
};

// update a vote
const updateVote = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such vote" });
  }

  const vote = await VoteModel.findByIdAndUpdate(id, {
    ...req.body,
  });

  if (!vote) {
    return res.status(404).json({ error: "No such vote" });
  }
  res.status(200).json(vote);
};

// export
module.exports = {
  getVote,
  getVotes,
  queryVotes,
  createVote,
  deleteVote,
  updateVote,
};
