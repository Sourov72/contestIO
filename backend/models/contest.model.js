const mongoose = require('mongoose')

const contestSchema = new mongoose.Schema(
    {
        hostID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        title : {
            type : String,
            required : true
        },
        type : {
            type : String,
            required : true
        },
        objective : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        voteWeight : {
            type : Number,
            required : true
        },
        juryVoteWeight : {
            type : Number,
            required : true
        },
        voterAnonymity : {
            type : Number,
            required : true
        },
        startTime : {
            type : Date,
            required : true
        },
        registrationEndTime : {
            type : Date,
            required : true
        },
        endTime : {
            type : Date,
            required : true
        },
        img : {
            type : String,
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Contest', contestSchema)

/*

{"contestID" : 1,
"hostID" : 2,
"title" : "contest 1",
"type" : "basic contest",
"objective" : "for testing purposes"}

*/
