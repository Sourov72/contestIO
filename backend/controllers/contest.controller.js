const ContestModel = require("../models/contest.model");
const CategoryModel = require("../models/category.model");
const ParticipantModel = require("../models/participant.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// participant types
const ptype = {
  BLOCKED: 1 << 1,
  FOLLOWER: 1 << 2,
  VOTER: 1 << 3,
  JURY: 1 << 4,
  CONTESTANT: 1 << 5,
  HOST: 1 << 6,
};

function pt2v() {
  let retval = 0;
  for (let i = 0; i < arguments.length; i++) {
    retval ^= ptype[arguments[i].toUpperCase()];
  }
  return retval;
}

const isHost = async (userID, contestID) => {
  const participant = await ParticipantModel.find({
    userID: userID,
    contestID: contestID,
  });

  if (!participant) {
    return false;
  }
  if (participant.type & pt2v("host")) {
    return true;
  }
  return false;
};

const isParticipant = async (userID, contestID) => {
  const participant = await ParticipantModel.find({
    userID: userID,
    contestID: contestID,
  });

  if (!participant) {
    return false;
  }
  if (!(participant.type & pt2v("blocked"))) {
    return true;
  }
  return false;
};

// get all contests
const getContests = async (req, res) => {
  const nonPrivateQuery = {
    $or: [{ type: ["eq", "Public"] }, { type: ["eq", "Open"] }],
  };
  const privateQuery = {
    type: "Private",
  };
  let contests = "";
  const publicContests = await ContestModel.find(nonPrivateQuery);
  if (req.user) {
    // console.log("user is, ", req.user);
    const privateContests = await ContestModel.aggregate([
      {
        $match: privateQuery,
      },
      {
        $lookup: {
          from: "participants",
          localField: "_id",
          foreignField: "contestID",
          pipeline: [
            {
              $match: {
                userID: { $eq: ObjectId(req.user.userID) },
              },
            },
          ],
          as: "userData",
        },
      },
      {
        $match: {
          userData: { $exists: true, $size: 1 },
        },
      },
      {
        $project: {
          userData: 0,
        },
      },
    ]);
    contests = publicContests.concat(privateContests);
  } else {
    contests = publicContests;
  }

  // const contests = publicContests.concat(privateContests)
  contests.sort(function (a, b) {
    a["startTime"] > b["startTime"];
  });
  res.status(200).json(contests);
};

// get single contest
const getContest = async (req, res) => {
  const { id } = req.params;
  const contestID = id;
  // console.log('contest id received, ----------->', contestID)
  if (!mongoose.Types.ObjectId.isValid(contestID)) {
    console.log("no such contest");
    return res.status(404).json({ error: "No such contest" });
  }

  const contest = await ContestModel.findById(contestID);

  if (!contest) {
    console.log("nothing found");
    return res.status(404).json({ error: "No such contest" });
  }
  // console.log('contest info', contest)

  if (contest["type"] === "Private") {
    if (!req.user || (req.user && !isParticipant(req.user.userID, contestID))) {
      console.log("user cannot view this contest:", contestID);
      return res.status(400).json({
        message: "don't have sufficient permissions to view contest",
      });
    }
  }

  res.status(200).json(contest);
};

// get queried list of contests
const queryContests = async (req, res) => {
  var query = {};
  var limit = 20;
  var skip = 0;
  // console.log('req query', req.query)
  for (var key in req.query) {
    if (req.query[key] == "" || req.query[key] == {}) {
      continue;
    }
    var len = 1;
    if (typeof req.query[key] === "object") {
      len = req.query[key].length;
    } else {
      req.query[key] = [req.query[key]];
    }
    // console.log(key, req.query[key]);
    if (key != "limit" && key != "skip") query[key] = {};
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
  for (let key in query) {
    if (key.includes("ID")) {
      for (let key2 in query[key]) {
        query[key][key2] = mongoose.Types.ObjectId(query[key][key2]);
      }
    }
  }
  // console.log("query", query)
  // const contests = await ContestModel.find(query)
  //   .limit(limit)
  //   .skip(skip)
  //   .sort({ createdAt: -1 });
  const nonPrivateQuery = {
    $or: [{ type: ["eq", "Public"] }, { type: ["eq", "Open"] }],
  };
  const privateQuery = {
    type: "Private",
  };
  let contests = "";
  const publicContests = await ContestModel.find(nonPrivateQuery)
    .find(query)
    .skip(skip)
    .limit(limit);
  let count = await ContestModel.find(nonPrivateQuery).count(query);
  // console.log("count before, ", count)
  if (req.user) {
    // console.log("user is, ", req.user);
    const privateContests = await ContestModel.aggregate([
      {
        $match: privateQuery,
      },
      {
        $match: query,
      },
      {
        $lookup: {
          from: "participants",
          localField: "_id",
          foreignField: "contestID",
          pipeline: [
            {
              $match: {
                userID: { $eq: ObjectId(req.user.userID) },
              },
            },
          ],
          as: "userData",
        },
      },
      {
        $match: {
          userData: { $exists: true, $size: 1 },
        },
      },
      {
        $project: {
          userData: 0,
        },
      },
      {
        $facet: {
          stage1: [{ $group: { _id: null, count: { $sum: 1 } } }],
          stage2: [{ $skip: skip }, { $limit: limit }],
        },
      },

      
      {
        $project: {
          count: "$stage1.count",
          data: "$stage2",
        },
      },
      {
        $sort: {
          startTime: 1,
        }
      }
    ]);
    // console.log("private contests, ", privateContests[0].data);
    // contests = publicContests.concat(privateContests.data);
    // console.log('count/ inside', privateContests[0].count, privateContests[0].count.length === 0)
    contests = privateContests[0].data.concat(publicContests)
    count = parseInt(count)
    count += ((isNaN(privateContests[0].count) || privateContests[0].count.length === 0) ? 0 : parseInt(privateContests[0].count))
    // count += ;
  } else {
    contests = publicContests;
  }

  // const contests = publicContests.concat(privateContests)
  // contests = contests.sort(function (a, b) {
  //   a["createdAt"] > b["createdAt"];
  // });

  // console.log('count after', count)
  res.status(200).json({
    contests: contests,
    count: count,
  });
};

// create new contest
const createContest = async (req, res) => {
  // get the values from the request's body
  const {
    hostID,
    title,
    type,
    objective,
    description,
    voteWeight,
    juryVoteWeight,
    voterAnonymity,
    startTime,
    registrationEndTime,
    endTime,
    img,
  } = req.body;
  try {
    // try to create a new document
    const contest = await ContestModel.create({
      hostID,
      title,
      type,
      objective,
      description,
      voteWeight,
      juryVoteWeight,
      voterAnonymity,
      startTime,
      registrationEndTime,
      endTime,
      img,
    });
    res.status(200).json(contest);
  } catch (error) {
    // if failed, return error
    res.status(400).json({ error: error.message });
  }
};

// delete a contest
const deleteContest = async (req, res) => {
  const { id } = req.params;
  if (!isHost(req.user.userID, id)) {
    console.log("user [", req.user.email, "] cannot delete contest:", id);
    return res.status(400).json({
      message: "don't have sufficient permissions to delete contest",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such contest" });
  }

  const contest = await ContestModel.findByIdAndDelete(id);
  if (!contest) {
    return res.status(404).json({ error: "No such contest" });
  }
  res.status(200).json(contest);
};

// update a contest
const updateContest = async (req, res) => {
  const { id } = req.params;
  if (!isHost(req.user.userID, id)) {
    console.log("user [", req.user.email, "] cannot update contest:", id);
    return res.status(400).json({
      message: "don't have sufficient permissions to update contest",
    });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such contest" });
  }

  const contest = await ContestModel.findByIdAndUpdate(id, {
    ...req.body,
  });

  if (!contest) {
    return res.status(404).json({ error: "No such contest" });
  }
  res.status(200).json(contest);
};

const createCategory = async (req, res) => {
  // console.log("req bodh", req.body);
  const { contestID, title, description, maxvoteperUser, maxchoices } =
    req.body;
  if (!isHost(req.user.userID, contestID)) {
    // console.log(
    //   "user [",
    //   req.user.email,
    //   "] cannot create category of contest:",
    //   id
    // );
    return res.status(400).json({
      message: "don't have sufficient permissions to create contest category",
    });
  }
  // console.log("heheeeeeeeeeeee")
  try {
    const category = await CategoryModel.create({
      contestID,
      title,
      description,
      maxvoteperUser,
      maxchoices,
    });
    // console.log("created cateog", category);
    res.status(200).json({ category, msg: "added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getContestCategories = async (req, res) => {
  const { id } = req.params;

  if (!req.user || !isParticipant(req.user.userID, id)) {
    // console.log(
    //   "user [",
    //   req.user ? req.user.email : "",
    //   "] cannot access categories of contest:",
    //   id
    // );
    return res.status(400).json({
      message: "don't have sufficient permissions to view contest contents",
    });
  }

  CategoryModel.find({ contestID: id })
    .populate("contestID")
    .then((categories) => {
      // console.log("categories" + categories);
      res.json(categories);
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

const getContestvoterAnonymity = async (req, res) => {
  const { contestID } = req.query;

  const contest = await ContestModel.findById(contestID);

  if (!contest) {
    console.log("nothing found");
    return res.status(404).json({ error: "No such contest" });
  }

  // console.log("voter anonymity", contest.voterAnonymity)

  res.status(200).json(contest.voterAnonymity);
};

const newvoteradd = async (req, res) => {
  const { id } = req.params;
  // const var = req.body;
  // console.log("params", req.params);
  // console.log("list", req.body);

  var arrayLength = req.body.length;
  for (var i = 0; i < arrayLength; i++) {
    const userID = req.body[i];
    const contestID = id;
    const type = 8;
    // console.log(userID, contestID, type);
    // try {
    //   // try to create a new document
    //   const participant = await ParticipantModel.create({
    //     userID,
    //     contestID,
    //     type,
    //   });
    //   res.status(200).json({ participant, msg: "Voter Updated!" });
    // } catch (error) {
    //   // if failed, return error
    //   console.log("create participant error!", error);
    //   res.status(400).json({ error: error.message });
    // }
    //Do something

    const newvoter = new ParticipantModel({
      userID,
      contestID,
      type,
    });

    newvoter
      .save()
      .then(() => res.json({ msg: "Voter Updated!" }))
      .catch((err) => res.status(400).json("Error hello broth " + err));
  }

  // var.forEach(function (item, index) {

  // });

  // function myFunction(value) {

  //   // const { userID, contestID, type } = {value, cid, "8"};

  //   }
};

const aptype = ["BLOCKED", "FOLLOWER", "VOTER", "JURY", "CONTESTANT", "HOST"];

// module.exports = {createUser}

function participantValueToType(value) {
  let retval = [];
  for (let i = 0; i < 6; i++) {
    value & (1 << (i + 1)) && retval.push(aptype[i]);
  }
  return retval;
}

function getcontestfunc(contestID) {
  var contest = "";
  contest = ContestModel.findById(contestID);

  return contest;
}

// export
module.exports = {
  getContest,
  getContests,
  queryContests,
  createContest,
  deleteContest,
  updateContest,
  createCategory,
  getContestCategories,
  newvoteradd,
  participantValueToType,
  getcontestfunc,
  getContestvoterAnonymity,
};
