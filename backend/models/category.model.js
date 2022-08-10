const mongoose = require("mongoose");
const ContestModel = require("./contest.model");

const categorySchema = new mongoose.Schema(
  {

    contestID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Contest",
        required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },

    maxvoteperUser: {
      type: Number,
      required: true,
    },

    maxchoices: {
      type: Number,
      required: true,
      default : 0,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('ContestCategory', categorySchema)
