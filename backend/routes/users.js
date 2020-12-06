const jwt = require("jsonwebtoken");
const config = require("src/models/config.js");
const bcrypt = require("bcryptjs");

const express = require('express');
const router = express.Router();

const User = require('../models/User.model.js');

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

router.post('/verify', (req, res) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
    });
});

router.post('/login', (req, res) => {
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
                name: user.name,
                email: user.email,
                date: user.date,
                accessToken: token
            });
        });
});

router.post('/register', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        date: Date.now,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    fail = err => res.status(500).send({message: err});

    check_duplicate(user.email, () => user.save((err, user) => {
        err ? fail(err) : res.send({ message: "User was registered successfully!" });
    }), fail);
});

module.exports = router;