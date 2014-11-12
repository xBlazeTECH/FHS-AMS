'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SigninSchema = new Schema({
  time: String,
  place: String, //Make this an enum Eventually
  pin: String,
  nameFirst: String,
  nameLast: String
});

module.exports = mongoose.model('Signin', SigninSchema);