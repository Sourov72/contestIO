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
