const express = require('express');
const router = express.Router();
const privatize = require('../utils/privacy');

var ObjectID = require('mongodb').ObjectID;


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



// TODO: Get authentication middleware
router.post('/create', (req, res) => {
  
  const surveyParams = req.body;
  const categories = surveyParams.meta.categories;
  const owner = 'bob';
  const data = categories.map(category => ({
    category,
    value: 0,
    CI: 0
  }));

  console.log(data);
  const newPoll = new Poll({
    ...surveyParams,
    owner,
    data
  });

  console.log(newPoll);

  newPoll.save()
  .then(user => {
    res.json({ id: newPoll._id });
  })
  .catch(err => console.log(err));
});

// TODO: Get authentication middleware
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

// Not allowed to view until deactivated
router.get('/view/:id', async (req, res) => {
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
router.get('/deactivate/:id', async (req, res) => {
  const surveyID = req.params.id;

  Poll.findByIdAndUpdate(
    surveyID, 
    { $set: {active: false }}, 
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




module.exports = router;