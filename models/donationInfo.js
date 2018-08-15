const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let donationInfo = new Schema({
    name: String,
    price: Number,
    type: String,
    content: String,
    loaded: Boolean
});

module.exports = mongoose.model('donations', donationInfo);