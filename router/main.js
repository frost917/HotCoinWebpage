const fs = require('fs');

module.exports = function(app, Info) {
    app.get('/', (req, res) => {
        res.render('index.html');
    });
    app.post('/donation', (req, res) => {
        let jsonfile = JSON.stringify(req.body);
        /*heroku*/
        //fs.writeFile('../HotCoinDonation/data/form-data.json', jsonfile, 'utf-8', (err) => { if(err) throw err; });
        console.log('이름: ' + req.body.name);
        console.log('돈: ' + req.body.price);
        console.log('글: ' + req.body.paragraph);
        

        let info = new Info();
        info.name = req.body.name;
        info.price = req.body.price;
        info.type = req.body.type.options[req.body.type.selectedIndex].value;
        info.content = req.body.paragraph;
        info.loaded = false;

        info.save((err) => {
            if(err) {
                console.error(err);
                res.json({result: 0});
                return;
            }
            //res.json({result: 1});
            res.render('donation.html');
        });
        
    });
    app.get('/donations', (req, res) => {
        Info.find((err, donations) => {
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(donations);
        });
    });
}