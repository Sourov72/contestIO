const VoteModel = require("../models/vote.model");
const ContentModel = require("../models/content.model");

const ChoiceModel = require("../models/choice.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

 function deletevotechoicefunc(choices) {
  console.log("vote choice fun", choices);
  var arrayLength = choices.length;

  for (var i = 0; i < arrayLength; i++) {
    const votesdeleted =  VoteModel.deleteMany({
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

 function deletechoicefunc(contents) {
  console.log("come into choice deletion function", contents);

  var arrayLength = contents.length;
  var choices = "";
  var choicesdelete = "";

  for (var i = 0; i < arrayLength; i++) {
    choices =  ChoiceModel.find({
      contentID: contents[i]._id,
    });

    if (choices)  deletevotechoicefunc(choices);
    choicesdelete =  ChoiceModel.deleteMany({
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

 function deletevotefunc(participantID) {
  const votes =  VoteModel.find({
    participantID: participantID,
  });

  console.log("votes", votes);

  const votesdeleted =  VoteModel.deleteMany({
    participantID: participantID,
  });
  console.log("contents deleted", votesdeleted);
  if (!votesdeleted) {
    console.log("no vote found for deletion");
  } else {
    console.log("succuessfully deleted the votes");
  }
}

 function deletecontentfunc(participantID) {
  console.log("delete contentsfucn", participantID);
  const contents =  ContentModel.find({
    participantID: participantID,
  });

  console.log("contents", contents);

  if (contents)  deletechoicefunc(contents);

  const contentsdeleted =  ContentModel.deleteMany({
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

module.exports = {
  deletecontentfunc,
};
