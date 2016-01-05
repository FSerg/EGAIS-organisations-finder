var express = require('express');
var app = express(); // create our app w/ express

var mongoose = require('mongoose'); // mongoose for mongodb
var Item = require('./item');

var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var config = require('./config');


app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());


mongoose.connect(config.database, {auth: { authdb: 'admin' }}, function(err) {
    // console.log('Connection string: '+config.database); // for debugging only
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to DB!');
    }
});

app.get('/org/:inn', function(req, res, next) {

    console.log('Сделан запрос: '+req.params.inn);

    Item.find({inn:req.params.inn}, function(err, org) {
        if (err) {
            console.log('Error find Org by INN in database: ' + err);
            return next(err);
        }
        res.send(org);
    });
});

app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// Start up
app.listen(config.port, function(){
  console.log('Express server listening on port: '+config.port);
});
