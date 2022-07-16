const mongoose = require('mongoose')

const contestSchema = new mongoose.Schema(
    {
        contestID : {
            type : Number,
            required : true
        },
        hostID : {
            type : Number,
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
        creationTime : {
            type : Date,
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
