const router = require("express").Router();
const User = require("../model/User");
const Poll = require("../model/Poll");
const verify = require("../utils/verifyToken");
const { pollValidation } = require("../utils/validation");

// Get all polls under user
router.get("/", verify, async (req, res) => {
  const userId = req.user["_id"];
  const polls = await Poll.find({owner: userId}).exec();
  res.send(polls);
});

// Create a new poll
router.post("/", verify, async (req, res) => {
  const userId = req.user["_id"];
  // Validate data before poll creation
  const { error } = pollValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  /* 
  {
    name: "test",
    questions: [{prompt: "You lose: ", response: ["a", "b", "c"]}],
    owner: "user._id"
  }
  */
  const poll = new Poll(req.body);

  try {
    const savedPoll = await poll.save();
    res.send({ poll: savedPoll._id });
  } catch (err) {
    // Server Error
    res.status(500).send(err);
  }
});

// Get poll info: public
// TODO: Make a private and non-private route
router.get("/:shortId", async (req, res) => {
  const {name, questions} = await Poll.findOne({shortId: req.params["shortId"]}).exec();
  const poll = {name, questions};
  console.log(poll);
  res.send(poll);
});

router.delete("/:shortId", verify, async (req, res) => {
  
  const userId = req.user["_id"];
  const poll = await Poll.findOne({shortId: req.params["shortId"]}).exec();
  
  // Check that user owns poll
  if (userId !== String(poll.owner)) {
    return res.status(401).send({
      success: false,
      msg: "User _ is not owner of poll"
    });
  }

  try {  
    await Poll.deleteOne({shortId: req.params["shortId"]}).exec();
    res.send({ success: true });
  } catch(err) {
    // Server Error
    res.status(500).send(err);
  }
});


module.exports = router;