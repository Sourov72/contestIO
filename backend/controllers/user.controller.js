const User = require("../models/user.model");

// router.route("/").get((req, res) => {
//   User.find()
//     .then((users) => res.json(users))
//     .catch((err) => res.status(400).json("Error :" + err));
// });

const getAllUser = (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error :" + err));
  console.log("heree in all users class");
};

const getUser = (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log(email);

  User.findOne({ email: email }, function (err, user) {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfull", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registerd" });
    }
  });
};

const getSpecificUsers = (req, res) => {
  var word = req.body.username;
  console.log("hello", word);
  User.find({
    $or: [
      {
        username: {
          $regex: word,
          $options: "i",
        },
      },
      {
        email: {
          $regex: word,
          $options: "i",
        },
      },
    ],
  })
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error :" + err));
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

const createUser = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const bio = req.body.bio;
  const facebookhandle = req.body.facebookhandle;
  const instagramhandle = req.body.instagramhandle;
  const img = req.body.img;

  console.log("img", img);

  User.findOne({ email: email }, function (err, result) {
    if (result) {
      res.json("User already registered");
    } else {
      const newUser = new User({
        username,
        password,
        email,
        bio,
        socialhandles: {
          facebookhandle,
          instagramhandle,
        },
        img,
      });
      console.log("in new user addtion")

      newUser
        .save()
        .then(() => res.json("User added!"))
        .catch((err) => res.status(400).json("Error hello broth " + err));
    }
  });
};

// module.exports = {createUser}

module.exports = {
  createUser,
  getAllUser,
  getUser,
  profilecheck,
  getSpecificUsers,
};

