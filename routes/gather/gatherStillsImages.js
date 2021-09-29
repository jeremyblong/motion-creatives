const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const fs = require('fs');
const mongo = require("mongodb");
const config = require("config");
const cors = require('cors');


mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
    router.post("/", (req, res) => {

        const database = db.db('users');

        const collection = database.collection("users");

        const { email } = req.body;

        collection.findOne({ email }).then((user) => {
            if (user) {
                console.log("user", user);

                if (user.stills_content) {
                    res.json({
                        message: "Successfully gathered images!",
                        images: user.stills_content
                    })
                } else {
                    res.json({
                        message: "Could NOT gather images...",
                        images: []
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