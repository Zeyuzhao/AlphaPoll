const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Import Routes
const authRoute = require("./routes/auth");
const pollsRoute = require("./routes/polls");

dotenv.config();

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true},
  () => console.log("connected to MongoDB"),
);

// Middlewware
app.use(express.json());

// Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/polls", pollsRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Backend started at http://localhost:3000/");
});
