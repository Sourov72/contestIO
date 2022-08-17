const mongoose = require('mongoose')

const contestFollow = new mongoose.Schema(
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

module.exports = mongoose.model('Participant', contestFollow)
