var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PhotosSchema   = new Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, required: true },
    tripPhoto: {type: String, required: true}
});

module.exports = mongoose.model('Photos', PhotosSchema);