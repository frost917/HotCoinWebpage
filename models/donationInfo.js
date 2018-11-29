const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let donationInfo = new Schema({
    userid: String,
    donatedTime: { type: Date, default: Date.now },
    image: String,
    name: String,
    price: Number,
    type: String,
    content: String
});

module.exports = mongoose.model('donations', donationInfo);