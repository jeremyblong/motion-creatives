// import usable modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const config = require("config");
const http = require("http");
const { v4: uuidv4 } = require('uuid');
const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
const wasabiEndpoint = new AWS.Endpoint('s3.us-west-1.wasabisys.com');
const mongo = require("mongodb");
const server = http.createServer(app);
const io = require('socket.io')(server);
const moment = require("moment");
const toBuffer = require('blob-to-buffer');
const multer = require('multer');
const _ = require("lodash");
const fs = require("fs");

server.timeout = 1000 * 60 * 10;

const accessKeyId = config.get("wasabiAccessKey");
const secretAccessKey = config.get("wasabiSecretKey");


const s3 = new S3({
	endpoint: wasabiEndpoint,
	region: 'us-west-1',
	accessKeyId,
	secretAccessKey
});
// !important stuff...
const PORT = process.env.PORT || 5000;
const mongoDB = require("./config/db.js");
const { resolve } = require("path");
const { reject } = require("lodash");

mongoDB();

app.use('*', cors());

app.use(bodyParser.urlencoded({
  limit: "800mb",
  extended: false
}));
app.use(bodyParser.json({
	limit: "800mb"
}));

app.use('/public', express.static('public'));

app.use(express.json({limit: '800mb'}));
app.use(express.urlencoded({limit: '800mb', extended: true }));

// routes go here...
app.use("/authenticate", require("./routes/auth/sign_in.js"));
app.use("/gather/thumbnails/all", require("./routes/gather/gatherThumbnailsHome.js"));
app.use("/gather/unique/listing", require("./routes/gather/gatherIndividualListing.js"));
app.use("/upload/bts/content", require("./routes/post/uploadImagesBTS.js"));
app.use("/gather/bts/pictures", require("./routes/gather/btsGather.js"));
app.use("/upload/stills/content", require("./routes/post/uploadStillsContent.js"));
app.use("/gather/stills/pictures", require("./routes/gather/gatherStillsImages.js"));
app.use("/gather/selected/work", require("./routes/gather/selectedWork.js"));
app.use("/update/page/count/homepage", require("./routes/addPageCount.js"));
app.use("/gather/info/dashboard", require("./routes/gatherInfo.js"));
app.use("/gather/listing/unique", require("./routes/admin/individual/gatherIndividualPost.js"));
app.use("/delete/homepage/item", require("./routes/delete/deleteHomepageListing.js"));



const DIR = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

const upload = multer({
	storage: storage,
	limits: { fieldSize: 25 * 5024 * 5024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype === "video/mp4") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
 
mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
    app.post("/post/new/item", upload.array('pictures', 20), (req, res) => {

		const reqFiles = [];
	
		const url = req.protocol + '://' + req.get('host');

		console.log("req.files", req.files);

		for (var i = 0; i < req.files.length; i++) {
			reqFiles.push(url + '/uploads/' + req.files[i].filename)
   		}

		console.log("runnning.......", reqFiles);

        const { 
            email,
            main,
            title, 
            clientName, 
            producerName, 
            mainDirector, 
            directorPhotography, 
            description, 
            executive, 
            production, 
            productionCompany, 
            editor, 
            colorist, 
			lab,
			checked,
			videos
        } = req.body;

        const database = db.db('users');

		const collection = database.collection("users");
		
		const uploaded_images = [];

		const isTrueSet = (checked == 'true');

        collection.findOne({ email }).then((user) => {
            console.log(user);
            if (user) {

				const promise = new Promise((resolve, reject) => {
					for (let index = 0; index < req.files.length; index++) {
						const file = req.files[index];

						console.log("file!!!", file);

						const generatedIDDD = uuidv4();

						if (file.mimetype === "video/mp4") {
							fs.readFile(file.path, (err, readData) => {
								s3.putObject({
									Body: readData,
									Bucket: "taylor-client-project",
									Key: generatedIDDD
								}, (errorr, dataaa) => {
									if (errorr) {
									console.log(errorr);
									} else {
										console.log(dataaa);
									}
								}).on('httpUploadProgress', function(evt) {
									console.log('Progress:', evt.loaded, '/', evt.total); 
				
				
									io.sockets.emit("progress", {
										current: evt.loaded,
										total_load: evt.total,
										unique_id: user.unique_id
									});
				
									if (evt.loaded === evt.total) {
										console.log("total - equal");
										
										uploaded_images.push({
											image: generatedIDDD,
											type: "video"
										});
	
										if ((uploaded_images.length - 1) === (req.files.length - 1)) {
											resolve(uploaded_images);
										}
									}
								});
							})
						} else {
						
							fs.readFile(file.path, function (err, readData) {
								if (err) {
									throw err; 
								};
								s3.putObject({
									Body: readData,
									Bucket: "taylor-client-project",
									Key: generatedIDDD
								}, (errorr, dataaa) => {
									if (errorr) {
									console.log(errorr);
									} else {
										console.log(dataaa);
		
										uploaded_images.push({
											image: generatedIDDD,
											type: "image"
										});

										if ((uploaded_images.length - 1) === (req.files.length - 1)) {
											resolve(uploaded_images);
										}
									}
								})
							});
						}
					}
				})

				promise.then((pictures) => {
					console.log(pictures);

					const shuffled = _.shuffle(pictures).slice(0, 5);

					const thumbnail_array = [];

					for (let indexxx = 0; indexxx < shuffled.length; indexxx++) {
						const element = shuffled[indexxx];
						thumbnail_array.push(element.image);	
					}

					if (user.posted_content) {
						user.posted_content.push({
							system_date: Date.now(),
							date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
							title: title.length > 0 ? title : "",
							client_name: clientName.length > 0 ? clientName : "",
							producer_name: producerName.length > 0 ? producerName : "",
							main_director: mainDirector.length > 0 ? mainDirector : "",
							producer_name: producerName.length > 0 ? producerName : "",
							director_photography: directorPhotography.length > 0 ? directorPhotography : "",
							description: description.length > 0 ? description : "",
							executive: executive.length > 0 ? executive : "",
							production: production.length > 0 ? production : "",
							production_co: productionCompany.length > 0 ? productionCompany : "",
							editor: editor.length > 0 ? editor : "",
							colorist: colorist.length > 0 ? colorist : "",
							lab: lab.length > 0 ? lab : "",
							main_images: pictures ? pictures : [],
							thumbnail_images: pictures ? thumbnail_array : [],
							id: uuidv4(),
							featured: isTrueSet
						});

						collection.save(user);

						res.json({
							message: "Successfully posted your new item!"
						})
					} else {
						user["posted_content"] = [{
							system_date: Date.now(),
							date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
							title: title.length > 0 ? title : "",
							client_name: clientName.length > 0 ? clientName : "",
							producer_name: producerName.length > 0 ? producerName : "",
							main_director: mainDirector.length > 0 ? mainDirector : "",
							producer_name: producerName.length > 0 ? producerName : "",
							director_photography: directorPhotography.length > 0 ? directorPhotography : "",
							description: description.length > 0 ? description : "",
							executive: executive.length > 0 ? executive : "",
							production: production.length > 0 ? production : "",
							production_co: productionCompany.length > 0 ? productionCompany : "",
							editor: editor.length > 0 ? editor : "",
							colorist: colorist.length > 0 ? colorist : "",
							lab: lab.length > 0 ? lab : "",
							main_images: pictures ? pictures : [],
							thumbnail_images: pictures ? thumbnail_array : [],
							id: uuidv4(),
							featured: isTrueSet
						}]

						collection.save(user);

						res.json({
							message: "Successfully posted your new item!"
						})
					}
				})
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

app.get('*', cors(), function(_, res) {
  res.sendFile(__dirname, './client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    };
  };
});

app.get('/*', cors(), function(_, res) {
  res.sendFile(__dirname, './client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    };
  };
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

if (process.env.NODE_ENV === "production") {
	// Express will serve up production files
	app.use(express.static("client/build"));
	// serve up index.html file if it doenst recognize the route
	app.get('*', cors(), function(_, res) {
	  res.sendFile(__dirname, './client/build/index.html'), function(err) {
	    if (err) {
	      res.status(500).send(err)
	    }
	  }
	})
	app.get('/*', cors(), function(_, res) {
	  res.sendFile(path.join(__dirname, './client/build/index.html'), function(err) {
	    if (err) {
	      res.status(500).send(err)
	    }
	  })
	})
}; 
io.on("connection", socket => {

	console.log("New client connected");
  
	socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}!`);
});