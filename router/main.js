module.exports = function(app, passport, io, Info, Counter, User) {
    app.get('/', (req, res) => {
        res.render('about', {
            login: req.isAuthenticated()
        });
    });
    app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));
    app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));
    app.get('/counter/get', (req, res) => {
        Counter.find((err, counters) => {
            res.json(counters);
        });  
    });
    app.post('/counter/post', (req, res) => {
        Counter.update({ }, { $set: { count: req.body.count } }, (err, counters) => {
            res.send(counters);
        });
    });
    app.get('/coinlist', (req, res) => {
        User.find((err, users) => {
            res.render('coinlist', {
                users: JSON.stringify(users)
            });
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
    app.post('/success', (req, res) => {
        if(!req.body.name || req.body.price <= 0 || !req.body.paragraph) {
            res.send('후원 오류. 빈칸이 있거나 후원 금액이 0 이하이지 않은지 확인하세요.');
            return;
        }

        if(req.body.price > req.body.coin) {
            res.redirect('/fail');
            return;
        }

        let info = new Info();
        info.name = req.body.name;
        info.price = req.body.price;
        info.type = req.body.types;
        info.content = req.body.paragraph;
        info.loaded = false;

        info.save((err) => {
            if(err) {
                console.error(err);
                res.json({result: 0});
                return;
            }
            User.update({ id: req.body.id }, { $set: {  coin: req.body.coin-req.body.price } }, (err, users) => {
                console.log(req.body.id + ' ' + req.body.coin);
                res.render('donationSuccess.html');
            });
        });    
        
    });
    app.get('/fail', (req, res) => {
        res.render('donationFail.html');
    });
    app.get('/donate', (req, res) => {
        if(req.isAuthenticated()) {
            User.findOne({ id: req.user.id }, (err, oneuser) => {
                res.render('donation', {
                    id: req.user.id,
                    coin: oneuser.coin
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
    });
    app.get('/donations', (req, res) => {
        Info.find((err, donations) => {
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(donations);
        });
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
                res.render('coins.html');
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
        const listAdmin = ['wotjdeowkd', 'makukthegamer'];
        return listAdmin.includes(id);
    }
}