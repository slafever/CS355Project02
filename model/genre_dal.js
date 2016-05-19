var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback){
    var qry = "SELECT * from Game_Genre;";
    connection.query(qry, function(err, result){
        callback(err, result);
    });
}

exports.Insert = function(genre_name, callback) {
    var qry = "INSERT INTO Game_Genre (name) VALUES (?)";
    connection.query(qry, genre_name, function(err, result){
        callback(err, result);
    });
}