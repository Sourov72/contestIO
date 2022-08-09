const ContentModel = require("../models/content.model");
const ChoiceModel = require("../models/choice.model");
const ParticipantModel = require("../models/participant.model");
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
  const { id } = req.params;
  console.log("id ", id);

  ChoiceModel.find({ categoryID: id })
    .select("contentID")
    .populate("contentID")
    .then((contents) => {
      console.log("categories" + contents);
      res.json(contents);
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

const getuserContent = async (req, res) => {
  console.log("reqbody", req.body);
  const { userID, contestID, categoryID } = req.body;

  console.log(categoryID);

  var participantid = "";

  // for participant id search

  ParticipantModel.find({ userID: userID, contestID: contestID })
    .then((participant) => {
      // participantid = participant._id;
      console.log("query successfull $ id ", participant);
      // console.log("participant", participant._id)
    })
    .catch((err) => console.log("query unsuccessfull"));

  // ChoiceModel.find({ categoryID: categoryID, 'contentID' : { $exists: true, $ne: null } })
  //   .select("contentID")

  //   .populate({
  //     path: "contentID",
  //     match: {
  //       participantID: {
  //         $eq: userID,
  //       },
  //     },
  //   })
    

  //   .then((contents) => {
  //     console.log("contents" + contents);
  //     res.json(contents);
  //   })
  //   .catch((err) => res.status(400).json("Error: " + err));

  const contents = await ChoiceModel.aggregate([
    {
      $lookup: {
        from: "contents",
        localField: "contentID",
        foreignField: "_id",
        pipeline: [{ $match: {

          participantID:ObjectId(userID)

        } }],
        as: "contentData",
      },
    },
    // {
    //   $project: {
    //     categoryID: 1,
    //   },
    // },

    {
      $match: {
        categoryID: ObjectId(categoryID),
        contentData: { $exists: true, $not: { $size: 0 } },
      },
    },
  ]);
  // console.log("cont", contents);
  res.status(200).json({
    contents: contents,
  });
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
  console.log("req body", req.body);
  console.log("req content body", req.body.content);
  console.log("req choice body", req.body.choice);
  const { participantID, type, title, description, link } = req.body.content;
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

    res.status(200).json({ content, msg: "added successfully" });
  } catch (error) {
    // if failed, return error
    res.status(400).json({ error: error.message });
  }
  // console.log("content id", content)
  const { categoryID, contestID } = req.body.choice;
  const contentID = content._id;
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
};

// delete a content
const deleteContent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such content" });
  }

  const content = await ContentModel.findByIdAndDelete(id);
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

  const content = await ContentModel.findByIdAndUpdate(id, {
    ...req.body,
  });

  if (!content) {
    return res.status(404).json({ error: "No such content" });
  }
  res.status(200).json(content);
};

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
};
