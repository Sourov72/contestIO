const FollowModel = require("../models/contestFollow.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");

// get all participants
const getFollowList = async (req, res) => {
    const participants = await FollowModel.find({}).sort({ createdAt: -1 });
  
    res.status(200).json(participants);
};

module.exports = {
    getFollowList,
};


module.exports = mongoose.model('ContestFollow', contestFollowSchema)