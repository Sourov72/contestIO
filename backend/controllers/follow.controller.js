const FollowModel = require("../models/contestFollow.model");
//const userModel = require("../models/user.model");
const ContestModel = require("../models/contest.model");
const mongoose = require("mongoose");

// get all participants
const getFollowList = async (req, res) => {
    //console.log("Asche");
    const { id } = req.params;
    const userList = await FollowModel.find({"contestID":id});
    res.status(200).json(userList);
};

const isFollowed=async(req,res) => {
    const  {contestID,userID}  = req.query;
    console.log("userid haha", userID, "contestid", contestID);
    const contestList = await FollowModel.find({"userID":userID,"contestID":contestID});
    if(contestList.length>0){
        res.status(200).json("True");
    }
    else {
        //console.log("Asche2");
        res.status(200).json("False");
    }
};

const createFollow = async (req, res) => {
    // get the values from the request's body
    
    const  {contestID,userID}  = req.query;
    console.log("userid haha", userID, "contestid", contestID);
    await FollowModel.create({"userID":userID,"contestID":contestID});
    const contestList = await FollowModel.find({"userID":userID,"contestID":contestID});
    if(contestList.length>0){
        res.status(200).json("Followed");
    }
    res.status(200).json("error");
  };

const unfollow =async(req,res) => {
    const  {contestID,userID}  = req.query;
    console.log("userid unfollow", userID, "contestid", contestID);
    await FollowModel.deleteMany({"userID":userID,"contestID":contestID});
    const contestList = await FollowModel.find({"userID":userID,"contestID":contestID});
    if(contestList.length===0){
        res.status(200).json("Unfollowed");
    }
    res.status(200).json("error");
}

const getUserFollowList = async (req, res) => {
    const { userId } = req.params;
    const contestList = await FollowModel.find({"userID":userId},{"contestID":1});
    res.status(200).json(contestList);
};

const getNotification=async(req,res)=>{
    const  {userID}  = req.query;
    const contestList = await FollowModel.find({"userID":userId},{"contestID":1});
    const strRet={};
    const strRetFinal={};
    let tmp="";
    //console.log("asjdhfj");
    for (let i=0;i<contestList.length;i++){
        console.log("contetIDs",contestList[i]);
        const dt=new Date();
        const temp=await ContestModel.find({"contestID":contestList[i],"registrationEndTime":"$gte:dt"},{"title":1,"registrationEndTime":"1"});
        if(temp.length!=0) {
            tmp="";
            tmp=tmp.concat("Registration Ends For ");
            tmp=tmp.concat(temp.title);
            strRet.push(tmp);
        }
        const temp2=await ContestModel.find({"contestID":contestList[i],"startTime":"$gte:dt"},{"title":1,"startTime":"1"});
        if(temp2.length!=0) {
            tmp="";
            tmp=tmp.concat(temp2.title);
            tmp=tmp.concat(" Starts");
            strRet.push(tmp);
        }
        const temp3=await ContestModel.find({"contestID":contestList[i],"endTime":"$gte:dt"},{"title":1,"endTime":"1"});
        if(temp3.length!=0) if(temp2.length!=0) {
            tmp="";
            tmp=tmp.concat(temp3.title);
            tmp=tmp.concat(" Ends");
            strRet.push(tmp);
        }
        //strRetFinal = strRet.sort((a, b) => b.date - a.date)
        //get notifications
    }
    
    if(contestList.length<1){
        res.status(200).join("")
    }
    res.status(200).json(strRet);
}

module.exports = {
    getFollowList,
    createFollow,
    unfollow,
    getNotification,
    getUserFollowList,
    isFollowed,
};

