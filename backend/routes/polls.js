const express = require('express');
const router = express.Router();
const privatize = require('../utils/privacy');
const jwt = require("jsonwebtoken");
const config = require("../config/keys.js");



// User model
const Poll = require('../models/Poll.model');
const User = require('../models/User.model');

// Needs user validation

/* Example Data
{
  "title": "Test",
  "owner": "Bob",
  "meta": {
    "type": "binary",
    "question": "Do you eat fast food",
    "categories": ["yes", "no"]
  }
} 
*/

const USER_ID = "5fcbe7ddcc3a51528579109d";

const auth_guard = (req, res, next) => {
  // console.log("using", req.body.token);
  let token = req.body.token;

  if (!token) {
      return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
          return res.status(401).send({ message: "Unauthorized!" });
      }
      req.body.user = decoded.id;
      next();
  });
}

router.post('/create', auth_guard, async (req, res) => {
  const surveyParams = req.body;
  const categories = surveyParams.meta.categories;

  const owner = req.body.user;
  const data = categories.map(category => ({
    category,
    value: 0,
    CI: 0
  }));

  const newPoll = new Poll({
    ...surveyParams,
    owner: req.body.user,
    data
  });


  // Save new poll and update users
  // TODO: Make transactions atomic on failure
  newPoll.save()
  .then(async (err) => {
    // const allUsers = await User.find();
    // console.log(allUsers);

    let user = (await User.findById(owner).exec());
    if (user == null) {
      res.send({"response": "failure", "msg": "user not found"});
      // TODO: throw exception
      return;
    }
    
    // Updates user's poll collection (adds id to polls)
    await user.updateOne({ $push: {polls: newPoll._id.toString() }})
    user.save();
    // console.log("User Update: ", user);
    res.json({ id: newPoll._id });
  })
  .catch(err => {console.log(err); res.send("error")});
});


router.post('/submit/:id', async (req, res) => {
  const surveyID = req.params.id;
  const val = req.body.value;
  
  let poll = (await Poll.findById(surveyID).exec());

  // Poll cannot be found
  if (poll == null){
    res.json({response: "failure", msg: "Poll not found with ID"});
  }

  // Poll cannot be incremented if deactivated
  if (!poll.active){
    res.json({response: "failure", msg: "Poll is inactive"});
  }

  // Check if response is a valid option
  const index = poll.data.findIndex((e) => e.category === val);
  
  if (index === -1)
  {
    res.json({response: "failure", msg: "value is not within choices"});
    return;
  }

  const key = `data.${index}.value`;

  // Update the right selection of poll
  Poll.findByIdAndUpdate(
    surveyID, 
    { $inc: {[key] : 1 }}, 
    (err, survey) => {
      console.log(survey);
      if (!err && survey) {

        // Save the results
        survey.save().then(user => {
          res.json({ response: "success"});
        }).catch(err => ({response: "failure", msg: "survey update failed"}));

      } else {
        // invalid surveyID
        res.json({ response: "failure", msg: "Invalid survey ID" });
      }
    }
  );
});

// View survey - without any data.
// TODO: Get authentication middleware and implement guard
router.get('/view/:id', async (req, res) => {
  const surveyID = req.params.id;

  let poll = (await Poll.findById(surveyID).exec());

  if (!poll) {
    res.json({"response": "failure", msg: "poll cannot be found with id"});
    return;
  }
  // Dropping the data attribute
  poll.data = undefined;
  res.json(poll);
});


// Require survey to be deactivated
// TODO: Get authentication middleware
router.get('/results/:id', async (req, res) => {
  const surveyID = req.params.id;

  let poll = (await Poll.findById(surveyID).exec());

  if (!poll) {
    res.json({"response": "failure", msg: "poll cannot be found with id"});
    return;
  }

  if (poll.active) {
    res.json({"response": "failure", msg: "active poll: statistics are not available"});
    return;
  }
  res.json(poll);
});


// When deactivating, we apply the full set of differential privacy measures
// We will obtain the CI intervals for each
// TODO: Get authentication middleware
router.post('/deactivate/:id', async (req, res) => {
  const surveyID = req.params.id;
  
  let poll = (await Poll.findById(surveyID).exec());

  // Poll cannot be found
  if (poll == null){
    res.json({response: "failure", msg: "Poll not found with ID"});
  }

  // Poll already deactivated
  if (!poll.active){
    res.json({response: "failure", msg: "Poll already deactivated"});
  }

  let data = poll.data;
  let epsilon = poll.meta.epsilon;

  const priv_data = data.map((entry) => {

    // privatizes value and generates 0.95 confidence bound

    const {val, CI} = privatize(entry.value, epsilon);

    // Floor value: 0
    entry.value = Math.max(0, val.toFixed(0));
    entry.CI = CI.toFixed(1);
    return entry;
  });

  console.log("Privatized Data: ", priv_data)

  Poll.findByIdAndUpdate(
    surveyID, 
    { $set: {active: false, data: priv_data}}, 
    (err, survey) => {
      console.log(survey);
      if (!err && survey) {
        // Save the results
        survey.save().then(user => {
          res.json({ response: "success"});
        }).catch(err => ({response: "failure", msg: "survey update failed"}));
      } else {
        // invalid surveyID
        res.json({ response: "failure", msg: "invalid survey ID" });
      }
    }
  );
});


router.get('/all', auth_guard, async (req, res) => {
  const user_id = req.body.user;
  let user = (await User.findById(user_id).exec());
  res.json({ polls: user.polls });
});

module.exports = router;