var mysql   = require('mysql');
var db  = require('./db_connection.js');

var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM Leaderboard;',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            console.log(result);
            callback(false, result);
        }
    );
}

exports.Insert = function(video_game_id, player_id, position, points, callback) {
    var values = [video_game_id, player_id, position, points];
    connection.query('INSERT INTO Leaderboard (video_game_id, player_id, position, points) ' +
        'VALUES (?, ?, ?, ?)', values,
        function (err, result) {

            callback(err);
        });


}