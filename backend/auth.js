const jwt = require("jsonwebtoken");
const config = require("src/models/config.js");
const db = require("src/models/index");
const User = db.user;
const bcrypt = require("bcryptjs");

verify_token = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

check_duplicate = (email, callback, fail) => {
    User.findOne({
        email: email
    }).exec((err, user) => {
        if (err) {
            fail(err);
        }

        if (user) {
            fail("Failed! Email is already in use!");
        }

        callback();
    });
};

signup = (req, res) => {
    const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    fail = err => res.status(500).send({message: err});

    check_duplicate(user.email, () => user.save((err, user) => {
        err ? fail(err) : res.send({ message: "User was registered successfully!" });
    }), fail);
};

signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                id: user._id,
                email: user.email,
                accessToken: token
            });
        });
};



module.exports = { verify_token, signup, signin };