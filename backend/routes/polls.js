const express = require('express');
const router = express.Router();
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
router.post('/create', (req, res) => {
  const surveyParams = req.body;
  const length = surveyParams.meta.categories.length;
  const owner = 'bob';

  const newPoll = new Poll({
    ...surveyParams,
    owner,
    data: Array.from(Array(length), () => 0)
  });

  console.log(newPoll);

  newPoll.save()
  .then(user => {
    res.json({ id: newPoll._id });
  })
  .catch(err => console.log(err));

});

router.post('/submit/:id', (req, res) => {
  const surveyID = req.params.id;
  const val = req.body.value;
  console.log(surveyID);

  Poll.findByIdAndUpdate(
    surveyID, 
    { $inc: {"data.0": 1 }}, 
    (err, survey) => {
      console.log(survey);
      if (!err) {
        survey.save().then(user => {
          res.json({ response: "success"});
        }).catch(err => {response: "failure"});
      } else {
        res.json({ response: "failure" });
      }
    }
  );
  
});

module.exports = router;