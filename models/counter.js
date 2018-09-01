const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let counter = new Schema({
    count: Number
});

module.exports = mongoose.model('counter', counter);