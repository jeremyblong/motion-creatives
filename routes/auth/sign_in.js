const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const fs = require('fs');
const mongo = require("mongodb");
const config = require("config");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

// need to fix how many times res.json is sent - can't send multiple headers
mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
    router.post("/", (req, res) => {

        const { 
            email,
            password,
            remember 
        } = req.body;

        const specific_db = db.db('users');

        const collection = specific_db.collection("users");

        const trimmedEmail = email.toLowerCase().trim();

        collection.findOne({ email: trimmedEmail }).then((user) => {
            console.log(user);
            if (user) {
                if (user.email === email.toLowerCase().trim() && user.password === password) {
                    res.json({
                        message: "Found the desired registered user!",
                        user
                    })
                } else {
                    res.json({
                        message: "Password/email did match our records..."
                    })
                }
            } else {
                res.json({
                    message: "Could NOT find user..."
                })
            }
        }).catch((err) => {
            console.log(err);
        })
    });
});

module.exports = router;