const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const app = express();
const http = require('http');
const server = http.createServer(app);
const io =  require('socket.io')(server);
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
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

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
    socket.on('skip', () => {
        io.emit('skip');
    });
});

const router = require('./router/main')(app, passport, io, Info, Counter, User);

server.listen((process.env.PORT || 3000), () => {
    console.log('start');
});