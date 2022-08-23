const express = require("express");
const multer = require("multer");
const Users = require("../controllers/user.controller");
const router = express.Router();
const { basicAuth, selfAuth } = require("../controllers/auth.controller")

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

router.post("/block", Users.getBL_UNBL_users);


router.post("/update/:id", selfAuth, Users.updateUser);

module.exports = router;
