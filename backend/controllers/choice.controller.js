const ChoiceModel = require("../models/choice.model");
const mongoose = require("mongoose");
const votemod = require("../controllers/vote.controller")
const ParticipantModel = require("../models/participant.model");
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


const isHost = async(userID, contestID) => {
  const participant = await ParticipantModel.find({
    userID : userID,
    contestID : contestID
  })

  if(!participant) {
    return false;
  }
  if(participant.type & pt2v('host')) {
    return true;
  }
  return false;
}

const isParticipant = async(userID, contestID) => {
  const participant = await ParticipantModel.find({
    userID : userID,
    contestID : contestID
  })

  if(!participant) {
    return false;
  }
  if(!(participant.type & pt2v('blocked'))) {
    return true;
  }
  return false;
}

// get all choices
const getChoices = async (req, res) => {
  const choices = await ChoiceModel.find({}).sort({ createdAt: -1 });

  res.status(200).json(choices);
};

// get single choice
const getChoice = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such choice" });
  }

  const choice = await ChoiceModel.find(id);

  if (!choice) {
    return res.status(404).json({ error: "No such choice" });
  }
  res.status(200).json(choice);
};

// get queried list of choices
const queryChoices = async (req, res) => {
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

  const choices = await ChoiceModel.find(query).limit(limit).skip(skip);

  res.status(200).json({
    choices: choices,
    count: choices.length,
  });
};

// create new choice
const createChoice = async (req, res) => {
  // get the values from the request's body
  const { categoryID, contestID, contentID } = req.body;
  if(! isHost(req.user.userID, contestID)) {
    console.log("user [", req.user.email, '] cannot delete contest:', id)
    return res.status(400).json({
      message: "don't have sufficient permissions to delete contest"
    });
  }
  try {
    // try to create a new document
    const choice = await ChoiceModel.create({
      categoryID,
      contestID,
      contentID,
    });
    res.status(200).json(choice);
  } catch (error) {
    // if failed, return error
    console.log("create choice error!", error); 
    res.status(400).json({ error: error.message });
  }
};

// delete a choice
const deleteChoice = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such choice" });
  }

  const choice = await ChoiceModel.findByIdAndDelete(id);
  if (!choice) {
    return res.status(404).json({ error: "No such choice" });
  }
  res.status(200).json(choice);
};

// update a choice
const updateChoice = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such choice" });
  }

  const choice = await ChoiceModel.findByIdAndUpdate(id, {
    ...req.body,
  });

  if (!choice) {
    return res.status(404).json({ error: "No such choice" });
  }
  res.status(200).json(choice);
};

// function deletechoicefunc(contents) {
//   console.log("come into choice deletion function");

//   var arrayLength = contents.length;
//   var choices = "";

//   for (var i = 0; i < arrayLength; i++) {
//     choices = ChoiceModel.deleteMany({
//       contentID: contents[i]._id,
//     });

//     if (!choices) {
//       console.log("no choice found for deletion");
      
//     } else {
//       console.log("succuessfully deleted the choices", choices);
//       votemod.deletevotechoicefunc(choice._id)
//     }
//   }
// }

// export
module.exports = {
  getChoice,
  getChoices,
  queryChoices,
  createChoice,
  deleteChoice,
  updateChoice,
  // deletechoicefunc,
};
