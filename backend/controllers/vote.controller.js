const VoteModel = require("../models/vote.model");
const contestmod = require("../controllers/contest.controller");
const participantmod = require("../controllers/participant.controller");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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

  //  get the values from the request's body
  const { userID, contestID, choiceID, categoryID } = req.query;

  var participantID = "",
    participant = "";

  participant = await participantmod.getParticipantfunc(userID, contestID);
  if (!participant) {
    return res.send({ message: "No such paraaaaaaaaaaticipant found" });
  }
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
    // console.log(req.query[key]);
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

  // console.log("query: ", query);

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
  // console.log("from participant func", participant._id);

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
    // console.log("create vote error!", error);
    res.status(400).json({ error: error.message });
  }
};

// delete a vote
const deleteVote = async (req, res) => {
  // const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(404).json({ error: "No such vote" });
  // }

  // console.log("delete vote res body", req.body);

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

const getContentVoters = async (req, res) => {
  // console.log("req", req)
  const { choiceID } = req.query;

  // console.log("choiceID in content", choiceID);

  const participants = await VoteModel.aggregate([
    {
      $lookup: {
        from: "participants",
        localField: "participantID",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "userID",
              foreignField: "_id",
              as: "userData",
            },
          },
          {
            $project: {
              username: "$userData.username",
              userID: "$userData._id",
              img: "$userData.img",
            },
          },
        ],
        as: "participantData",
      },
    },
    {
      $match: {
        choiceID: ObjectId(choiceID),
      },
    },
    {
      $project: {
        username: "$participantData.username",
        id: "$participantData.userID",
        img: "$participantData.img",
      },
    },
  ]);

  // console.log("participants", participants[0].username[0][0]);

  // console.log("Length", Object.keys(participants).length)

  res.json(participants);
};

const getResults = async (req, res) => {
  const { id } = req.params;

  console.log("Category Id", id);

  const voters = await VoteModel.aggregate([
    {
      $lookup: {
        from: "choices",
        localField: "choiceID",
        foreignField: "_id",
        pipeline: [
          {
            $match: {
              categoryID: ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "contents",
              localField: "contentID",
              foreignField: "_id",
              pipeline: [
                {
                  $lookup: {
                    from: "participants",
                    localField: "participantID",
                    foreignField: "_id",
                    pipeline: [
                      {
                        $lookup: {
                          from: "users",
                          localField: "userID",
                          foreignField: "_id",
                          as: "userData",
                        },
                      },
                      {
                        $lookup: {
                          from: "contests",
                          localField: "contestID",
                          foreignField: "_id",
                          as: "contestData",
                        },
                      },
                      {
                        $unwind: "$userData",
                      },
                      {
                        $unwind: "$contestData",
                      },
                      {
                        $project: {
                          username: "$userData.username",
                          userID: "$userData._id",
                          img: "$userData.img",
                          voteWeight: "$contestData.voteWeight",
                          juryVoteWeight: "$contestData.juryVoteWeight",
                          type: 1,
                        },
                      },
                    ],

                    as: "participantData",
                  },
                },

                {
                  $unwind: "$participantData",
                },

                {
                  $project: {
                    username: "$participantData.username",
                    userid: "$participantData.userID",
                    userimg: "$participantData.img",
                    usertype: "$participantData.type",
                    link: "$link",
                    contentid : "$_id",
                    title : "$title",
                    description : "$description",
                    voteWeight: "$participantData.voteWeight",
                    juryVoteWeight: "$participantData.juryVoteWeight",
                  },
                },
              ],
              as: "contentData",
            },
          },

          {
            $unwind: "$contentData",
          },

          {
            $project: {
              link: "$contentData.link",
              contentid : "$contentData.contentid",
              title : "$contentData.title",
              description : "$contentData.description",
              username: "$contentData.username",
              userid: "$contentData.userid",
              userimg: "$contentData.userimg",
              usertype: "$contentData.usertype",
              voteWeight: "$contentData.voteWeight",
              juryVoteWeight: "$contentData.juryVoteWeight",
            },
          },
        ],
        as: "VoterData",
      },
    },

    {
      $lookup: {
        from: "participants",
        localField: "participantID",
        foreignField: "_id",
        as: "blabla",
      },
    },

    {
      $match: {
        categoryID: ObjectId(id),
      },
    },

    {
      $unwind: "$VoterData",
    },
    {
      $unwind: "$blabla",
    },

    // {
    //   $project: {
    //     usertype: "$VoterData.usertype",
    //     voteWeight: "$VoterData.voteWeight",
    //     juryVoteWeight: "$VoterData.juryVoteWeight",
    //     username: "$VoterData.username",
    //     type: "$blabla.type",
    //   },
    // },

    {
      $group: {
        _id: "$choiceID",
        link: { $addToSet: "$VoterData.link" },
        contentid : {$addToSet: "$VoterData.contentid"},
        title : {$addToSet: "$VoterData.title"},
        description : {$addToSet: "$VoterData.description"},
        userid: { $addToSet: "$VoterData.userid" },
        username: { $addToSet: "$VoterData.username" },
        usertype: { $addToSet: "$VoterData.usertype" },
        userimg: { $addToSet: "$VoterData.userimg" },
        voteWeight: { $addToSet: "$VoterData.voteWeight" },
        juryVoteWeight: { $addToSet: "$VoterData.juryVoteWeight" },

        totalVote: {
          $sum: {
            $cond: [
              { $eq: ["$blabla.type", 20] },
              "$VoterData.juryVoteWeight",
              "$VoterData.voteWeight",
            ],
          },
        },
        votertype: { $addToSet: "$blabla.type" },
        votercount: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalVote: -1,
      },
    },

  ]);

  console.log("voters");

  res.json(voters);
};

// export
module.exports = {
  getVote,
  getVotes,
  queryVotes,
  createVote,
  deleteVote,
  updateVote,
  getContentVoters,
  getResults,
  // deletevotefunc,
  // deletevotechoicefunc,
};
