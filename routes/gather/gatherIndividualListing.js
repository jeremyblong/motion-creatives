const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const fs = require('fs');
const mongo = require("mongodb");
const config = require("config");
const cors = require('cors');

// need to fix how many times res.json is sent - can't send multiple headers
mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
    router.post("/", (req, res) => {

        const database = db.db('users');

        const collection = database.collection("users");

        const { id } = req.body;

        collection.findOne({ "posted_content.id": id }).then((user) => {
            if (user) {
                console.log("user", user);

                for (let index = 0; index < user.posted_content.length; index++) {
                    const data = user.posted_content[index];
                    
                    if (data.id === id) {
                        res.json({
                            message: "Successfully gathered the unique listing!",
                            post: data,
                            posted_content: user.posted_content
                        })
                    }
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