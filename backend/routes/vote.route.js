const express = require("express");
const {
  getVote,
  getVotes,
  queryVotes,
  createVote,
  deleteVote,
  updateVote,
  getContentVoters,
  getResults,
} = require("../controllers/vote.controller");
const { basicAuth, selfAuth } = require("../controllers/auth.controller");
const router = express.Router();

// GET all votes
router.get("/", getVotes);

// GET a queried list of votes
router.get("/query", queryVotes); 

// GET a single vote
router.get("/vote", getVote);

router.get("/getContentVoters", basicAuth, getContentVoters);

// POST a new vote
router.post("/create", basicAuth, createVote);

router.get("/getResults/:id", getResults);

// DELETE a new vote
router.delete("/delete", basicAuth, deleteVote);

// UPDATE a new vote
router.patch("/update/:id", basicAuth, updateVote);

module.exports = router;
