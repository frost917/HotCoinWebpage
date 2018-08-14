const fs = require('fs');

module.exports = function(app) {
    app.get('/', (req, res) => {
        res.render('index.html');
    });
    app.get('/about', (req, res) => {
        res.render('about.html');
    });
    app.post('/donation', (req, res) => {
        let jsonfile = JSON.stringify(req.body);
        /*heroku*/
        //fs.writeFile('../HotCoinDonation/data/form-data.json', jsonfile, 'utf-8', (err) => { if(err) throw err; });
        console.log('이름: ' + req.body.name);
        console.log('돈: ' + req.body.price);
        console.log('글: ' + req.body.paragraph);
    });
}