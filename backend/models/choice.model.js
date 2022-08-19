const mongoose = require('mongoose')

const choiceSchema = new mongoose.Schema(
    {
        categoryID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "ContestCategory",
            required : true,
        },
        contestID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Contest",
            required : true,
        },
        contentID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Content",
            required : true,
        },
        
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Choice', choiceSchema)

