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

        const { id } = req.body;
        
        collection.findOne({ "posted_content.id": id }).then((user) => {
            if (user) {

                for (let index = 0; index < user.posted_content.length; index++) {
                    const item = user.posted_content[index];
                    
                    if (item.id === id) {
                        console.log("item", item);

                        user.posted_content.splice(index, 1);

                        collection.save(user);
                        
                        res.json({
                            message: "Successfully deleted the selected item!"
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