var mongoose = require('mongoose');
var topupSchema = mongoose.Schema({
    name: String,
    description: String,
    location: { lat: Number, lng: Number },
    history: {
        event: String,
        notes: String,
        email: String,
        date: Date,
    },
    updateId: String,
    approved: Boolean,
});
var Topup = mongoose.model('Topup', attractionSchema);
module.exports = Topup;