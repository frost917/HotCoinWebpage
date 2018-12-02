const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});
module.exports = function(app, passport, io, Info, Counter, User) {
    app.get('/', (req, res) => {
        if(req.isAuthenticated()) {
            res.redirect('/home');
        }
        else {
            res.render('loginPage');
        }
    });

    app.get('/home', (req, res) => {
        if(!req.isAuthenticated()) {
            res.redirect('/');
            return;
        }

        res.render('home', {
            id: req.user.id,
            admin: isAdmin(req.user.id)
        });
    });

    app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));
    app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));
    app.get('/counter/get', (req, res) => {
        Counter.find((err, counters) => {
            res.json(counters);
        });  
    });

    app.get('/intro', (req, res) => {
        res.send('준비중입니다.');
    });

    app.get('/exchange', (req, res) => {
        res.send('준비중입니다.');
    });

    app.get('/support', (req, res) => {
        res.send('준비중입니다.');
    });

    app.get('/attendance', (req, res) => {
        res.send('준비중입니다.');
    });

    app.get('/shop', (req, res) => {
        res.send('준비중입니다.');
    });

    app.get('/profile', (req, res) => {
        res.send('준비중입니다.');
    });

    app.post('/counter/post', (req, res) => {
        Counter.update({ }, { $set: { count: req.body.count } }, (err, counters) => {
            res.send(counters);
        });
    });

    app.get('/coins/get', (req, res) => {
        User.find((err, users) => {
            res.json(users);
        });
    });

    app.post('/coins/post', (req, res) => {
        User.update({ id: req.body.id }, { $set: {  coin: req.body.coin } }, (err, users) => {
            res.send(users);
        });
    });

    app.route('/success')
    .get((req, res) => {
        res.render('donationSuccess.html');
    })

    app.get('/fail', (req, res) => {
        res.render('donationFail.html');
    });

    app.route('/donate')
    .get(csrfProtection, (req, res) => {
        if(req.isAuthenticated()) {
            User.findOne({ id: req.user.id }, (err, oneuser) => {
                res.render('donation', {
                    id: req.user.id,
                    coin: oneuser.coin,
                    admin: isAdmin(req.user.id),
                    csrfToken: req.csrfToken()
                });
                io.on('connection', function(socket) {
                    socket.on('getuser', () => {
                        io.emit('userdata', req.user);
                    });
                });
            });
        }
        else {
            res.redirect('/');
        }
    })
    .post(csrfProtection, (req, res) => {
        const donationObj = req.body;
        
        const image = donationObj.image;
        const name = donationObj.name;
        const price = parseInt(donationObj.price);
        const type = donationObj.types;
        const paragraph = donationObj.paragraph;
        const id = donationObj.id;
        const coin = parseInt(donationObj.coin);

        if(!name || price < 10 || !paragraph || paragraph.length > 200) {
            res.send('후원 오류.');
            return;
        }
        
        let info = new Info();
        info.userid = id;
        info.image = image;
        info.name = name;
        info.price = price;
        info.type = type;
        info.content = paragraph;

        info.save((err) => {
            if(err) {
                console.error(err);
                res.json({result: 0});
                return;
            }
            User.update({ id: id }, { $set: {  coin: coin-price } }, (err, users) => {
                console.log(id + ' ' + coin);
                io.emit('donated', donationObj);
                res.redirect('/success');
            });
        });
        console.log('ok');
    });

    app.get('/donations', (req, res) => {
        if(!req.isAuthenticated()) {
            res.redirect('/');
            return;
        }
        if(isAdmin(req.user.id)) {
            Info.find((err, donations) => {
                if(err) return res.status(500).send({error: 'database failure'});
                res.render('donationlist', {
                    data: JSON.stringify(donations)
                });
            });
        }
        else {
           res.redirect('/'); 
        }
        
    });

    app.get('/manage', (req, res) => {
        if(req.isAuthenticated()) {
            if(isAdmin(req.user.id)) {
                res.render('manage.html');
            }
            else {
                res.redirect('/');
            }
        }
        else {
            res.redirect('/');
        }
    });

    app.route('/manage/coin')
    .get(function(req, res) {
        if(req.isAuthenticated()) {
            if(isAdmin(req.user.id)) {
                res.render('coins');
            }
            else {
                res.redirect('/');
            }
        }
        else {
            res.redirect('/');
        }
    })
    .post(function(req, res) {
        User.findOne({ id: req.body.id }, (err, oneuser) => {
            if(oneuser) {
                usercoin = parseInt(oneuser.coin);
                usercoin += parseInt(req.body.coin);
                oneuser.coin = usercoin;
                oneuser.save((err) => {
                    if(err) {
                        console.error(err);
                        return;
                    }
                    res.redirect('/manage/coin');
                });
            }
            else {
                let newUser = new User();
                newUser.id = req.body.id;
                newUser.coin = req.body.coin;
                newUser.save((err) => {
                    if(err) {
                        console.error(err);
                        return;
                    }
                    res.redirect('/manage/coin');
                });
            }
        });
    });

    app.get('/view', (req, res) => {
        Counter.find((err, counters) => {
            let count = counters[0].count;
            console.log(count);
            res.render('view', {
                counter: count
            });
        });      
    });

    function isAdmin(id) {
        const listAdmin = ['wotjdeowkd', 'makukthegamer', 'wotjdwlqdlek'];
        return listAdmin.includes(id);
    }
}
