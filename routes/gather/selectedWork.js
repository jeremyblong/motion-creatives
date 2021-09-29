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

                const final_arr = [];

                for (let index = 0; index < user.posted_content.length; index++) {
                    const posted = user.posted_content[index];
                    
                    if (posted.featured === true) {
                        final_arr.push(posted);
                    }
                }
                
                res.json({
                    message: "Successfully gathered selected work!",
                    content: final_arr
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