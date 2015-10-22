module.exports = {
    validate: function(req, input, callback) {
        req.getConnection(function(err, connection) {
            connection.query('SELECT COUNT(*) as count FROM hulls.hulls WHERE number = ? OR name = ?', [input.hullNumber, input.hullName], callback);
        });
    },

    save: function(req, data, callback) {
        req.getConnection(function(err, connection) {
            connection.query('INSERT INTO hulls.hulls set ?', data, callback);
        });
    },

    count: function(req, callback) {
        req.getConnection(function(err, connection) {
            connection.query('SELECT COUNT(*) AS count FROM hulls.hulls', callback);
        });
    },

    list: function(req, start, perPage, callback) {
        req.getConnection(function(err, connection) {
            connection.query('SELECT * FROM hulls.hulls ORDER BY number DESC LIMIT ?, ?', [start, perPage], callback);
        });
    },

    typeahead: function(req, typeahead, callback) {
        req.getConnection(function(err, connection) {
            connection.query('SELECT * FROM hulls.hulls WHERE search LIKE ?', [typeahead], callback);
        });
    },

    search: function(req, search, callback) {
        req.getConnection(function(err, connection) {
            connection.query('SELECT * FROM hulls.hulls WHERE name LIKE ? OR number LIKE ? OR search LIKE ?', [search, search, search], callback);
        });
    },

    info: function(req, hullNumber, callback) {
        req.getConnection(function(err, connection) {
            connection.query('SELECT * FROM hulls.hulls WHERE number = ?', [hullNumber], callback);
        });
    },

    drop: function(req, hullNumber, callback) {
        req.getConnection(function(err, connection) {
            connection.query('DROP DATABASE ??', [hullNumber], callback);
        });
    },

    delete: function(req, hullNumber, callback) {
        req.getConnection(function(err, connection) {
            connection.query('DELETE FROM hulls.hulls WHERE number = ?', [hullNumber], callback);
        });
    }
};
