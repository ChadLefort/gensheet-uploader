var env = process.env.NODE_ENV,
    errorHandler = require('errorhandler'),
    connection = require('express-myconnection'),
    mysql = require('mysql');

var config = {
    port: process.env.PORT
};

module.exports = function(app) {
    if (env == 'development') {
        app.use(errorHandler());
        app.use(
            connection(mysql, {
                host: process.env.DEV_DB_HOST,
                user: process.env.DEV_DB_USER,
                password: process.env.DEV_DB_PASSWORD,
                port: process.env.DEV_DB_PORT
            }, 'pool')
        );
    } else {
        app.use(
            connection(mysql, {
                host: process.env.PROD_DB_HOST,
                user: process.env.PROD_DB_USER,
                password: process.env.PROD_DB_PASSWORD,
                port: process.env.PROD_DB_PORT
            }, 'pool')
        );
    }

    return config;
};
