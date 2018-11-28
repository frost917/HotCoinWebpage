const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const csrf = require('csurf');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const app = express();
const http = require('http');
const server = http.createServer(app);
const io =  require('socket.io')(server);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET = process.env.TWITCH_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CALLBACK_URL = 'http://hotsorry.herokuapp.com/auth/twitch/callback';

mongoose.connect(process.env.MONGODB_URI);
const Info = require('./models/donationInfo');
const Counter = require('./models/counter');
const User = require('./models/user');


app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({ 
        name: 'sessionId',
        secret: SESSION_SECRET, 
        resave: false, 
        saveUninitialized: false 
    })
);
app.use(csrf({ cookie: false }));
app.use(passport.initialize());
app.use(passport.session());

OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
    let options = {
        url: 'https://api.twitch.tv/kraken/user',
        method: 'GET',
        headers: {
            'CLIENT-ID': TWITCH_CLIENT_ID,
            'ACCEPT': 'application/vnd.twitchtv.v5+json',
            'Authorization': 'OAuth ' + accessToken
        }
    };

    request(options, function(error, response, body) {
        if(response && response.statusCode == 200) {
            done(null, JSON.parse(body));
        }
        else {
            done(JSON.parse(body));
        }
    });
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use('twitch', new OAuth2Strategy({
        authorizationURL: 'https://api.twitch.tv/kraken/oauth2/authorize',
        tokenURL: 'https://api.twitch.tv/kraken/oauth2/token',
        clientID: TWITCH_CLIENT_ID,
        clientSecret: TWITCH_SECRET,
        callbackURL: CALLBACK_URL,
        state: true
    },
    function(accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;

        User.findOne({ id: profile.name }, (err, user) => {
            if(err) return done(err);
            if(user) {
                return done(null, user);
            }
            else {
                let newUser = new User();
                newUser.id = profile.name;
                newUser.coin = 0;

                newUser.save((err) => {
                    if(err) throw err;
                    return done(null, newUser);
                })
            }
        })
        //done(null, profile);
    }
));

io.on('connection', function(socket) {
    socket.on('donated', (data) => {
        console.log('got socket');
        io.emit('donated', data);
    });
    socket.on('skip', () => {
        io.emit('skip');
    });
    socket.on('pause', () => {
        io.emit('pause');
    });
    socket.on('resume', () => {
        io.emit('resume');
    });
    socket.on('replay', (num) => {
        io.emit('replay', 'num');
    });
});

const router = require('./router/main')(app, passport, io, Info, Counter, User);

server.listen((process.env.PORT || 3000), () => {
    console.log('start');
});