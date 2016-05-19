var express = require('express');
var router = express.Router();
var userDal = require('../model/user_dal.js');
var ratingDal = require('../model/ranking_dal.js');
var gameDal = require('../model/game_dal.js');
var playerDal = require('../model/player_dal.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'CS355', subtitle: 'Lab 8' });
  var data = {
    title : 'Express'
  }
  if(req.session.account === undefined) {
    res.render('index', data);
  }
  else {
    data.first_name = req.session.account.first_name;
    res.render('index', data);
  }
});

router.get('/about', function(req, res) {
  res.render('about/about.ejs');
});


router.get('/templatelink', function(req, res, next){
  res.render('templateexample.ejs', {title: 'cs355'});
});

router.get('/authenticate', function(req, res) {
  userDal.GetByEmail(req.query.email, req.query.password, function (err, account) {
    if (err) {
      res.send(err);
    }
    else if (account == null) {
      res.send("User not found.");
    }
    else {
      req.session.account = account;
      var response = {};
      if(req.session.originalUrl = '/login') {
        req.session.originalUrl = '/'; //don't send user back to login, instead forward them to the homepage.
        response.authenticate = 1;
        response.originalUrl = req.session.originalUrl;
      }
      else{
        response.authenticate = 0;
        response.message = 'Username or Password is incorrect.'
      }
      res.json(response);
      //res.redirect(req.session.originalUrl);
      //res.send(account);
    }
  });
});

router.get('/login', function(req, res, next) {
  if(req.session.account) {
    res.redirect('/'); //user already logged in so send them to the homepage.
  }
  else {
    res.render('authentication/login.ejs');
  }
});

router.get('/logout', function(req, res) {
  req.session.destroy( function(err) {
    res.render('authentication/logout.ejs');
  });
});
module.exports = router;


router.get('/insert', function(req, res){
    playerDal.GetAll(function (err, player_result){
      gameDal.GetAll(function (err, game_result){

      if (err) {
        res.send("Error: " + err);
      }
      else {
        res.render('ranking/playerRanked.ejs', {games:game_result, players:player_result});
      }
      });
    });

});

router.post('/insert_rating', function(req, res){
  console.log(req.body);
  ratingDal.Insert(req.body.video_game_id, req.body.player_id, req.body.position, req.body.points,
  function(err){
    if(err){
      res.send('Fail<br/>' + err);
    }
    else {
      res.send('Success!');
    }
  })
})