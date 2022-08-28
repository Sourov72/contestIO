const ContentModel = require("../models/content.model");
const ChoiceModel = require("../models/choice.model");
const participantmod = require("../controllers/participant.controller");
const choicemod = require("../controllers/choice.controller");
const deletemod = require("../controllers/delete.controller");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// get all contents
const getContents = async (req, res) => {
  const contents = await ContentModel.find({}).sort({ createdAt: -1 });

  res.status(200).json(contents);
};

// get single content
const getContent = async (req, res) => {
  const { id } = req.params;
  console.log("id ", id);
  // I guess this commented line doesn't work
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(404).json({ error: "No such content" });
  // }

  // const content = await ChoiceModel.find({ categoryID: id });
  // // console.log("content info",content)

  // if (!content) {
  //   return res.status(404).json({ error: "No such content" });
  // }

  // res.status(200).json(content);
};

// get all contents under one category
const getallContent = async (req, res) => {
  console.log("req query", req.query);
  const { type, id } = req.query;
  console.log("type ", type);

  var match = {};

  if (type != "all") {
    match["categoryID"] = ObjectId(id);
  } else {
    match["contestID"] = ObjectId(id);
  }

  console.log("matchhhhhhhhhhhhhhhhhhhhh", match);

  const contents = await ChoiceModel.aggregate([
    {
      $lookup: {
        from: "contents",
        localField: "contentID",
        foreignField: "_id",

        as: "contentData",
      },
    },
    //

    {
      $match: match,
    },

    {
      $project: {
        categoryID: 1,
        _id: 1,
        contentID: "$contentData._id",
        link: "$contentData.link",
        title: "$contentData.title",
        description: "$contentData.description",
      },
    },
  ]);

  res.json(contents);
};

const getuserContent = async (req, res) => {
  console.log("reqbody", req.body);
  // const userID = req.body.contest.userID;
  const { userID, contestID } = req.body.contest;
  const { type, id } = req.body.category;
  console.log(userID, " ff", contestID, "ttt ", id);

  var participantID = "",
    participant = "";

  var match = {};

  if (type != "all") {
    match["categoryID"] = ObjectId(id);
    match["contentData"] = { $exists: true, $not: { $size: 0 } };
  } else {
    match["contestID"] = ObjectId(id);
    match["contentData"] = { $exists: true, $not: { $size: 0 } };
  }

  console.log("matchhhhhhhhhhhhhhhhhhhhh in user", match);

  // for participant id search

  participant = await participantmod.getParticipantfunc(userID, contestID);

  if (!participant) {
    return res.send({ message: "No such participant found" });
  }

  participantID = participant._id;

  console.log("participant", participantID);

  const contents = await ChoiceModel.aggregate([
    {
      $lookup: {
        from: "contents",
        localField: "contentID",
        foreignField: "_id",
        pipeline: [
          {
            $match: {
              participantID: ObjectId(participantID),
            },
          },
        ],
        as: "contentData",
      },
    },
    //

    {
      $match: match,
    },

    {
      $project: {
        categoryID: 1,
        _id: 1,
        contentID: "$contentData._id",
        link: "$contentData.link",
        title: "$contentData.title",
        description: "$contentData.description",
      },
    },
  ]);
  // console.log("cont", contents);
  res.json(contents);
};

// get queried list of contents
const queryContents = async (req, res) => {
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
  const contents = await ContentModel.find(query).limit(limit).skip(skip);
  const cnt = await ContentModel.count(query);
  res.status(200).json({
    contents: contents,
    count: cnt,
  });
};

// create new content
const createContent = async (req, res) => {
  // get the values from the request's body
  const contentid = "";
  var content = "";
  var choice = "";
  console.log("req body in create content", req.body);
  console.log("req content body", req.body.content);
  console.log("req choice body", req.body.choice);
  const { userID, contestID, type, title, description, link } =
    req.body.content;

  // console.log("category id", categoryID);
  console.log("contest id", contestID);
  console.log("user id", userID);

  var participantID = "",
    participant = "";

  participant = await participantmod.getParticipantfunc(userID, contestID);
  // console.log("from participant func", participant);

  participantID = participant._id;

  console.log("helllooo from create content");
  try {
    // try to create a new document

    content = await ContentModel.create({
      participantID,
      type,
      title,
      description,
      link,
    });
    // contentid = content._id;
    const { categoryID } = req.body.choice;
    const contentID = content._id;
    console.log("content id", content._id);
    try {
      // try to create a new document

      choice = await ChoiceModel.create({
        categoryID,
        contestID,
        contentID,
      });
      // contentid = content._id;

      console.log(choice);
    } catch (error) {
      // if failed, return error
      console.log("choice creation unsuccessfull");
    }

    res.status(200).json({ content, msg: "added successfully" });
  } catch (error) {
    // if failed, return error
    res.status(400).json({ error: error.message });
  }
};

// delete a content
const deleteContent = async (req, res) => {
  console.log("delete content body", req.body);

  var { contentID } = req.body;

  console.log("content id", contentID);

  contentID = ObjectId(contentID);

  const contentFind = await ContentModel.findById(contentID);

  console.log("content find", contentFind);

  if (contentFind) await deletemod.deleteSingleContent(contentID);

  const content = await ContentModel.findByIdAndDelete(contentID);
  if (!content) {
    return res.status(404).json({ error: "No such content" });
  }
  res.status(200).json(content);
};

// update a content
const updateContent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such content" });
  }

  const cntnt = await ContentModel.findById(id);
  if (!cntnt) {
    return res.status(404).json({ error: "No such content" });
  }

  const participant = await ParticipantModel.find({
    participantID: cntnt.participantID,
  });

  if (participant.userID != req.user.userID) {
    return res.status(400).json({
      error: "Don't have sufficient permissions to edit this content",
    });
  }

  const content = await ContentModel.findByIdAndUpdate(id, {
    ...req.body,
  });

  if (!content) {
    return res.status(404).json({ error: "No such content" });
  }
  res.status(200).json(content);
};

function deletecontentfunc(participantID) {
  const contents = ContentModel.deleteMany({
    participantID: participantID,
  });
  if (!contents) {
    console.log("no content found for deletion");
  } else {
    console.log("succuessfully deleted the contents", contents);
    choicemod.deletechoicefunc(contents);
  }
}

// export
module.exports = {
  getContent,
  getContents,
  queryContents,
  createContent,
  deleteContent,
  updateContent,
  getallContent,
  getuserContent,
  deletecontentfunc,
};
