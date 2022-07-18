const mongoose = require('mongoose')

const participantSchema = new mongoose.Schema(
    {
        userID : {
            type : String,
            required : true
        },
        contestID : {
            type : String,
            required : true
        },
        type : {
            type : Number,
            required : true
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Participant', participantSchema)
