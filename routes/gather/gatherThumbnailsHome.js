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
    router.get("/", (req, res) => {

        const database = db.db('users');

        const collection = database.collection("users");

        collection.find({ }).toArray((err, users) => {
            if (users) {
                for (let index = 0; index < users.length; index++) {
                    const user = users[index];
                    
                    console.log('user', user);

                    res.json({
                        posts: user.posted_content,
                        message: "Successfully gathered posts!"
                    })
                }
            } else {
                res.json({
                    message: "Could NOT find user..."
                })
            }
        })
    });
});

module.exports = router;