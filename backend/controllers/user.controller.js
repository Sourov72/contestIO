const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// router.route("/").get((req, res) => {
//   User.find()
//     .then((users) => res.json(users))
//     .catch((err) => res.status(400).json("Error :" + err));
// });

const getAllUser = (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error :" + err));
};

const getUser = (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log(email);

  User.findOne({ email: email })
    .then((user) => {
      // console.log("user:", user);
      if(!user) {
        return res.status(400).send({
          message: "No such user exists"
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
          res.status(200).send({
            message: "Login Successful",
            user: user,
            token,
          });
        })
        .catch((error) => {
          // if password did not match
          res.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      res.status(400).send({
        message: "Email not found",
        e,
      });
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
    .then((users) => res.status(200).json(users))
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

  User.findOne({ email: email }, function (err, result) {
    if (result) {
      res.status(400).json({
        message: "User already registered",
      });
    } else {
      bcrypt
        .hash(password, 10)
        .then((password) => {
          console.log("hashed password: ", password)
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
          // console.log("new user:", newUser)
          newUser
            .save()
            .then(() =>
              res.status(200).json({
                message: "User added successfully",
              })
            )
            .catch((err) => {
              console.log(err)
              res.status(400).json({
                message: "Register Error",
                error: err,
              })
            });
        })
        .catch((err) =>
          res.status(400).json({
            message: "Password was not hashed successfully",
            error: err,
          })
        );
    }
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  console.log("req", req.body);

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(404).json({ error: "No such contest" });
  // }

  const user = await User.findByIdAndUpdate(id, {
    username: req.body.username,
    bio: req.body.bio,
    socialhandles: {
      facebookhandle: req.body.facebookhandle,
      instagramhandle: req.body.instagramhandle,
    },
    img: req.body.img,
  });

  if (!user) {
    return res.status(404).json({ error: "No such user" });
  }
  res.status(200).json({ user, message: "User Updated!" });
};

// module.exports = {createUser}

module.exports = {
  createUser,
  getAllUser,
  getUser,
  profilecheck,
  getSpecificUsers,
  updateUser,
};
