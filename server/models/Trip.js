var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TripsSchema   = new Schema({
    tripName: { type: String,required: true },
    tripDate: { type: Date,required: true },
    tripDescription : {type: String}
});

module.exports = mongoose.model('Trips', TripsSchema);