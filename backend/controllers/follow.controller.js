const FollowModel = require("../models/contestFollow.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");

// get all participants
const getFollowList = async (req, res) => {
    const { id } = req.params;
    const contestL = await FollowModel.find({"contestID":id});
    res.status(200).json(contestL);
};

const createFollow = async (req, res) => {
    // get the values from the request's body
    const contestID = req.body.contestID;
    const userID =req.body.userID;
    await FollowModel.create({"userID":userID,"contestID":contestID});
    res.status(200).json("Followed");
  };

const unfollow =async(req,res) => {
    const contestID = req.body.contestID;
    const userID =req.body.userID;
    await FollowModel.findOneAndDelete({"userID":userID,"contestID":contestID});
    res.status(200).json("Unollowed");
}

const getNotification=async(req,res)=>{
    res.status(200).json("Notify1");
}

module.exports = {
    getFollowList,
    createFollow,
    unfollow,
};


module.exports = mongoose.model('ContestFollow', contestFollowSchema)