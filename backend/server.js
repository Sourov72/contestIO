require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.route");
const contestRouter = require("./routes/contest.route")
const participantRouter = require("./routes/participant.route")
const contentRouter = require("./routes/content.route")
const ChoiceRouter = require("./routes/choice.route")
const VoteRouter = require("./routes/vote.route")

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next)=> {
  // this is used for logging
  console.log(req.path, req.method)
  next()
})

// routes
app.use("/api/user", userRouter);
app.use("/api/contests", contestRouter);
app.use("/api/participants", participantRouter);
app.use("/api/contents", contentRouter);
app.use("/api/choices", ChoiceRouter);
app.use("/api/votes", VoteRouter);

// connect to db
mongoose.connect(process.env.ATLAS_URI)
    .then(() => {
        // listen for requests if connection succeeds
        console.log("MongoDB database connection established sucessfully");
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}!`)
        })
    })
    .catch((error) => {
        console.log("Couldn't connect to the db\n", error)
    })

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });
