var express = require('express');
var router = express.Router();
var player_dal = require('../model/player_dal.js');
var stateDal = require('../model/state_dal.js');
var rankingDal = require('../model/ranking_dal.js');

router.get('/all', function(req, res) {
    player_dal.GetAll(function (err, result) {
            if (err) throw err;
            res.render('player/displayAllPlayers.ejs', {rs: result});
        }
    );
});


router.get('/', function (req, res) {
    player_dal.GetByID(req.query.player_id, function (err, result) {
            if (err) throw err;

            res.render('player/displayPlayerInfo.ejs', {rs: result, player_id: req.query.player_id});
        }
    );
});

module.exports = router;

router.get('/create', function(req, res) {
    stateDal.GetAll( function(err, result){
        if(err) {
            console.log(err);
            res.send("Error: " + err);
        }
        else {
            res.render('player/playerFormCreate.ejs', {states: result});
        }
    });

});

router.post('/insert_player', function(req, res) {
    console.log(req.body);
    player_dal.Insert(req.body.firstname, req.body.lastname, req.body.email, req.body.username,
        req.body.gender, req.body.birthdate,
        function (err) {
            if (err) {
                res.send('Fail!<br />' + err);
            } else {
                res.send('Success!')
            }
        });
});
router.get('/edit', function (req, res) {
    console.log('/edit player_id:' + req.query.player_id);

    player_dal.GetByID(req.query.player_id, function (err, player_result) {
        if (err) {
            console.log(err);
            res.send('error: ' + err);
        }
        else {
            console.log(player_result);

            res.render('player/playerEditform', {rs: player_result, message: req.query.message});
            }



    });
});


router.post('/update_player', function (req, res) {
    console.log(req.body);
    player_dal.Update(req.body.player_id, req.body.firstname, req.body.lastname, req.body.email, req.body.username,
        req.body.gender, req.body.birthdate,
        function (err, result) {
            var message;
            if (err) {
                console.log(err);
                message = 'error: ' + err;
            }
            else {
                message = 'success';
            }
            player_dal.GetByID(req.body.player_id, function (err, movie_info) {
                res.redirect('/player/edit?player_id=' + req.body.player_id + '&message=' + message);


            });

        });
});


router.get('/delete', function (req, res) {
    console.log(req.query);
    player_dal.GetByID(req.query.player_id, function (err, result) {
        if (err) {
            res.send("Error: " + err);
        }
        else if (result.length != 0) {
            player_dal.DeleteById(req.query.player_id, function (err) {
                res.send(result[0].first_name + ' Successfully Deleted');
            });
        }
        else {
            res.send('Player does not exist in the database.');
        }
    });


});

router.get('/appearance', function(req, res) {
    rankingDal.GetAll(function (err, result){
        if (err) {
            res.send("Error: ", + err);
        }
        else{
            res.render('player/askGameTital.ejs', {rs:result});
        }
    });


});


router.get('/information', function(req, res){
    console.log(req.query.title);
    player_dal.GetInfo(req.query.title, function(err, result){
        if(err) {
            res.send("Error: " + err);
        }
        else {
            res.render('player/displayInformation', {rs:result, title: req.query.title});
        }
    });
});





module.exports = router;