const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error :" + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const bio = req.body.bio;
  const facebookhandle = req.body.facebookhandle;
  const instagramhandle = req.body.instagramhandle;

  const newUser = new User({
    username,
    password,
    email,
    bio,
    socialhandles: {
      facebookhandle,
      instagramhandle,
    },
  });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error" + err));
});

module.exports = router;
