const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const fs = require('fs');
const mongo = require("mongodb");
const config = require("config");
const cors = require('cors');
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
const wasabiEndpoint = new AWS.Endpoint('s3.us-west-1.wasabisys.com');
const _ = require("lodash");

const accessKeyId = config.get("wasabiAccessKey");
const secretAccessKey = config.get("wasabiSecretKey");


const s3 = new S3({
	endpoint: wasabiEndpoint,
	region: 'us-west-1',
	accessKeyId,
	secretAccessKey
});

// need to fix how many times res.json is sent - can't send multiple headers
mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
    router.post("/", (req, res) => {

        const database = db.db('users');

        const collection = database.collection("users");

        const { email, pictures } = req.body;

        collection.findOne({ email }).then((user) => {
            if (user) {
                console.log("user", user);

                const new_picture_arr = [];

                const promise = new Promise((resolve, reject) => {
                    for (let index = 0; index < pictures.length; index++) {

                        const generatedID = uuidv4();
    
                        const picture = pictures[index];
    
                        const bufferImage = new Buffer(picture.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                        
                        s3.putObject({
                            Body: bufferImage,
                            Bucket: "taylor-client-project",
                            Key: generatedID,
                            ContentEncoding: 'base64'
                        }, (errorr, dataaa) => {
                            if (errorr) {
                                console.log(errorr);
                            } else {
                                console.log(dataaa);

                                new_picture_arr.push(generatedID);
    
                                if ((pictures.length - 1) === (new_picture_arr.length - 1)) {
                                    resolve(new_picture_arr);
                                }
                            }
                        })
                    }
                });

                promise.then((pictures) => {
                    
                    if (user.bts_content) {
                        console.log("ran one");
                        user.bts_content = _.union(user.bts_content, pictures);
                    } else {
                        user["bts_content"] = pictures;
                    }

                    collection.save(user);

                    res.json({
                        message: "Successfully updated your photos to the BTS page!",
                        pictures: user.bts_content
                    })
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