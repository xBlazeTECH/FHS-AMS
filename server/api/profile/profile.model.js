'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProfileSchema = new Schema({
  pin: String,
  first_name: String,
  last_name: String,
  disabled: Boolean,
  disableReason: String
});

module.exports = mongoose.model('Profile', ProfileSchema);