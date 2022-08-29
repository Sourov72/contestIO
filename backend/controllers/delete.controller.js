const VoteModel = require("../models/vote.model");
const ContentModel = require("../models/content.model");
const fileDelete = require("./filedelete");
const { ref } = require("firebase/storage");
const { storage } = require("./firebase");
const ChoiceModel = require("../models/choice.model");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

async function deletevotechoicefunc(choices) {
  console.log("vote choice fun", choices);
  var arrayLength = choices.length;

  for (var i = 0; i < arrayLength; i++) {
    const votesdeleted = await VoteModel.deleteMany({
      choiceID: choices[i]._id,
    });
    console.log("votesss choice deleted", votesdeleted);
    if (!votesdeleted) {
      console.log("no vote found for deletion");
    } else {
      console.log("succuessfully deleted the votes");
    }
  }
}

async function deletechoicefunc(contents) {
  console.log("come into choice deletion function", contents);

  var arrayLength = contents.length;
  var choices = "";
  var choicesdelete = "";

  for (var i = 0; i < arrayLength; i++) {
    choices = await ChoiceModel.find({
      contentID: contents[i]._id,
    });

    if (choices) await deletevotechoicefunc(choices);
    choicesdelete = await ChoiceModel.deleteMany({
      contentID: contents[i]._id,
    });

    console.log("choice deleted", choicesdelete);

    if (!choicesdelete) {
      console.log("no choice found for deletion");
    } else {
      console.log("succuessfully deleted the choices");
    }
  }
}

async function deletevotefunc(participantID) {
  const votes = await VoteModel.find({
    participantID: participantID,
  });

  console.log("votes", votes);

  const votesdeleted = await VoteModel.deleteMany({
    participantID: participantID,
  });
  console.log("contents deleted", votesdeleted);
  if (!votesdeleted) {
    console.log("no vote found for deletion");
  } else {
    console.log("succuessfully deleted the votes");
  }
}

async function deletecontentfunc(participantID) {
  console.log("delete contentsfucn", participantID);
  const contents = await ContentModel.find({
    participantID: participantID,
  });

  console.log("contents", contents);

  if (contents) await deletechoicefunc(contents);

  let pictureRef = "";
  for(let i=0; i<contents.length; i++){

    pictureRef = await ref(storage, decodeURIComponent(contents[i].link));
    console.log(fileDelete.deleteFile(pictureRef));

  }

  const contentsdeleted = await ContentModel.deleteMany({
    participantID: participantID,
  });

  console.log("contents deleted", contentsdeleted);
  if (!contentsdeleted) {
    console.log("no content found for deletion");
  } else {
    console.log("succuessfully deleted the contents");

    deletevotefunc(participantID);
  }
}





async function deleteSingleContent(contentID) {
  console.log("delete singleFunc", contentID);
  const contents = await ContentModel.find({
    _id: contentID,
  });

  console.log("contents", contents);

  if (contents) await deletechoicefunc(contents);

  let pictureRef = "";
  for(let i=0; i<contents.length; i++){

    pictureRef = await ref(storage, decodeURIComponent(contents[i].link));
    console.log(fileDelete.deleteFile(pictureRef));

  }
}

module.exports = {
  deletecontentfunc,
  deleteSingleContent,
};
