const router = require("express").Router();
const User = require("../model/User");
const Poll = require("../model/Poll");
const verify = require("../utils/verifyToken");
const { pollValidation, responseValidation } = require("../utils/validation");

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
  if (error) return res.status(400).send({success: false, msg: error.details[0].message});

  // Check 
  /* 
  {
    name: "test",
    questions: [{prompt: "You lose: ", response: ["a", "b", "c"]}],
  }
  */
  const poll = new Poll({...req.body, owner: userId});

  try {
    const savedPoll = await poll.save();
    res.send({ success: true, poll: savedPoll.shortId });
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
  res.send(poll);
});

// Submit poll: public
router.post("/:shortId/submit", async (req, res) => {

  // Get poll and validate response submission
  const poll = await Poll.findOne({shortId: req.params["shortId"]}).exec();
  const response = req.body;
  
  // Validate poll submission with poll
  const { error } = responseValidation(response, poll);
  if (error) return res.status(400).send({success: false, msg: error.details[0].message});
  // Append response to poll
  try {
    poll.responses.push(response);
    await poll.save();
    res.send({success: true});
  } catch(err) {
    // Server Error
    res.status(500).send(err);
  }
});

// Delete Poll: Private
router.delete("/:shortId", verify, async (req, res) => {
  
  // TODO: make middleware that verifies shortId and userid?
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

// Close Poll and Compute Results
router.post("/:shortId/close", verify, async (req, res) => {
  
  // Check that user owns poll
  const userId = req.user._id;
  const poll = await Poll.findOne({shortId: req.params["shortId"]}).exec();
  
  if (userId !== String(poll.owner)) {
    return res.status(401).send({
      success: false,
      msg: "User _ is not owner of poll",
    })
  }

  if (!poll.active) {
    return res.status(400).send({
      success: false,
      msg: "Poll already closed"
    })
  }

  // Compile results
  // TODO: Implement Differential Privacy
  const questions = poll.questions;
  const counts = questions.map(({responses}) => responses.map(option => ({option, count: 0})));
  for (const {answers} of poll.responses) {
    // Iterate through each question for each response
    for (let q = 0; q < answers.length; q++){
      // Find the index of response from a question's options
      let itemIndex = questions[q].responses.indexOf(answers[q]);
      counts[q][itemIndex].count += 1;
    }
  }

  // TODO: Set confidence interval for DP
  let results = counts.map(arr => ({
    ci: 0,
    frequency: arr,
  }));
  // Update results
  poll.results = results;
  poll.active = false;
  try {
    await poll.save();
    res.send({ success: true});
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;