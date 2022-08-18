const mongoose = require('mongoose')

const contestFollowSchema = new mongoose.Schema(
    {
        userID : {
            type : String,
            required : true
        },
        contestID : {
            type : String,
            required : true
        },
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('ContestFollow', contestFollowSchema)
