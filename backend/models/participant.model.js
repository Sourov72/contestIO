const mongoose = require('mongoose')

const participantSchema = new mongoose.Schema(
    {
        userID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        contestID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Contest",
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

participantSchema.index({userID: 1, contestID: 1}, {unique: true})

module.exports = mongoose.model('Participant', participantSchema)



// const mongoose = require('mongoose')

// const participantSchema = new mongoose.Schema(
//     {
//         userID : {
//             type : String,
//             required : true
//         },
//         contestID : {
//             type : String,
//             required : true
//         },
//         type : {
//             type : Number,
//             required : true
//         }
//     },
//     {
//         timestamps : true
//     }
// )

// module.exports = mongoose.model('Participant', participantSchema)
