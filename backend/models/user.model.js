const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    password: {
      type: String,
      required: true,
      minlength: 1,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    bio: {
      type: String,
      required: true,
    },

    // createAt: {
    //     type: Date,
    //     immutable: true,
    //     default : () => Date.now(),

    // },
    socialhandles: {
      facebookhandle: String,
      instagramhandle: String,
    },

    img :{
      type : String,
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
