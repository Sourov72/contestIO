const ParticipantModel = require("../models/participant.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");

// participant types
const ptype = {
  HOST: 1 << 1,
  CONTESTANT: 1 << 2,
  VOTER: 1 << 3,
  JURY: 1 << 4,
  FOLLOWER: 1 << 5,
  BLOCKED: 1 << 6,
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
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such participant" });
  }

  const participant = await ParticipantModel.find(id);

  if (!participant) {
    return res.status(404).json({ error: "No such participant" });
  }
  res.status(200).json(participant);
};

// get queried list of participants
const queryParticipants = async (req, res) => {
  var query = {};
  var limit = 20;
  var skip = 0;
  for (var key in req.query) {
    if (req.query[key] == "") {
      continue;
    }
    const arr = req.query[key].split(",");
    switch (arr[0]) {
      case "eq":
        query[key] = { $eq: arr[1] };
        break;
      case "lt":
        query[key] = { $lt: arr[1] };
        break;
      case "lte":
        query[key] = { $lte: arr[1] };
        break;
      case "gt":
        query[key] = { $gt: arr[1] };
        break;
      case "gte":
        query[key] = { $gte: arr[1] };
        break;
      case "regex":
        query[key] = { $regex: arr[1] };
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
  // console.log(query)
  const participants = await ParticipantModel.find(query)
    .limit(limit)
    .skip(skip);
  const cnt = await ParticipantModel.count(query);
  res.status(200).json({
    participants: participants,
    count: cnt,
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
    diagnostics.total += dic.total
    diagnostics.success += dic.success
    diagnostics.duplicate += dic.duplicate

  }

  a(await createParticipants(contestant, contestID, pt2v('contestant', 'voter', 'follower')))
  a(await createParticipants(voter, contestID, pt2v('voter', 'follower')))
  a(await createParticipants(jury, contestID, pt2v('jury', 'follower')))
  console.log('diagnostics:',diagnostics)
  res.status(200).json(diagnostics);
};

const createParticipants = async (list, contestID, type) => {
  var res = {
    total: 0,
    success: 0,
    duplicate: 0,
  };
  for (let i = 0; i < list.length; i++) {
    res.total += 1
    const user = await userModel.find({ email: list[i].toLowerCase() });
    if (!user) {
        console.log('no user found for', list[i])
        continue;
    }
    // console.log(user)
    // console.log(user[0]._id)
    let userID = user[0]._id.valueOf()
    const participant = await ParticipantModel.find({
        userID: userID,
        contestID: contestID
    });
    if (participant.length > 0) {
      console.log('duplicate found for', list[i], 'already exists entry:', participant)
      res.duplicate += 1
      continue;
    }

    try {
      // try to create a new document
      await ParticipantModel.create({
        userID: userID,
        contestID: contestID,
        type: type,
      });
      res.success += 1
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
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such participant" });
  }

  const participant = await ParticipantModel.findByIdAndDelete(id);
  if (!participant) {
    return res.status(404).json({ error: "No such participant" });
  }
  res.status(200).json(participant);
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

// export
module.exports = {
  getParticipant,
  getParticipants,
  queryParticipants,
  createParticipant,
  createParticipantsAll,
  deleteParticipant,
  updateParticipant,
};
