'use strict';

var Firebase = require('firebase');
var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

var User = require('../model/usermodel');

var ref = new Firebase('https://thisozanne.firebaseio.com/');

router.get('/signed', function(req,res){
  var token = req.cookies.mytoken;
  if(!token) return res.send({token: false})
  res.send({token: true})

})
router.post('/register', function(req, res, next) {
  ref.createUser(req.body, function(err, userData) {
    if(err) return res.status(400).send(err);
    var firebaseId= userData.uid
    var email = req.body.email
    console.log(email, firebaseId);
 User.create({firebaseId: firebaseId, email: email}, function(err, newUser) {
   if(err) return res.status(400).send(err);
      res.send();
    });
  });
});

router.post('/login', function(req, res, next) {
  ref.authWithPassword(req.body, function(err, authData) {
    console.log("authData",authData);
    if(err) return res.status(400).send(err);
    User.findOne({firebaseId: authData.uid}, function(err, user) {
      console.log('user', user);
      var token = user.generateToken();
      res.cookie('mytoken', token).send();
    });
  });
});
router.post('/resetpass', function(req, res, next) {
  var email = req.body.email
  ref.resetPassword({
    email: email
  }, function(error) {
    if (error) {
      switch (error.code) {
        case "INVALID_USER":
          console.log("The specified user account does not exist.");
          break;
        default:
          console.log("Error resetting password:", error);
      }
    } else {
      console.log("Password reset email sent successfully!");
    }
  });
  res.send();
});
router.post('/changepass', function(req, res, next) {
  console.log('req.body', req.body);
  var email = req.body.email;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
ref.changePassword({
  email: email,
  oldPassword: oldPassword,
  newPassword: newPassword
}, function(error) {
  if (error) {
    switch (error.code) {
      case "INVALID_PASSWORD":
        console.log("The specified user account password is incorrect.");
        break;
      case "INVALID_USER":
        console.log("The specified user account does not exist.");
        break;
      default:
        console.log("Error changing password:", error);
    }
  } else {
    console.log("User password changed successfully!");
  }
});
  res.send();
});


router.get('/logout', function(req, res, next) {
  res.clearCookie('mytoken').redirect('/');
});


module.exports = router;
