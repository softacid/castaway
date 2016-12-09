var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TripsSchema   = new Schema({
    tripName: { type: String,required: true },
    tripDate: { type: Date,required: true },
    tripDescription : {type: String},
    tripPhotos: [{
            name: String
        }]
});


/*Photos.count({tripId :trip._id}, function(err, c) {
    console.log('Count is ' + c);
    trips[key].tripPhotos = c;
});*/
module.exports = mongoose.model('Trips', TripsSchema);