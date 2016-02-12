'use strict';

var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var JWT_SECRET = process.env.JWT_SECRET;

var userSchema = new mongoose.Schema({
  firebaseId: {type:String},
  email: {type:String}
});
userSchema.statics.isLoggedIn = function(req, res, next){
  var token = req.cookies.mytoken;
  if(!token) return res.status(401).send({error: `Authentication failed: ${err}`})
  try{
    var payload = jwt.decode(token, JWT_SECRET);
  }
  catch(err){ return res.status(401).send({error: `Auth failed ${err}`})}
  req.token = payload;
  console.log("IN isLoggedIn", req.token);
  next();
}

// instance method
userSchema.methods.generateToken = function() {
  var payload = {
    firebaseId: this.firebaseId,
    _id: this._id
  };

  console.log('pay load is: ', payload);

  var token = jwt.encode(payload, JWT_SECRET);

  return token;
};

var User = mongoose.model('User', userSchema);

module.exports = User;
