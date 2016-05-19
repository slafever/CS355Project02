var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM User;',
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


exports.GetByID = function(user_id, callback) {
    console.log(user_id);
    var query = 'SELECT * FROM user_info_view WHERE user_id=' + user_id;
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
exports.Insert = function(firstname, lastname, email, password, state_id, callback) {
    var values = [firstname, lastname, email, password, state_id];
    connection.query('INSERT INTO User (first_name, last_name, email, password, state_id) VALUES (?, ?, ?, ?, ?)', values,
        function (err, result) {

            callback(err);
        });


}
exports.Update = function(user_id, firstname, lastname, email, password,state_id, callback) {
    console.log(user_id, firstname, lastname, email, password, state_id);
    var values = [firstname, lastname,email, password, state_id, user_id];
    connection.query('UPDATE User SET first_name = ?, last_name = ?, email = ?, password = ?, state_id = ? WHERE user_id = ?', values,
        function(err, result){
            callback(err, result);
        });
}

var Delete = function(user_id, callback) {
//function Delete(movie_id, callback) {
    var qry = 'DELETE FROM User WHERE user_id = ?';
    connection.query(qry, [user_id],
        function (err) {
            callback(err);
        });
}
exports.DeleteById = Delete;


exports.GetByEmail = function(email, password, callback) {
    var query = 'CALL Account_GetByEmail(?, ?)';
    var query_data = [email, password];

    connection.query(query, query_data, function(err, result) {
        if(err){
            callback(err, null);
        }
// NOTE: Stored Procedure results are wrapped in an extra array
        // and only one user record should be returned,
        // so return only the one result
        else if(result[0].length == 1) {
            callback(err, result[0][0]);
        }
        else {
            callback(err, null);
        }
    });
};