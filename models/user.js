const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = new Schema({
    id: String,
    coin: Number
});

module.exports = mongoose.model('user', user);