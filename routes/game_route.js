var express = require('express');
var router = express.Router();
var gameDal = require('../model/game_dal');
var genreDal = require('../model/genre_dal');

router.get('/all', function(req, res) {
    gameDal.GetAll(function (err, result) {
            if (err) {
                res.send("Error" + err.message);
            }
            else {
                res.render('game/displayAllGames.ejs', {rs: result});
            }
        }
    );
});

router.get('/', function (req, res) {
    console.log(req.query.video_game_id);
    if(req.query.video_game_id == null){
        res.redirect('/game/all')
    }
    else {
        gameDal.GetByID(req.query.video_game_id, function (err, result) {
                if (err) {
                    res.send("Error: " + err);
                    return;
                }
                console.log(result);
                res.render('game/displayGameInfo.ejs', {rs: result, video_game_id: req.query.video_game_id});
            }
        );
    }
});

router.get('/new', function(req, res) {
    genreDal.GetAll( function(err, result){
        if(err) {
            res.send("Error: " + err);
        }
        else {
            res.render('game/gameFormCreate.ejs', {genres: result});
        }
    });

});

router.post('/insert_game', function(req, res) {
    console.log(req.body);
    gameDal.Insert(req.body.title, req.body.description, req.body.ESRB_Rating, req.body.genre_id,
        function(err){
            if(err){
                res.send('Fail!<br />' + err);
            } else {
                res.send('Success!')
            }
        });


});


router.get('/edit', function(req, res){
    console.log('/edit video_game_id:' + req.query.video_game_id);

    gameDal.GetByID(req.query.video_game_id, function(err, game_result){
        if(err) {
            console.log(err);
            res.send('error: ' + err);
        }
        else {
            console.log(game_result);
            genreDal.GetAll(function(err, genre_result){
                console.log(genre_result);
                res.render('game/gameEditForm', {rs: game_result, genres: genre_result, message: req.query.message});
            });


        }
    });
});


router.post('/update_game', function(req,res){
    console.log(req.body);
    gameDal.Update(req.body.video_game_id, req.body.title, req.body.description, req.body.ESRB_Rating,
        function(err, result){
            var message;
            if(err) {
                console.log(err);
                message = 'error: ' + err;
            }
            else {
                message = 'success';
            }
            gameDal.GetByID(req.body.video_game_id, function(err, game_info){
                genreDal.GetAll(function(err, genre_result){
                    res.redirect('/game/edit?video_game_id=' + req.body.video_game_id + '&message=' + message);
                })

            });

        });
});



router.get('/delete', function(req, res){
    console.log(req.query);
    gameDal.GetByID(req.query.video_game_id, function(err, result) {
        if(err){
            res.send("Error: " + err);
        }
        else if(result.length != 0) {
            gameDal.DeleteById(req.query.video_game_id, function (err) {
                res.send(result[0].title + ' Successfully Deleted');
            });
        }
        else {
            res.send('Video Game does not exist in the database.');
        }
    });
});

module.exports = router;