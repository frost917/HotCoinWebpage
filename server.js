const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const router = require('./router/main.js')(app);

let server = app.listen((process.env.PORT || 3000), () => {
    console.log('start');
});