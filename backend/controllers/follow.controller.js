const FollowModel = require("../models/contestFollow.model");
const userModel = require("../models/user.model");
const ContestModel = require("../models/contest.model");
const mongoose = require("mongoose");

// get all participants
const getFollowList = async (req, res) => {
    const { id } = req.params;
    const userList = await FollowModel.find({"contestID":id});
    res.status(200).json(userList);
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
    res.status(200).json("Unfollowed");
}

const getUserFollowList = async (req, res) => {
    const { userId } = req.params;
    const contestList = await FollowModel.find({"userID":userId},{"contestID":1});
    res.status(200).json(contestList);
};

const getNotification=async(req,res)=>{
    const { userId } = req.params;
    const contestList = await FollowModel.find({"userID":userId},{"contestID":1});
    const strRet={};

    for (let i=0;i<contestList.length;i++){
        console.log("contetIDs",contestList[i]);
        const dt=new Date();
        const temp=await ContestModel.find({"contestID":contestList[i],"registrationEndTime":"$lte:dt"},{"contestID":1,"registrationEndTime":"1"});
        strRet.push(temp);

        //get notifications
    }
    
    if(contestList.length<1){
        res.status(200).join("")
    }
    res.status(200).json("Notify1");
}

module.exports = {
    getFollowList,
    createFollow,
    unfollow,
};


module.exports = mongoose.model('ContestFollow', contestFollowSchema)