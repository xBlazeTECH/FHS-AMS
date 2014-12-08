'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SigninSchema = new Schema({
  time: String,
  place: String, //Make this an enum Eventually
  pin: String,
  first_name: String,
  last_name: String
});

module.exports = mongoose.model('Signin', SigninSchema);