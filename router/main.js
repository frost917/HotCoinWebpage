module.exports = function(app, passport, io, Info, Counter, User) {
    app.get('/', (req, res) => {
        if(req.session && req.session.passport && req.session.passport.user) {
            console.log(req.session.passport.user);
            User.findOne({ id: req.session.passport.user.id }, (err, oneuser) => {
                res.render('index', {
                    id: req.session.passport.user.id,
                    coin: oneuser.coin
                });
                io.on('connection', function(socket) {
                    socket.on('getuser', () => {
                        io.emit('userdata', req.session.passport.user);
                    });
                });
            }) 
        }
        else {
            res.render('about.html');
        }
    });
    app.get('/about', (req, res) => {
        //res.render('about.html');
    });
    /*once create*/
    /*app.get('/counter', (req, res) => {
        let counter = new Counter();
        counter.count = 0;
        counter.save((err) => {
            if(err) {
                console.error(err);
                return;
            }
        });
        res.json(counter);
    });*/
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
    app.post('/donation', (req, res) => {
        console.log('이름: ' + req.body.name);
        console.log('돈: ' + req.body.price);
        console.log('글: ' + req.body.paragraph);
        
        if(!req.body.name || req.body.price <= 0 || !req.body.paragraph) {
            res.send('후원 오류. 빈칸이 있거나 후원 금액이 0 이하이지 않은지 확인하세요.');
            return;
        }

        if(req.body.price > req.body.coin) {
            res.render('donationFail.html');
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
            res.render('donation.html');
        });     
    });
    app.get('/donations', (req, res) => {
        Info.find((err, donations) => {
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(donations);
        });
    });
    app.get('/manage', (req, res) => {
        if(req.isAuthenticated()) {
            res.render('manage.html');
        }
        else {
            res.redirect('/');
        }
    });
    app.get('/view', (req, res) => {
        Counter.find((err, counters) => {
            //let obj = JSON.parse(counters[0]);
            let count = counters[0].count;
            //let count = 57;
            console.log(count);
            res.render('view', {
                counter: count
            });
        });      
    });
}