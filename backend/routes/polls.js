const router = require("express").Router();
const User = require("../model/User");
const Poll = require("../model/Poll");
const verify = require("../utils/verifyToken");
const { pollValidation } = require("../utils/validation");

// Get all posts under user
router.get("/", verify, async (req, res) => {
  const userId = req.user["_id"];
  const polls = await Poll.find({owner: userId}).exec();
  res.send(polls);
});

router.post("/", verify, async (req, res) => {
  const userId = req.user["_id"];
  // Validate data before poll creation
  const { error } = pollValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  /* 
  {
    name: "test",
    questions: [{prompt: "You lose: ", response: ["a", "b", "c"]}],
    owner: "_id"
  }
  */
  const poll = new Poll(req.body);

  try {
    const savedPoll = await poll.save();
    res.send({ poll: savedPoll._id });
  } catch (err) {
    res.status(400).send(err);
  }
});
// router.get("/")
module.exports = router;