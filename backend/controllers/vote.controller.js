const VoteModel = require("../models/vote.model");
const contestmod = require("../controllers/contest.controller");
const participantmod = require("../controllers/participant.controller");
const mongoose = require("mongoose");

const aptype = ["BLOCKED", "FOLLOWER", "VOTER", "JURY", "CONTESTANT", "HOST"];

// get all votes
const getVotes = async (req, res) => {
  const votes = await VoteModel.find({}).sort({ createdAt: -1 });

  res.status(200).json(votes);
};

// get single vote
const getVote = async (req, res) => {
  // const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(404).json({ error: "No such vote" });
  // }

  // console.log("get vote res body", req.query);

  // // get the values from the request's body
  const { userID, contestID, choiceID, categoryID } = req.query;

  var participantID = "",
    participant = "";

  participant = await participantmod.getParticipantfunc(userID, contestID);
  // console.log("from participant func", participant);

  participantID = participant._id;

  const vote = await VoteModel.findOne({
    participantID: participantID,
    choiceID: choiceID,
    categoryID: categoryID,
  });

  if (!vote) {
    return res.send({ message: "No such vote" });
  }
  res.send({ message: "vote found", vote: vote });
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
    var len = 1;
    if (typeof req.query[key] === "object") {
      len = req.query[key].length;
    } else {
      req.query[key] = [req.query[key]];
    }
    console.log(req.query[key]);
    query[key] = {};
    for (let i = 0; i < len; i++) {
      const arr = req.query[key][i].split(",");
      if (arr[1] === "") {
        continue;
      }
      switch (arr[0]) {
        case "eq":
          query[key]["$eq"] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1]);
          break;
        case "lt":
          query[key]["$lt"] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1]);
          break;
        case "lte":
          query[key]["$lte"] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1]);
          break;
        case "gt":
          query[key]["$gt"] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1]);
          break;
        case "gte":
          query[key]["$gte"] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1]);
          break;
        case "bitsAnySet":
          query[key]["$bitsAnySet"] = isNaN(arr[1]) ? arr[1] : parseInt(arr[1]);
          break;
        case "regex":
          query[key] = {
            $regex: isNaN(arr[1]) ? arr[1] : parseInt(arr[1]),
            $options: "i",
          };
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

  console.log("query: ", query);

  const votes = await VoteModel.find(query).limit(limit).skip(skip);

  res.status(200).json({
    votes: votes,
    count: votes.length,
  });
};

// create new vote
const createVote = async (req, res) => {
  // console.log("create vote res body", req.body);

  // get the values from the request's body
  const { userID, contestID, choiceID, categoryID } = req.body;

  var value = 0,
    weight = 0,
    contest = "",
    participantID = "",
    participant;

  participant = await participantmod.getParticipantfunc(userID, contestID);
  console.log("from participant func", participant);

  participantID = participant._id;
  value = participant.type;

  let retval = await contestmod.participantValueToType(value);
  var contest = await contestmod.getcontestfunc(contestID);

  // console.log("from functionnnnnnnnnnnnnnnnnnnnnnnnnnnnn", contest);

  if (retval.includes("JURY")) {
    // console.log("jury voter");
    weight = contest.juryVoteWeight;
  }
  if (retval.includes("VOTER")) {
    // console.log("normal voter");
    weight = contest.voteWeight;
  }

  try {
    // try to create a new document
    const vote = await VoteModel.create({
      participantID,
      choiceID,
      categoryID,
      weight,
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
  // const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(404).json({ error: "No such vote" });
  // }

  console.log("delete vote res body", req.body);

  // get the values from the request's body
  const { userID, contestID, choiceID, categoryID } = req.body;

  var participantID = "",
    participant = "";

  participant = await participantmod.getParticipantfunc(userID, contestID);
  // console.log("from participant func", participant);

  participantID = participant._id;

  const vote = await VoteModel.deleteOne({
    participantID: participantID,
    choiceID: choiceID,
    categoryID: categoryID,
  });
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
