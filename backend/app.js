const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require("cors");

const app = express();

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// for parsing application/json
app.use(express.json());

// for access frontend => backend
app.use(cors());

// for parsing application/xwww-
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/polls', require('./routes/polls'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on http://localhost:${PORT}`));