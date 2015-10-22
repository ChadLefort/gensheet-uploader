var model = require('../models/hulls'),
    fs = require('fs'),
    validator = require('validator'),
    pythonShell = require('python-shell'),
    rmdir = require('rimraf'),
    pagination = require('pagination');

module.exports = {
    add: function(req, res) {
        res.render('index', {
            title: 'Gensheet Uploader',
            csrf: req.csrfToken()
        });
    },

    help: function(req, res) {
        res.render('help', {
            title: 'Help'
        });
    },

    validate: function(req, res) {
        var input = JSON.parse(JSON.stringify(req.body));

        model.validate(req, input, function(err, rows) {
            var isAvailable;

            if (err) {
                console.log('Error Selecting: %s ', err);
            }

            if (rows[0].count > 0) {
                isAvailable = false;
            } else {
                isAvailable = true;
            }

            res.send({
                valid: isAvailable
            });
        });
    },

    save: function(req, res) {
        var errors = [],
            input = JSON.parse(JSON.stringify(req.body)),
            data = {
                number: input.hullNumber,
                name: input.hullName
            };

        // Server side text input fields validation.
        if (validator.isNull(input.hullNumber)) {
            errors.push({
                error: 'Hull number is a required field!'
            });
        }

        if (typeof req.files.gensheet == 'undefined') {
            errors.push({
                error: 'A gensheet is required!'
            });
        }

        // Server side file input validation.
        if (typeof req.files.gensheet != 'undefined') {
            if (req.files.gensheet.extension != 'xlsx' &&
                req.files.gensheet.extension != 'xlsm' &&
                req.files.gensheet.extension != 'xltm' &&
                req.files.gensheet.extension != 'xls' &&
                req.files.gensheet.extension != 'csv') {
                errors.push({
                    error: 'Gensheet is not a valid format!'
                });
            }

            if (req.files.gensheet.size > 5000000) {
                errors.push({
                    error: 'Gensheet filesize is too large!'
                });
            }
        }

        if (typeof req.files.image != 'undefined') {
            if (req.files.image.extension != 'jpg' &&
                req.files.image.extension != 'jpeg' &&
                req.files.image.extension != 'png' &&
                req.files.image.extension != 'bmp') {
                errors.push({
                    error: 'Image is not a valid format!'
                });
            }

            if (req.files.image.size > 5000000) {
                errors.push({
                    error: 'Image filesize is too large!'
                });
            }
        }

        // If gensheet and image files exist then we add them to the data array.
        if (typeof req.files.gensheet != 'undefined') {
            data.gensheet = req.files.gensheet.name;
        }

        if (typeof req.files.image != 'undefined') {
            data.image = req.files.image.name;
        }

        if (validator.isNull(input.hullName)) {
            data.search = input.hullNumber + ' - No Name';
        } else {
            data.search = input.hullNumber + ' - ' + input.hullName;
        }

        // Checking to see if the hull number or name already exist.
        model.validate(req, input, function(err, rows) {
            if (err) {
                console.log('Error Selecting: %s ', err);
            }

            if (rows[0].count > 0) {
                errors.push({
                    error: 'That hull number or name already exist!'
                });
            }

            // If client side validation fails then we send the server side errors.
            if (errors.length > 0) {
                res.render('index', {
                    alert: errors,
                    postback: data
                });
            } else {
                model.save(req, data, function(err, rows) {
                    if (err) {
                        console.log('Error Inserting: %s ', err);
                    }

                    req.flash('successMessages', 'Hull number ' + input.hullNumber + ' has been added.');
                    res.redirect('/database/page/1');
                });

                // Run python script to insert gensheet into the database.
                pythonShell.run('../app/scripts/createDb.py', function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    },

    list: function(req, res) {
        var page = req.params.page,
            perPage = 10,
            start = (page - 1) * perPage;

        model.list(req, start, perPage, function(err, rows) {
            if (err) {
                console.log('Error Selecting: %s ', err);
            }

            model.count(req, function(err, rows2) {
                var boostrapPaginator = new pagination.TemplatePaginator({
                    prelink: '/database/',
                    current: page,
                    rowsPerPage: perPage,
                    totalResult: rows2[0].count,
                    slashSeparator: true,
                    template: function(result) {
                        var i, len, prelink;
                        var html = '<div><ul class="pagination">';
                        if (result.pageCount < 2) {
                            html += '</ul></div>';
                            return html;
                        }
                        prelink = this.preparePreLink(result.prelink);
                        if (result.previous) {
                            html += '<li><a href="' + prelink + result.previous + '">' + this.options.translator('PREVIOUS') + '</a></li>';
                        }
                        if (result.range.length) {
                            for (i = 0, len = result.range.length; i < len; i++) {
                                if (result.range[i] === result.current) {
                                    html += '<li class="active"><a href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
                                } else {
                                    html += '<li><a href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
                                }
                            }
                        }
                        if (result.next) {
                            html += '<li><a href="' + prelink + result.next + '" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
                        }
                        html += '</ul></div>';
                        return html;
                    }
                });

                res.render('database', {
                    title: 'Hull List',
                    csrf: req.csrfToken(),
                    data: rows,
                    count: rows2[0].count,
                    pagination: boostrapPaginator.render()
                });
            });
        });
    },

    typeahead: function(req, res) {
        var data = [],
            typeahead = '%' + req.query.key + '%';

        model.typeahead(req, typeahead, function(err, rows) {
            if (err) {
                console.log('Error Selecting: %s ', err);
            }

            for (var i in rows) {
                data.push(rows[i].search);
            }
            res.end(JSON.stringify(data));
        });
    },

    search: function(req, res) {
        var input = JSON.parse(JSON.stringify(req.body)),
            search = '%' + input.typeahead + '%';

        model.search(req, search, function(err, rows) {
            if (err) {
                console.log('Error Selecting: %s ', err);
            }

            res.render('database', {
                title: 'Search Results',
                csrf: req.csrfToken(),
                data: rows
            });
        });
    },

    info: function(req, res) {
        var hullNumber = req.params.hullNumber;

        model.info(req, hullNumber, function(err, rows) {
            if (err) {
                console.log('Error Selecting: %s ', err);
            }

            if (rows.length > 0) {
                res.render('hull', {
                    title: 'Hull Info',
                    csrf: req.csrfToken(),
                    data: rows
                });
            } else {
                res.render('404', {
                    title: '404: File Not Found'
                });
            }
        });
    },

    delete: function(req, res) {
        var hullNumber = req.params.hullNumber;

        model.info(req, hullNumber, function(err, rows) {
            if (err) {
                console.log('Error Selecting: %s ', err);
            }

            // Delete the gensheet.
            fs.unlink('public/uploads/' + rows[0].gensheet, function(err) {
                if (err) {
                    console.log('Erorr Deleting: ' + rows[0].gensheet, err);
                }
            });

            // // Delete the csv folder.
            rmdir('public/uploads/convert_to_csv/' + rows[0].number, function(err) {
                if (err) {
                    console.log('Erorr Deleting: ' + rows[0].number + 'CSV folder', err);
                }
            });

            // Delete the image if it isn't the placeholder.
            if (rows[0].image != 'placeholder.png') {
                fs.unlink('public/uploads/' + rows[0].image, function(err) {
                    if (err) {
                        console.log('Erorr Deleting: ' + rows[0].image, err);
                    }
                });
            }

            // Delete the database.
            model.drop(req, hullNumber, function(err, rows) {
                if (err) {
                    console.log('Error Deleting: %s ', err);
                }
            });

            // Delete row in the hulls list.
            model.delete(req, hullNumber, function(err, rows) {
                if (err) {
                    console.log('Error deleting: %s ', err);
                }

                req.flash('successMessages', 'Hull number ' + hullNumber + ' has been deleted.');
                res.redirect('/database/page/1');
            });
        });
    }
};
