require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.route");
const contestRouter = require("./routes/contest.route")
const participantRouter = require("./routes/participant.route")

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
