module.exports = function(app, error) {
    var hulls = require('../app/controllers/hulls'),
        gensheets = require('../app/controllers/gensheets');

    app.get('/', hulls.add).use(error);
    app.post('/', hulls.save).use(error);
    app.get('/help', hulls.help).use(error);
    app.get('/database/page/:page', hulls.list).use(error);
    app.get('/database/typeahead', hulls.typeahead).use(error);
    app.post('/database/search', hulls.search).use(error);
    app.get('/hull/:hullNumber', hulls.info).use(error);
    app.post('/hull/:hullNumber', hulls.delete).use(error);
    app.get('/hull/:hullNumber/gensheet/:sheet', gensheets.gensheet).use(error);
    app.get('/hull/:hullNumber/iolist', gensheets.iolist).use(error);
    app.post('/validate', hulls.validate).use(error);
};
