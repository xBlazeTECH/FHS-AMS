'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SettingSchema = new Schema({
  key: String,
  type: String,
  value: Object
});

module.exports = mongoose.model('Setting', SettingSchema);