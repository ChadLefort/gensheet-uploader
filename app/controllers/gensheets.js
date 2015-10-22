var model = require('../models/gensheets'),
    moment = require('moment'),
    converter = require('json-2-csv');

module.exports = {
    gensheet: function(req, res) {
        var hullNumber = req.params.hullNumber,
            sheet = req.params.sheet;

        model.tables(req, hullNumber, function(err, results1) {
            if (err) {
                console.log('Error Selecting: %s ', err);
            }

            model.columns(req, hullNumber, sheet, function(err, results2) {
                if (err) {
                    console.log('Error Selecting: %s ', err);
                }

                model.gensheet(req, hullNumber, sheet, function(err, results3) {
                    if (err) {
                        console.log('Error Selecting: %s ', err);

                        res.render('404', {
                            title: '404: File Not Found'
                        });
                    } else {
                        res.render('gensheet', {
                            title: sheet,
                            hullNumber: hullNumber,
                            table: results1,
                            column: results2,
                            data: results3
                        });
                    }
                });
            });
        });
    },

    iolist: function(req, res) {
        var hullNumber = req.params.hullNumber;

        model.iolist(req, hullNumber, function(err, rows) {
            if (err) {
                console.log('Error Selecting: %s ', err);
            }

            var json2csvCallback = function(err, csv) {
                if (err) {
                    console.log('Error Converting CSV: ', err);
                }

                res.attachment(hullNumber + '-IOList-' + moment(Date.now()).format('MM-DD-YYYY-HH-mm') + '.csv');
                res.send(csv);
            };

            converter.json2csv(rows, json2csvCallback);
        });
    }
};
