const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const fs = require('fs');
const mongo = require("mongodb");
const config = require("config");
const cors = require('cors');


mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
    router.get("/", (req, res) => {

        const database = db.db('users');

        const collection = database.collection("users");

        const { email } = req.query;
        
        collection.findOne({ email }).then((user) => {
            if (user) {

                let total_listings = 0;

                for (let index = 0; index < user.posted_content.length; index++) {
                    total_listings += 1;
                }
                if (user.bts_content) {
                    for (let index = 0; index < user.bts_content.length; index++) {
                        total_listings += 1;
                    }
                }
                if (user.stills_content) {
                    for (let index = 0; index < user.stills_content.length; index++) {
                        total_listings += 1;
                    }
                }

                res.json({
                    message: "Gathered info!",
                    count: user.count,
                    total_listings,
                    user
                })
            } else {
                res.json({
                    message: "Could NOT find user..."
                })
            }
        })
    });
});

module.exports = router;