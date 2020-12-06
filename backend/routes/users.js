const jwt = require("jsonwebtoken");
const config = require("../config/keys.js");
const bcrypt = require("bcryptjs");

const express = require('express');
const router = express.Router();

const User = require('../models/User.model.js');

const check_duplicate = (email, callback, fail) => {
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

const token = id => jwt.sign({ id: id }, config.secret, {
    expiresIn: 86400 // 24 hours
});

const register = (req, res) => {
    console.log("registering!");
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        date: Date.now(),
        password: bcrypt.hashSync(req.body.password, 8)
    });

    const fail = err => {
        console.log(err);
        res.status(500).send({message: err});
    };

    check_duplicate(user.email, () => user.save((err, user) => {
        err ? fail(err) : res.send({
            id: user._id,
            name: user.name,
            email: user.email,
            date: user.date,
            accessToken: token(user._id)
        });
    }), fail);
};

router.post('/login', (req, res) => {
    console.log("logging in!");
    User.findOne({
        email: req.body.email
    })
        .exec((err, user) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                console.log("user not found, registering");
                return register(req, res);
                // return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                console.log("invalid pass");
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            res.status(200).send({
                id: user._id,
                name: user.name,
                email: user.email,
                date: user.date,
                accessToken: token(user.id)
            });
        });
});

router.post('/register', register);


module.exports = router;