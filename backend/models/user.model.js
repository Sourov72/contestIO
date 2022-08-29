const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },

    nickname: {
      type: String,
      trim: true,
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
    },
    socialhandles: {
      facebookhandle: String,
      instagramhandle: String,
    },
    img: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
