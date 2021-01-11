const mongoose = require('mongoose');
const {nanoid} = require('nanoid');
const questionSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  responses: [String],
});

// TODO: Validate that answers correspond to each question (each answer matches options in question)
const responseSchema = new mongoose.Schema({
  // If user is logged in?
  owner: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  // Each answer corresponds to each question
  answers: [String],
});

// TODO: Validate that each result is consistant with each question
const resultSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  ci: { // Confidence interval after differential privacy mechanism
    type: Number,
    required: true,
  },
  frequency: [{
    option: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
  }],
});

// Store responses to each question
const pollSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // INFO: only 1 question
  questions: [questionSchema],
  // INFO: only 1 result
  results: [resultSchema],        // Processed and privatized data      
                                  // Each result corresponds to a question
  responses: [responseSchema],
  owner: {
    type: mongoose.Types.ObjectId, // Autocast?
    required: true,
  },    // Each response contains responses to multiple questions
  shortId: { // will be used by the url
    type: String,
    default: () => nanoid(8),
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Poll", pollSchema);

