const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const participantModel = require("../models/participant.model");
const fileDelete = require("./filedelete");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { ref } = require("firebase/storage");
const { storage } = require("./firebase");
const { v4 } = require("uuid");
// // router.route("/").get((req, res) => {
//   User.find()
//     .then((users) => res.json(users))
//     .catch((err) => res.status(400).json("Error :" + err));
// });

const getAllUser = (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error :" + err));
};

const getBL_UNBL_users = async (req, res) => {
  console.log("in block unblock users", req.body);

  const { username, contestID } = req.body;

  const userss = await User.aggregate([
    {
      $lookup: {
        from: "participants",
        localField: "_id",
        foreignField: "userID",

        pipeline: [
          {
            $match: {
              contestID: { $eq: ObjectId(contestID) },
              // type: { $ne: 2 },
            },
          },
          {
            $project: {
              type: 1,
            },
          },
        ],

        as: "userData",
      },
    },

    {
      $project: {
        type: "$userData.type",
        username: 1,
        email: 1,
        _id: 1,
      },
    },

    {
      $match: {
        // userData: { $exists: true, $not: { $size: 0 } },
        // type: { $ne: 2 },

        $or: [
          {
            username: {
              $regex: username,
              $options: "i",
            },
          },
          {
            email: {
              $regex: username,
              $options: "i",
            },
          },
        ],
      },
    },

    {
      $sort: {
        type: -1,
        username: 1,
      },
    },
  ]).limit(20);

  res.json(userss);
  console.log("in block unblock", userss);
};

const getUser = (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  User.findOne({ email: email })
    .then((user) => {
      // console.log("user:", user);
      if (!user) {
        return res.status(400).send({
          message: "No such user exists",
        });
      }
      // check if the hashed pwd matches
      bcrypt
        .compare(password, user.password)
        .then((pwdCheck) => {
          if (!pwdCheck) {
            return res.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          // if success in matching, then create a jwt token
          const token = jwt.sign(
            {
              userID: user._id,
              userEmail: user.email,
            },
            "login-token",
            { expiresIn: "24h" }
          );

          //   return success res
          return res.status(200).send({
            message: "Login Successful",
            user: user,
            token,
          });
        })
        .catch((error) => {
          // if password did not match
          return res.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      return res.status(400).send({
        message: "Email not found",
        e,
      });
    });
};

const getSpecificUsers = async (req, res) => {
  // var word = req.body.username;
  const { username, contestID } = req.body;
  const userss = await User.aggregate([
    {
      $lookup: {
        from: "participants",
        localField: "_id",
        foreignField: "userID",

        pipeline: [
          {
            $match: {
              contestID: { $eq: ObjectId(contestID) },
              // type: { $ne: 2 },
            },
          },
        ],

        as: "userData",
      },
    },

    {
      $match: {
        userData: { $exists: true, $size: 0 },

        $or: [
          {
            username: {
              $regex: username,
              $options: "i",
            },
          },
          {
            email: {
              $regex: username,
              $options: "i",
            },
          },
        ],
      },
    },
  ]).limit(20);

  res.json(userss);
  console.log("users", userss);
};

const profilecheck = (req, res) => {
  console.log(req.params.id);
  // res.send("Hello Login!");

  User.findOne({ _id: req.params.id }, function (err, user) {
    if (user) {
      res.send({ message: "Here is profiles info", user: user });
    } else {
      res.send({ message: "User not registerd" });
    }
  });
};

const createUser = async (req, res) => {
  console.log("reqbody", req.body);
  const username = req.body.username;
  const nickname = req.body.nickname;
  const password = req.body.password;
  const email = req.body.email;
  const bio = req.body.bio;
  const facebookhandle = req.body.facebookhandle;
  const instagramhandle = req.body.instagramhandle;
  const img = req.body.img;

  User.findOne({ email: email }, function (err, result) {
    if (result) {
      return res.status(400).json({
        message: "User already registered",
      });
    } else {
      bcrypt
        .hash(password, 10)
        .then((password) => {
          console.log("hashed password: ", password);
          const newUser = new User({
            username,
            nickname,
            password,
            email,
            bio,
            socialhandles: {
              facebookhandle,
              instagramhandle,
            },
            img,
          });
          // console.log("new user:", newUser)
          newUser
            .save()
            .then(() => {
              return res.status(200).json({
                message: "User added successfully",
              });
            })
            .catch((err) => {
              console.log(err);
              return res.status(400).json({
                message: "Register Error",
                error: err,
              });
            });
        })
        .catch((err) => {
          return res.status(400).json({
            message: "Password was not hashed successfully",
            error: err,
          });
        });
    }
  });
};

const updateUser = async (req, res) => {
  const id = req.user.userID;
  // console.log("req body", req.body)
  // console.log("req user", req.user)
  let pictureRef = "";

  const pass = req.body.reoldpassword;
  // console.log("req id", id);
  // console.log("req body pass", pass);
  const prevUser = await User.findById(id);
  // console.log("prevuser", prevUser)

  bcrypt
    .compare(pass, prevUser.password)
    .then((pwdCheck) => {
      if (!pwdCheck) {
        return res.status(400).send({
          message: "Passwords does not match",
          error,
        });
      }
    })
    .catch((error) => {
      // if password did not match
      return res.status(400).send({
        message: "Passwords does not match",
        error,
      });
    });

  const newUser = await User.findOne({ _id: id });
  console.log("hereeee", newUser.img);
  console.log("req body", req.body.img);
  console.log("outside if");
  if (newUser.img !== "" && newUser.img !== req.body.img) {
    console.log("hereeee", newUser.img);
    console.log("req body", req.body.img);
    pictureRef = await ref(storage, decodeURIComponent(newUser.img));
  } 

  const user = await User.findByIdAndUpdate(id, {
    username: req.body.username,
    nickname: req.body.nickname,
    bio: req.body.bio,
    socialhandles: {
      facebookhandle: req.body.facebookhandle,
      instagramhandle: req.body.instagramhandle,
    },
    img: req.body.img,
  });

  if (!user) {
    return res.status(400).json({ message: "Could not update" });
  }
  console.log("user update success");
  if (pictureRef !== "") {
    // await pictureRef.delete();

    console.log("in delete but why");

    console.log(fileDelete.deleteFile(pictureRef));
  }
  return res.status(200).json({ message: "User Updated!" });
};

module.exports = {
  createUser,
  getAllUser,
  getUser,
  profilecheck,
  getSpecificUsers,
  updateUser,
  getBL_UNBL_users,
};
