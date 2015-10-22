module.exports = {
    tables: function(req, hullNumber, callback) {
        req.getConnection(function(err, connection) {
            connection.query('SHOW tables FROM ??', [hullNumber], callback);
        });
    },

    columns: function(req, hullNumber, sheet, callback) {
        req.getConnection(function(err, connection) {
            connection.query('SHOW columns FROM ??.??', [hullNumber, sheet], callback);
        });
    },

    gensheet: function(req, hullNumber, sheet, callback) {
        req.getConnection(function(err, connection) {
            connection.query('SELECT * FROM ??.??', [hullNumber, sheet], callback);
        });
    },

    iolist: function(req, hullNumber, callback) {
        req.getConnection(function(err, connection) {
            connection.query(analogIn() + ' UNION ALL ' + space() + ' UNION ALL ' +
                other('AIS02') + ' UNION ALL ' + space() + ' UNION ALL ' +
                digitalIn() + ' UNION ALL ' + space() + ' UNION ALL ' +
                other('DIS02') + ' UNION ALL ' + space() + ' UNION ALL ' +
                other('AOS') + ' UNION ALL ' + space() + ' UNION ALL ' +
                other('DOS'), [hullNumber, hullNumber, hullNumber, hullNumber, hullNumber, hullNumber, hullNumber, hullNumber, hullNumber, hullNumber, hullNumber, hullNumber], callback);
        });
    }
};

function analogIn() {
    var sql = 'SELECT ' +
        'AIS.TagName,' +
        'AIS.Descr,' +
        'SUBSTRING(AIS.AlLimLL, 1, CHAR_LENGTH(AIS.AlLimLL) - 2) AS LLLimit,' +
        'SUBSTRING(AIS.AlLimL, 1, CHAR_LENGTH(AIS.AlLimL) - 2) AS LLimit,' +
        'SUBSTRING(AIS.AlLimH, 1, CHAR_LENGTH(AIS.AlLimH) - 2) AS HLimit,' +
        'SUBSTRING(AIS.AlLimHH, 1, CHAR_LENGTH(AIS.AlLimHH) - 2) As HHLimit,' +
        'SUBSTRING(AIS.AlarmGroup, 1, CHAR_LENGTH(AIS.AlarmGroup) - 2) As AlarmGroup,' +
        'SUBSTRING(AIS.Node, 1, CHAR_LENGTH(AIS.Node) - 2) As Node,' +
        'SUBSTRING(AIS.Path, 3, CHAR_LENGTH(AIS.Path) - 4) As StationNo, HwUnits.HwType,' +
        'SUBSTRING(AIS.Channel, 1, CHAR_LENGTH(AIS.Channel) - 2) As Channel,' +
        'REPLACE(SUBSTRING(AIS.Path, 5), \'.\', \'\') As Position,' +
        'CASE HwUnits.HwType ' +
        'WHEN \'AI810\' THEN CONCAT(\'B\', CONCAT(SUBSTRING(AIS.Channel, 1, CHAR_LENGTH(AIS.Channel) - 2)), \'+\') ' +
        'WHEN \'AI830\' THEN CONCAT(\'C\', CONCAT(SUBSTRING(AIS.Channel, 1, CHAR_LENGTH(AIS.Channel) - 2)), \'+\') ' +
        'END AS T1,' +
        'CASE HwUnits.HwType ' +
        'WHEN \'AI810\' THEN CONCAT(\'C\', CONCAT(SUBSTRING(AIS.Channel, 1, CHAR_LENGTH(AIS.Channel) - 2)), \'-\') ' +
        'WHEN \'AI830\' THEN CONCAT(\'C\', CONCAT(SUBSTRING(AIS.Channel, 1, CHAR_LENGTH(AIS.Channel) - 2)), \'-\') ' +
        'END AS T2 ' +
        'FROM ' +
        '??.AIS ' +
        'LEFT JOIN ' +
        '??.HwUnits ON HwUnits.Path = AIS.Path WHERE AIS.Path != \'\'';

    return sql;
}

function digitalIn() {
    var sql = 'SELECT ' +
        'DIS.TagName,' +
        'DIS.Descr,' +
        'NULL AS LLLimit,' +
        'NULL AS LLimit,' +
        'NULL AS HLimit,' +
        'NULL AS HHLimit,' +
        'SUBSTRING(DIS.AlarmGroup, 1, CHAR_LENGTH(DIS.AlarmGroup) - 2) As AlarmGroup,' +
        'SUBSTRING(DIS.Node, 1, CHAR_LENGTH(DIS.Node) - 2) As Node,' +
        'SUBSTRING(DIS.Path, 3, CHAR_LENGTH(DIS.Path) - 4) As StationNo, HwUnits.HwType,' +
        'SUBSTRING(DIS.Channel, 1, CHAR_LENGTH(DIS.Channel) - 2) As Channel,' +
        'REPLACE(SUBSTRING(DIS.Path, 5), \'.\', \'\') As Position,' +
        'CONCAT(\'B\', SUBSTRING(DIS.Channel, 1, CHAR_LENGTH(DIS.Channel) - 2)) As T1,' +
        'CONCAT(\'C\', SUBSTRING(DIS.Channel, 1, CHAR_LENGTH(DIS.Channel) - 2)) As T2 ' +
        'FROM ' +
        '??.DIS ' +
        'LEFT JOIN ' +
        '??.HwUnits ON HwUnits.Path = DIS.Path WHERE DIS.Path != \'\'';

    return sql;
}

function other(table) {
    var sql = 'SELECT ' +
        table + '.TagName,' +
        table + '.Descr,' +
        'NULL AS LLLimit,' +
        'NULL AS LLimit,' +
        'NULL AS HLimit,' +
        'NULL AS HHLimit,' +
        'NULL AS AlarmGroup,' +
        'SUBSTRING(' + table + '.Node, 1, CHAR_LENGTH(' + table + '.Node) - 2) As Node,' +
        'SUBSTRING(' + table + '.Path, 3, CHAR_LENGTH(' + table + '.Path) - 4) As StationNo,' +
        'HwUnits.HwType, SUBSTRING(' + table + '.Channel, 1, CHAR_LENGTH(' + table + '.Channel) - 2) As Channel,' +
        'REPLACE(SUBSTRING(' + table + '.Path, 5), \'.\', \'\') As Position,' +
        'CONCAT(\'C\', SUBSTRING(' + table + '.Channel, 1, CHAR_LENGTH(' + table + '.Channel) - 2)) As T1,' +
        'CONCAT(\'A\', SUBSTRING(' + table + '.Channel, 1, CHAR_LENGTH(' + table + '.Channel) - 2)) As T2 ' +
        'FROM ' +
        '??.' + table +
        ' LEFT JOIN ' +
        '??.HwUnits ON HwUnits.Path = ' + table + '.Path WHERE ' + table + '.Path != \'\'';

    return sql;
}

function space() {
    var sql = 'SELECT ' +
        'Null As TagName,' +
        'NULL As Descr,' +
        'NULL AS LLLimit,' +
        'NULL AS LLimit,' +
        'NULL AS HLimit,' +
        'NULL AS HHLimit,' +
        'NULL AS AlarmGroup,' +
        'NULL As Node,' +
        'NULL As StationNo,' +
        'NULL As HwType,' +
        'NULL As Channel,' +
        'NULL As Position,' +
        'NULL As T1,' +
        'NULL As T2';

    return sql;
}
