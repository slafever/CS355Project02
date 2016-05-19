var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM Player;',
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


exports.GetByID = function(player_id, callback) {
    console.log(player_id);
    var query = 'SELECT * FROM player_info_view WHERE player_id=' + player_id;
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
/*
 exports.Insert = function(user_info, callback) {
 console.log(user_info);

 var dynamic_query = 'INSERT INTO User (first_name, last_name, email, password) VALUES (' +
 '\'' + user_info.firstname + '\', ' +
 '\'' + user_info.lastname + '\', ' +
 '\'' + user_info.email + '\', ' +
 '\'' + user_info.password + '\'' +
 ');';


 console.log("test");
 console.log(dynamic_query);

 // connection.query(query, is where the SQL string we built above is actually sent to the MySQL server to be run
 connection.query(dynamic_query,

 function (err, result) {

 // if the err parameter isn't null or 0, then it will run the code within the if statement
 if(err) {

 console.log(err);
 callback(true);
 return;
 }


 callback(false, result);
 }
 );
 }
 */
exports.Insert = function(firstname, lastname, email, username, gender, birthdate, callback) {
    var values = [firstname, lastname, email, username, gender, birthdate];
    connection.query('INSERT INTO Player (first_name, last_name, email, username, birth_date, gender) ' +
        'VALUES (?, ?, ?, ?, ?, ?)', values,
        function (err, result) {

            callback(err);
        });


}
exports.Update = function(player_id, firstname, lastname, email, username, birthdate, gender, callback) {
    console.log(player_id, firstname, lastname, email, username, birthdate, gender);
    var values = [firstname, lastname, email, username, birthdate, gender, player_id];
    connection.query('UPDATE Player SET first_name = ?, last_name = ?, email = ?, username = ?, birth_date = ? , gender = ?' +
        'WHERE player_id = ?', values,
        function(err, result){
            callback(err, result);
        });
}

var Delete = function(player_id, callback) {
//function Delete(movie_id, callback) {
    var qry = 'DELETE FROM Player WHERE player_id = ?';
    connection.query(qry, [player_id],
        function (err) {
            callback(err);
        });
}
exports.DeleteById = Delete;

exports.Participation = function (callback){
    var qry = 'select username, position, points from Player join Leaderboard on' +
        'Player.player_id = Leaderboard.player_id where Player.player_id in' +
        '(select player_id from Player where player_id = 1)';
    connection.query(qry,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            console.log(result);
            callback(false, result);
        });
}

exports.GetInfo = function (title, callback){
    console.log(title);
    var query = 'select * from GameView having title=' + "\'" + title + "\'";
    console.log(query);
    connection.query(query, function(err, result){
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        callback(false, result);
    });

};
