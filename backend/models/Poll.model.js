const mongoose = require('mongoose');

const { Schema } = mongoose;

const PollSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  owner: String,
  date: { type: Date, default: Date.now },
  meta: {
    type: { type: String },
    question: String,
    categories: [String],
    epsilon: { type: Number, default: 3 }
  },
  data: [{
    category: String,
    value: Number,
    CI: { type: Number, default: 0 }
  }],
  active: { type: Boolean, default: true },
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;