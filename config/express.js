var express = require('express'),
    compression = require('compression'),
    auth = require('http-auth'),
    hbs = require('hbs'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    moment = require('moment'),
    fs = require('fs'),
    favicon = require('serve-favicon'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    csrf = require('csurf'),
    connectDomain = require('connect-domain');

module.exports = function(app, error) {
    app.use(compression());
    app.set('views', 'app/views');
    app.set('view engine', 'html');
    app.engine('html', hbs.__express);
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(multer({
        dest: './public/uploads',
        rename: function(fieldname, filename) {
            return filename.toLowerCase() + '-' + moment(Date.now()).format('MM-DD-YYYY-HH-mm');
        },
        onFileUploadStart: function(file) {
            if (file.extension != 'xlsx' &&
                file.extension != 'xlsm' &&
                file.extension != 'xltm' &&
                file.extension != 'xls' &&
                file.extension != 'csv' &&
                file.extension != 'png' &&
                file.extension != 'jpg' &&
                file.extension != 'jpeg' &&
                file.extension != 'bmp') {
                return false;
            }
        },
        limits: {
            fileSize: 10240 * 1024, // 10 MB
            files: 2,
            fields: 2
        },
        onFileSizeLimit: function(file) {
            console.log('Failed: ', file.originalname);
            fs.unlink('./' + file.path); // delete the partially written file
        }
    }));
    app.use(express.static('public'));
    app.use(favicon(__dirname + '/../public/img/favicon.ico'));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 60000
        },
        resave: true,
        saveUninitialized: true
    }));
    app.use(flash());
    app.use(function(req, res, next) {
        res.locals.successMessages = req.flash('successMessages');
        next();
    });
    app.use(csrf());
    app.use(connectDomain());
    require('./routes')(app, error);
    app.use(function(req, res) {
        res.status(404);
        res.render('404', {
            title: '404: File Not Found'
        });
    });
};
