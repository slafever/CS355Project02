var express = require('express');
var router = express.Router();
var user_dal = require('../model/user_dal.js');
var stateDal = require('../model/state_dal.js');

router.get('/all', function(req, res) {
  user_dal.GetAll(function (err, result) {
        if (err) throw err;
        res.render('user/displayAllUsers.ejs', {rs: result});
      }
  );
});


router.get('/', function (req, res) {
  user_dal.GetByID(req.query.user_id, function (err, result) {
        if (err) throw err;

        res.render('user/displayUserInfo.ejs', {rs: result, user_id: req.query.user_id});
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
      res.render('user/userFormCreate.ejs', {states: result});
    }
  });

});

router.post('/insert_user', function(req, res) {
  console.log(req.body);
  user_dal.Insert(req.body.firstname, req.body.lastname, req.body.email, req.body.password, req.body.state_id,
      function (err) {
          var response = {};
        if (err) {
          response.message = err.message;
        } else {
          response.message = 'Success';
        }
          res.json(response);
      });
});
router.get('/edit', function (req, res) {
  console.log('/edit user_id:' + req.query.user_id);

  user_dal.GetByID(req.query.user_id, function (err, user_result) {
    if (err) {
      console.log(err);
      res.send('error: ' + err);
    }
    else {
      console.log(user_result);
      stateDal.GetAll(function (err, state_result) {
        console.log(state_result);
        res.render('user/userEditform', {rs: user_result, states: state_result, message: req.query.message});
      });


    }
  });
});

// Added for Lab 10

router.post('/update_user', function (req, res) {
  console.log(req.body);
  user_dal.Update(req.body.user_id, req.body.firstname, req.body.lastname, req.body.email, req.body.password, req.body.state_id,
      function (err, result) {
        var message;
        if (err) {
          console.log(err);
          message = 'error: ' + err;
        }
        else {
          message = 'success';
        }
        user_dal.GetByID(req.body.user_id, function (err, movie_info) {
          stateDal.GetAll(function (err, genre_result) {
            res.redirect('/users/edit?user_id=' + req.body.user_id + '&message=' + message);
          })

        });

      });
});

// Added for Lab 10

router.get('/delete', function (req, res) {
  console.log(req.query);
  user_dal.GetByID(req.query.user_id, function (err, result) {
    if (err) {
      res.send("Error: " + err);
    }
    else if (result.length != 0) {
      user_dal.DeleteById(req.query.user_id, function (err) {
        res.send(result[0].first_name + ' Successfully Deleted');
      });
    }
    else {
      res.send('User does not exist in the database.');
    }
  });


});




module.exports = router;
