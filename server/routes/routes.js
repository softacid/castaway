var User       = require('../models/user');
var Trip       = require('../models/trip');
var jwt        = require('jsonwebtoken');
var config     = require('../config');
var lwip = require('lwip');
var fs = require('fs');


// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

    var apiRouter = express.Router();

    // route to generate sample user
    /*apiRouter.post('/register', function(req, res) {

        //check user and don't allow duplicate username, email or phone
        User.findOne({$or: [{ 'username': (req.body.username).toLowerCase()}, {'email': req.body.email}, {'phone': req.body.phone}]}, function(err, user) {

            // if there is no user, create one
            if (!user) {
                var newUser = new User();

                newUser.name = req.body.name;
                newUser.username = (req.body.username).toLowerCase();
                newUser.password = req.body.password;
                newUser.email = (req.body.email).toLowerCase();
                newUser.phone = req.body.phone;
                newUser.save(function(err){
                    if (err) {
                        res.status(403).send({
                            success: false,
                            message: 'Failed to save user!' //+ err
                        });
                    } else {
                        res.json({
                            message: 'User created.'
                        });
                    }
                });

            } else {
                res.json({
                    message: 'User exist.'
                });
            }

        });

    });*/

    /**
     * TRIPS ROUTE
     */
    apiRouter.get('/trips', function(req, res) {

        Trip.find({}, function(err, trips) {
            if (err) res.send(err);

            trips.forEach(function(trip, key){

               /* Photos.find({tripId :trip._id}, function(err, photos) {
                    if (err) res.send(err);

                    var r = trip.toObject();
                    r.tripPhotos = photos.length;


                });*/
                /*Photos.count({tripId :trip._id}, function(err, c) {
                    console.log('Count is ' + c);
                    trips[key].tripPhotos = c;
                });*/
            });
            res.json(trips);
        });
    });

    apiRouter.post('/trips', isLoggedIn, function(req, res) {
        var newTrip = new Trip();
        newTrip.tripName = req.body.tripName || 'New Trip';
        newTrip.tripDate = req.body.tripDate || new Date();
        newTrip.tripDescription = req.body.tripDescription || 'N/A';
        newTrip.save(function(err){//consider upsert here
            if (err) {
                res.status(403).send({
                    success: false,
                    message: 'Failed to save trip!' + err
                });
            } else {
                res.json({
                    message: 'Trip saved.'
                });
            }
        });

    });

    apiRouter.get('/trip/:trip_id', function(req, res) {
        Trip.findById(req.params.trip_id, function(err, trip) {
            if (err) res.send(err);
            res.json(trip);
        });
    });

    apiRouter.put('/trip/:trip_id', function(req, res) {
        Trip.findById(req.params.trip_id, function(err, trip) {
            if (err) res.send(err);

            var values = req.body;

            Trip.update({_id: req.params.trip_id}, values, function(err, values) {
                if (!err) {
                    res.json("Trip updated");
                } else {
                    res.write("Update failed");
                }
            });

        });
    });

    apiRouter.delete('/trip/:trip_id', function(req, res) {
        Trip.findOne({'_id': req.params.trip_id}, function(err, trip){
            if (err) res.send(err);
            if(trip !== null){
               trip.tripPhotos.forEach(function (photo, key) {
                    fs.unlink('../client/uploads/' + photo.name, function (err) {
                        if (err) throw err;
                        console.log('successfully deleted ' + photo.name);
                    });
                });
            }
            Trip.remove({
                _id: req.params.trip_id
            }, function(err, trip) {
                if (err) res.send(err);
                res.send('Trip deleted!');
            });
        });
    });

    apiRouter.delete('/photo/:photo_id/trip/:trip_id', function(req, res) {
        Trip.findOne({'_id': req.params.trip_id}, function(err, trip){
                if (err) res.send(err);
                trip.tripPhotos.forEach(function(photo, key){
                    if(photo._id == req.params.photo_id){
                        fs.unlink('../client/uploads/' + photo.name, function(err) {
                            if (err) throw err;
                            console.log('successfully deleted ' + photo.name );
                        });
                    }
                });
        });

        Trip.findOneAndUpdate({'_id': req.params.trip_id},
            { $pull: { "tripPhotos" : { '_id': req.params.photo_id} } },
            function(err){
                if (err) res.send(err);
                res.send('photo deleted!');
            });

    });


    apiRouter.post('/upload/:trip_id', isLoggedIn, function(req, res) {
        var fileBuffer = req.file.buffer;
        var imgName = req.file.fieldname + '-' + Date.now();
        if(req.file.originalname.split('.').pop() !== 'jpg'){
            res.send('incorrect extension!, you should use only jpg files');
        }

        lwip.open(fileBuffer, 'jpg', function(err, image) {
            if (err) return console.log(err);
            var ratio = 200 / image.width();
            image.scale(ratio, function(err, img){
                img.writeFile('../client/uploads/' + imgName + '.jpg', function(err) {
                    if (err) throw err;
                        Trip.findById(req.params.trip_id, function(err, trip) {
                            var imageObj = {name: imgName + '.jpg'};
                            trip.tripPhotos.push(imageObj);

                            trip.save(function(err){
                                if (err) {
                                    res.status(403).send({
                                        success: false,
                                        message: 'Failed to save photo!' + err
                                    });
                                } else {
                                    res.json({
                                        message: 'Photo saved.'
                                    });
                                }
                            });
                        });
                    });
            });
        });


    });


    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRouter.post('/authenticate', function(req, res) {

        // find the user
        User.findOne({
            username: req.body.username
        }).select('name username password isActivated').exec(function(err, user) {

            if (err) throw err;

            // no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {
                if(user.isActivated){
                    // check if password matches
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({
                            success: false,
                            message: 'Authentication failed. Wrong password.'
                        });
                    } else {

                        // if user is found and password is right
                        // create a token
                        var token = jwt.sign({
                            userId: user._id,
                            name: user.name,
                            username: user.username
                        }, superSecret, {
                            expiresIn: 900
                        });

                        // return the information including token as JSON
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    }

                } else {
                    res.json ({
                        message: 'User is not activated!'
                    })
                }
            }


        });
    });

    apiRouter.get('/', isLoggedIn,  function(req, res){
        res.json({ message: 'im in !!!??' });
    });


    function isLoggedIn(req, res, next) {

        // do any checks you want to in here

        // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
        // you can do this however you want with whatever variables you set up
        /* if (req.user.authenticated)
         return next();
         // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
         res.redirect('/');*/


        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['authorization'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, superSecret, function(err, decoded) {
                console.log(err);
                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    next(); // make sure we go to the next routes and don't stop here
                }
            });

        } else {

            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    }

    // api endpoint to get user information
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });


    return apiRouter;
};