const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema(
    {
        userID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        choiceID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Choice",
            required : true
        },
        categoryID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Category",
            required : true
        },
        weight : {
            type : Number,
            required : true
        }
    },
    {
        timestamps : true
    }
)

voteSchema.index({userID: 1, choiceID: 1, categoryID: 1}, {unique: true})

module.exports = mongoose.model('Vote', voteSchema)
