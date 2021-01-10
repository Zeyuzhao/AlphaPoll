const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { registerValidation, loginValidation } = require("../utils/validation");
const verify = require("../utils/verifyToken");

// Get user information
router.get("/", verify, async (req, res) => {
  const {_id, name, email, date } = await User.findById(req.user["_id"]);
  const user = {_id, name, email, date };
  console.log(user);
  res.send(user);
});

router.post("/register", async (req, res) => {
  // Validate data before user creation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login 
router.post("/login", async (req, res) => {
  // Do validation
  const {error} = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found");

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("Authorization", `Bearer ${token}`).send({success: true, token});
});

module.exports = router;