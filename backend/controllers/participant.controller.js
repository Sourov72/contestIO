const ParticipantModel = require("../models/participant.model");
const userModel = require("../models/user.model");
// const votemod = require("../controllers/vote.controller");
// const contentmod = require("../controllers/content.controller")
const deletemod = require("../controllers/delete.controller");
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

// get all participants
const getParticipants = async (req, res) => {
  const participants = await ParticipantModel.find({}).sort({ createdAt: -1 });

  res.status(200).json(participants);
};

// get single participant
const getParticipant = async (req, res) => {
  // const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(404).json({ error: "No such participant" });
  // }
  console.log("req query", req.query);
  const { userID, contestID } = req.query;

  console.log("userid", userID, "contestid", contestID);
  const participant = await ParticipantModel.findOne({
    userID: ObjectId(userID),
    contestID: ObjectId(contestID),
  });

  if (!participant) {
    return res.status(404).json({ error: "No such participant" });
  }
  res.status(200).json(participant);
};

// get all contests for this user
const queryContests = async (req, res) => {
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
  // convert keys with trailing 'ID' to ObjectID
  for (let key in query) {
    if (key.includes("ID")) {
      for (let key2 in query[key]) {
        query[key][key2] = mongoose.Types.ObjectId(query[key][key2]);
      }
    }
  }
  // console.log(query)
  const contests = await ParticipantModel.find(query).skip(skip).limit(limit).populate("contestID");
  const cnt = await ParticipantModel.count(query);
  // console.log("contests: ", contests);
  res.status(200).json({ 
    contests: contests,
    count: cnt,
  });
};

// get queried list of participants
const queryParticipants = async (req, res) => {
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
  // convert keys with trailing 'ID' to ObjectID
  for (let key in query) {
    if (key.includes("ID")) {
      for (let key2 in query[key]) {
        query[key][key2] = mongoose.Types.ObjectId(query[key][key2]);
      }
    }
  }
  console.log("query: ", query);
  const participants = await ParticipantModel.aggregate([
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
        // userID: {
        //   $toString: "$userID",
        // },
        // contestID: {
        //   $toString: "$contestID",
        // },
        userID: 1,
        contestID: 1,
        type: 1,
        username: "$userData.username",
        email: "$userData.email",
      },
    },
    {
      $match: query,
    },
  ]);
  // const cnt = await ParticipantModel.count(query);
  console.log("participants, ", participants);
  res.status(200).json({
    participants: participants,
    count: participants.length,
  });
};

// create new participant
const createParticipant = async (req, res) => {
  // get the values from the request's body
  const { userID, contestID, type } = req.body;
  try {
    // try to create a new document
    const participant = await ParticipantModel.create({
      userID,
      contestID,
      type,
    });
    res.status(200).json(participant);
    console.log("participant ------------->", participant);
  } catch (error) {
    // if failed, return error
    console.log("create participant error!", error);
    res.status(400).json({ error: error.message });
  }
};

// create new participant
const createParticipantsAll = async (req, res) => {
  // get the values from the request's body
  const { contestant, voter, jury, contestID } = req.body;
  var diagnostics = {
    total: 0,
    success: 0,
    duplicate: 0,
  };
  function a(dic) {
    diagnostics.total += dic.total;
    diagnostics.success += dic.success;
    diagnostics.duplicate += dic.duplicate;
  }

  a(
    await createParticipants(
      contestant,
      contestID,
      pt2v("contestant", "voter", "follower")
    )
  );
  a(await createParticipants(voter, contestID, pt2v("voter", "follower")));
  a(await createParticipants(jury, contestID, pt2v("jury", "follower")));
  console.log("diagnostics:", diagnostics);
  res.status(200).json(diagnostics);
};

const createParticipants = async (list, contestID, type) => {
  var res = {
    total: 0,
    success: 0,
    duplicate: 0,
  };

  // console.log("list", list)

  for (let i = 0; i < list.length; i++) {
    res.total += 1;
    const user = await userModel.find({ email: list[i].toLowerCase() });
    if (!user) {
      // console.log("no user found for", list[i]);
      continue;
    }
    // console.log("USEREERERER",user)
    // console.log(user[0]._id)
    let userID = user[0]._id;
    const participant = await ParticipantModel.find({
      userID: userID,
      contestID: contestID,
    });
    if (participant.length > 0) {
      console.log(
        "duplicate found for",
        list[i],
        "already exists entry:",
        participant
      );
      res.duplicate += 1;
      continue;
    }

    try {
      // try to create a new document
      await ParticipantModel.create({
        userID: userID,
        contestID: contestID,
        type: type,
      });
      res.success += 1;
    } catch (error) {
      console.log(
        "create participant error for email: ",
        list[i],
        "error: ",
        error
      );
    }
  }

  return res;
};

// delete a participant
const deleteParticipant = async (req, res) => {
  // const { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(404).json({ error: "No such participant" });
  // }
  console.log("req body in delete parti", req.body);
  const { userID, contestID } = req.body;

  const participant = await ParticipantModel.find({
    userID: ObjectId(userID),
    contestID: ObjectId(contestID),
  });

  console.log("participant delete", participant);
  if (participant) await deletemod.deletecontentfunc(participant[0]._id);

  const participantdeleted = await ParticipantModel.deleteOne({
    userID: ObjectId(userID),
    contestID: ObjectId(contestID),
  });
  if (!participantdeleted) {
    return res.status(404).json({ error: "No such participant" });
  }

  // await contentmod.deletecontentfunc(participant._id);
  // await votemod.deletevotefunc(participant._id)

  res.status(200).json(participantdeleted);
};

// update a participant
const updateParticipant = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such participant" });
  }

  const participant = await ParticipantModel.findByIdAndUpdate(id, {
    ...req.body,
  });

  if (!participant) {
    return res.status(404).json({ error: "No such participant" });
  }
  res.status(200).json(participant);
};

const getParticipantfunc = async (userID, contestID) => {
  var participant = "";
  // console.log("in participant func", req, res);
  participant = ParticipantModel.findOne({
    userID: ObjectId(userID),
    contestID: ObjectId(contestID),
  });

  return participant;
};

const blockuser = async (req, res) => {
  // get the values from the request's body
  const { userID, contestID, type } = req.body;

  // try to create a new document
  const participant = await ParticipantModel.find({
    userID: ObjectId(userID),
    contestID: ObjectId(contestID),
  });

  console.log("in block particiipant found", participant);

  if (participant.length > 0) {
    const updatepart = await ParticipantModel.updateOne(
      {
        userID: ObjectId(userID),
        contestID: ObjectId(contestID),
      },
      {
        $set: {
          type: type,
        },
      }
    );
    const participant = await ParticipantModel.find({
      userID: ObjectId(userID),
      contestID: ObjectId(contestID),
    });
    console.log(" new  updated", participant);
  } else {
    const newpart = await ParticipantModel.create({
      userID,
      contestID,
      type: type,
    });
    const participant = await ParticipantModel.find({
      userID: ObjectId(userID),
      contestID: ObjectId(contestID),
    });
    console.log(" new created updated", participant);
  }

  res.status(200).json({msg: "success"});
};

// export
module.exports = {
  getParticipant,
  getParticipants,
  queryParticipants,
  queryContests,
  createParticipant,
  createParticipantsAll,
  deleteParticipant,
  updateParticipant,
  getParticipantfunc,
  blockuser,
};
