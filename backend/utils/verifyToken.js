const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  let token = req.header("Authorization");
  if (token && token.split(' ')[0] === 'Bearer') {
    // Handle header tokens
    token = token.split(' ')[1];
  } else if (req.query && req.query.token) {
    // Handle query tokens
    token = req.query.token;
  }
  
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};