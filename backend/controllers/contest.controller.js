const ContestModel = require("../models/contest.model");
const CategoryModel = require("../models/category.modal");
const ParticipantModel = require("../models/participant.model");
const mongoose = require("mongoose");

// get all contests
const getContests = async (req, res) => {
  const contests = await ContestModel.find({}).sort({ createdAt: -1 });

  res.status(200).json(contests);
};

// get single contest
const getContest = async (req, res) => {
  const { id } = req.params;
  console.log("id ", id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such contest" });
  }

  const contest = await ContestModel.find({ _id: id });
  // console.log("contest info",contest)

  if (!contest) {
    return res.status(404).json({ error: "No such contest" });
  }

  res.status(200).json(contest);
};

// get queried list of contests
const queryContests = async (req, res) => {
  var query = {};
  var limit = 20;
  var skip = 0;
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
  // console.log(query)
  const contests = await ContestModel.find(query).limit(limit).skip(skip);
  const cnt = await ContestModel.count(query);
  res.status(200).json({
    contests: contests,
    count: cnt,
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
  console.log("create category", req.body);
  const { contestID, title, description, maxvoteperUser, maxchoices } =
    req.body;
  try {
    const category = await CategoryModel.create({
      contestID,
      title,
      description,
      maxvoteperUser,
      maxchoices,
    });
    res.status(200).json({ category, msg: "added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getContestCategories = async (req, res) => {
  console.log("get categories", req.params);

  const { id } = req.params;

  CategoryModel.find({ contestID: id })
    .populate("contestID")
    .then((categories) => {
      console.log("categories" + categories);
      res.json(categories);
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

const newvoteradd = async (req, res) => {
  const { id } = req.params;
  // const var = req.body;
  console.log("params", req.params);
  console.log("list", req.body);

  var arrayLength = req.body.length;
  for (var i = 0; i < arrayLength; i++) {
    const userID = req.body[i];
    const contestID = id;
    const type = 8;
    console.log(userID, contestID, type)
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
    .then(() =>  res.json({msg: "Voter Updated!" }))
    .catch((err) => res.status(400).json("Error hello broth " + err));
  }

  // var.forEach(function (item, index) {

  // });

  // function myFunction(value) {

  //   // const { userID, contestID, type } = {value, cid, "8"};

  //   }
};

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
};
