const fs = require('fs');
//const voice = require('responsivevoice');

module.exports = function(app, Info, Counter) {
    app.get('/', (req, res) => {
        res.render('index.html');
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
    app.get('/counter', (req, res) => {
        Counter.find((err, counters) => {
            res.json(counters);
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
    app.get('/view', (req, res) => {
        Counter.find((err, counters) => {
            //let obj = JSON.parse(counters[0]);
            //let count = counters[0].count;
            let count = 53;
            console.log(count);
            res.render('view', {
                counter: count
            });
        });      
    });
}