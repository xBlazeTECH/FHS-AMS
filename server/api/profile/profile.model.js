'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProfileSchema = new Schema({
  pin: String,
  nameFirst: String,
  nameLast: String,
  disabled: false,
  disableReason: String
});

module.exports = mongoose.model('Profile', ProfileSchema);