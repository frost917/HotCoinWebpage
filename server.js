const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const timeout = require('connect-timeout');

mongoose.connect(process.env.MONGODB_URI);
const Info = require('./models/donationInfo');
const Counter = require('./models/counter');

app.use(timeout('5s'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(haltOnTimedout);
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const io = require('./router/io')(server);
const router = require('./router/main')(app, Info, Counter);

function haltOnTimedout(req, res, next) {
    if(!req.timedout) next();
}

app.listen((process.env.PORT || 3000), () => {
    console.log('start');
});