require('dotenv').load();

var express = require('express'),
    app = express(),
    auth = require('http-auth'),
    config = require('./config/config')(app);

var error = function(err, req, res, next) {
    res.status(500);
    res.render('500', {
        title: '500: Internal Server Error',
        error: err.message
    });
    console.log('Server Error: ' + err);
};

require('./config/express')(app, error);
require('./config/hbs');

app.listen(config.port, '127.0.0.1');
console.log('Magic is happening on port ' + config.port + '!');