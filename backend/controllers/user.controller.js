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
  // res.send("Hello Login!");
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

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error" + err));
};

// module.exports = {createUser}

module.exports = {
  createUser,
  getAllUser,
  getUser,
  profilecheck,
};

// exports.createProduct = (req, res) => {
//     const { name} = req.body;

//     let productPictures = [];

//     if (req.files.length > 0) {
//       productPictures = req.files.map((file) => {
//         return { img: file.filename };
//       });
//     }

//     const product = new Product({
//       name,
//       productPictures,
//     });

//     product.save((error, product) => {
//       if (error) return res.status(400).json({ error });
//       if (product) {
//         res.status(201).json({ product });
//       }
//     });
//   };
