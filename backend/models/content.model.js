const mongoose = require('mongoose')

const contentSchema = new mongoose.Schema(
    {
        participantID : {
            type : String,
            required : true
        },
        type : {
            type : String,
            required : true
        },
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        link : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Content', contentSchema)

