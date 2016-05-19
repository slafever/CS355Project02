var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM Video_Game;',
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

exports.Insert = function(title, description, ESRB_Rating, genres, callback) {
    var values = [title, description, ESRB_Rating];
    connection.query('INSERT INTO Video_Game (title, description, ESRB_Rating) VALUES (?, ?, ?)', values,
        function (err, result) {

            if (err == null && genres != null) {
                var genre_qry_values = [];

                if(genres instanceof Array) {
                    for (var i = 0; i < genres.length; i++) {
                        genre_qry_values.push([result.insertId, genres[i]]);
                    }
                }
                else {
                    genre_qry_values.push([result.insertId, genres]);
                }

                console.log(genre_qry_values);

                var genre_qry = 'INSERT INTO Video_Game_Genre (video_game_id, genre_id) VALUES (?)';

                connection.query(genre_qry, genre_qry_values, function(err){
                    if(err) {
                        Delete(result.insertId, function() {
                            callback(err);
                        });
                    }
                    else {
                        callback(err);
                    }
                });
            }
            else {
                callback(err);
            }
        });
}



exports.GetByID = function(game_id, callback) {

    console.log(game_id);
    var query = 'SELECT * FROM game_info_view WHERE video_game_id=' + game_id;
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}


exports.Update = function(video_game_id, title, description, ESRB_Rating, callback) {
    console.log(game_id, title, description, ESRB_Rating);
    var values = [title, description, ESRB_Rating, video_game_id];
    connection.query('UPDATE Video_Game SET title = ?, description = ?, ESRB_Rating = ?, WHERE video_game_id = ?', values,
        function(err, result){
            callback(err, result);
        });
}

var Delete = function(video_game_id, callback) {
//function Delete(movie_id, callback) {
    var qry = 'DELETE FROM Video_Game WHERE video_game_id = ?';
    connection.query(qry, [video_game_id],
        function (err) {
            callback(err);
        });
}

exports.DeleteById = Delete;