'use strict';

var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var JWT_SECRET = process.env.JWT_SECRET;

var User;

var userSchema = new mongoose.Schema({
  firebaseId: {type:String},
  username: {type:String},
  email: {type: String},
  photoAlbum: [{type: String, default:false}],
  userWants: [{type: mongoose.Schema.Types.ObjectId, ref: "Album"}],
  wantsUser: [{type: mongoose.Schema.Types.ObjectId, ref: "Album"}],
  Match: [{type: mongoose.Schema.Types.ObjectId, ref: "Album"}],
  Reject: [{type: mongoose.Schema.Types.ObjectId, ref: "Album"}]
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

User = mongoose.model('User', userSchema);

module.exports = User;
