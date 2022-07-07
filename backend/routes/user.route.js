// const router = require("express").Router();
// let User = require("../models/user.model");

// router.route("/add").post((req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const email = req.body.email;
//   const bio = req.body.bio;
//   const facebookhandle = req.body.facebookhandle;
//   const instagramhandle = req.body.instagramhandle;
//   const img = req.body.img;

//   const newUser = new User({
//     username,
//     password,
//     email,
//     bio,
//     socialhandles: {
//       facebookhandle,
//       instagramhandle,
//     },
//     img,
//   });

//   newUser
//     .save()
//     .then(() => res.json("User added!"))
//     .catch((err) => res.status(400).json("Error" + err));
// });

// module.exports = router;

const express = require("express");
// const path = require("path");
const multer = require("multer");
const Users = require("../controllers/user.controller");
const router = express.Router();

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });

router.post(
  "/add",
  upload.single("profilePicture"), // for storing single image : upload.single('productPicture')
  Users.createUser
);

router.get("/", Users.getAllUser);

router.post("/login", Users.getUser);

router.get("/:id", Users.profilecheck);

router.post("/users", Users.getSpecificUsers);

module.exports = router;
