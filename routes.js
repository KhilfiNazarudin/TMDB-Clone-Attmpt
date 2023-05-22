var moveController = require('./controllers/movieController')
//Import from array to mongoDB
var passedOn = require('./importArrays')
//passedOn.port();
var crypto = require('crypto');


var express = require('express');
var moveController = require('./controllers/movieController')
var db = require('./services/dataservice.js');
var router = require('express').Router();
db.connect();

//TO READ DATA FROM FORM
router.use(express.urlencoded({
    extended: true
}));

// Register
router.post('/register', function (req, res) {
    var data = req.body;
    db.registerUser(data.name, data.username, data.password, data.role, function (err, user) {
        if (err) {
            res.status(500).send("Unable to register a new user");
        } else {
            res.status(200).send("A new user has been registered!");
        }
    })
});

// Login
router.post('/login', function (req, res) {
    var data = req.body;
    db.login(data.username, data.password, function (err, user) {
        if (err) {
            res.status(401).send("Login unsucessful. Please try again later");
        } else {
            if (user == null) {
                res.status(401).send("Wrong Username or password");
            } else {
                var strToHash = user.username + Date.now();
                var token = crypto.createHash('md5').update(strToHash).digest('hex');
                db.updateToken(user._id, token, function (err, user) {
                    res.status(200).json({ 'message': 'Login successful.', 'token': token, 'userId': user._id });
                    
                });


            }
        }
    })


});

// Logout
router.get("/logout", function (req, res) {
    var token = req.query.token;
    if (token == undefined) {
        res.status(401).send("No tokens are provided");
    } else {
        db.checkToken(token, function (err, organizer) {
            if (err || organizer == null) {
                res.status(401).send("Invalid token provided");
            } else {
                db.removeToken(organizer._id, function (err, user) {
                    res.status(200).send("Logout successfully")
                });
            }
        })
    }
})

// Submit Feedback
router.post('/submitFeedback', function (req, res) {
    var data = req.body;
    db.submitFeedback(data.email, data.title, data.feedback,
        function (err, event) {
            if (err) {
                res.status(500).send("Unable to submit the feedback");
            } else {
                res.status(200).send("Feedback submitted succesfully");
            }
        })
});

router.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/movies/index.html");
});

router.get('/css/*', function (req, res) {
    // req.originalUrl is “/css/style.css” in our http request   
    res.sendFile(__dirname + "/views/" + req.originalUrl);
});

router.get('/js/*', function (req, res) {
    // req.originalUrl is “/js/jquery.min.js” in our http request   
    res.sendFile(__dirname + "/views/" + req.originalUrl);
});

router.get('/images/*', function (req, res) {
    // req.originalUrl is “/js/jquery.min.js” in our http request   
    res.sendFile(__dirname + req.originalUrl);
});


router.get('/movieDetails', function (req, res) {
    res.sendFile(__dirname + "/views/movies/movieDetails.html");
});

router.get('/reviews/:id', function (req, res) {
    var id = req.params.id;
    db.getAReview(id, function (err, review) {
        if (err) {
            console.log(err)
            res.status(500).send("Unable to find reviews with this id");
        } else {
            var array = [];
            review.forEach(element => {
                var rv = {}
                rv = {
                    "Author": element.user.name,
                    "Title": element.title,
                    "Review": element.review
                }
                array.push(rv)

            });
            res.status(200).send(array);

        }
    })
});

router.use(function (req, res, next) {
    //only check for token if it is PUT, DELETE methods or it is POSTING to events
    if (req.url.includes("/account")) {
        var token = req.query.token;
        console.log(token)
        if (token == undefined) {
            res.status(401).send("No tokens are provided. You are not allowed to perform this action.");
        } 
    }
    if (req.url.includes("/manage")) {
        var token = req.query.token;
        if (token == undefined) {
            res.status(401).send("No tokens are provided. You are not allowed to perform this action.");
        } else {
            db.checkRole(token, function (err, admin) {
                if (err || admin == null) {
                    res.status(401).send("You are not an admin");
                } else {
                    //set a local variable to be used for the next route
                    res.locals.admin = admin;
                    //means proceed on with the request.
                    next();
                }
            });
        }
    } else {    //all other routes will pass
        next();
    }
});
// # Submit Review 
router.post('/account/submitReview', function (req, res) {
    var data = req.body;
    db.submitReview(data.movieId, data.title, data.review, data.userId,
        function (err, event) {
            if (err) {
                res.status(500).send("Unable to submit the review");
            } else {
                res.status(200).send("Review submitted succesfully");
            }
        })
});
// # Get manage page
router.get("/manage", function (req, res) {
    res.sendFile(__dirname + "/views/manage/managePage.html");
})

// # Get All Users .admin
router.get("/manage/users", function (req, res) {
    db.getUsers(function (err, users) {
        if (err) {
            res.status(500).send("Unable to get the users");
        } else {
            var array = [];
            users.forEach(element => {
                var u = {}
                u = {
                    "_id": element._id,
                    "name": element.name,
                    "username": element.username,
                    "token": element.token
                }
                array.push(u)

            });
            res.status(200).send(array);
        }
    })
})

// # Delete a User .admin
router.delete("/manage/users", function (req, res) {
    var userId = req.body.userId
    console.log("delete the user db" + userId)
    db.deleteUser(userId, function (err, users) {
        if (err) {
            res.status(500).send("Unable to delete the user");
        } else {
            res.status(200).send("User is deleted");
        }
    })
})

// # Get All Feedbacks .admin
router.get("/manage/feedbacks", function (req, res) {
    db.getFeedbacks(function (err, feedbacks) {
        if (err) {
            res.status(500).send("Unable to get the feedbacks");
        } else {
            var array = [];
            feedbacks.forEach(element => {
                var f = {}
                f = {
                    "_id": element._id,
                    "email": element.email,
                    "title": element.title,
                    "feedback": element.feedback
                }
                array.push(f)

            });
            res.status(200).send(array);
        }
    })
})

// # Delete a feedback .admin
router.delete("/manage/feedbacks", function (req, res) {
    var feedbackId = req.body.feedbackId
    db.deleteFeedback(feedbackId, function (err, feedback) {
        if (err) {
            res.status(500).send("Unable to delete the feedback");
        } else {
            res.status(200).send("Feedback is deleted");
        }
    })
})

// # View profile page
router.get('/account', function (req, res) {
    res.sendFile(__dirname + "/views/profile/profile.html");
});

// # Get user by token
router.get('/account/getUser/:token', function (req, res) {
    var token = req.params.token;
    db.getAUser(token, function (err, user) {
        if (err) {
            console.log(err)
            res.status(500).send("Unable to find reviews with this token, please log in ");
        } else {

            res.status(200).send(user);

        }
    })
});

// # Update user
router.put('/account/profile/:id', function (req, res) {
    var id = req.params.id;
    var data = req.body
    db.updateUser(id, data.newName, data.newUsername, data.newPassword, function (err, user) {
        if (err) {
            console.log(err)
            res.status(500).send("Cant update this user");
        } else {

            res.status(200).send(user);

        }
    })
});

// # Update userprofile pic
var formidable = require('formidable');
var fs = require('fs');
const { nextTick } = require('process');
router.post('/uploadImage', function (req, res) {
    var fileName;
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var uid = fields.userIdForUpload;
        var oldpath = files.profile_image.filepath;
        var newpath = __dirname + "/images/users/" + uid + '.png';
        fs.rename(oldpath, newpath, function (err) {
            if (err) console.log(err);

            res.write('File uploaded and moved!');

        })
    },
    )
    res.sendFile(__dirname + "/views/movies/index.html");

});
module.exports = router