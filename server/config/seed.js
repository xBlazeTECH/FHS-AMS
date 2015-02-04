/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Setting = require('../api/setting/setting.model');
var Profile = require('../api/profile/profile.model');
var User = require('../api/user/user.model');
var Signin = require('../api/signin/signin.model');

Setting.find({}).remove(function() {
  Setting.create({
    key : 'lib-max',
    type : 'number',
    value : '20'
  });
});

Profile.find({}).remove(function() {
  Profile.create({
    pin : '15379',
    first_name : 'Lansing',
    last_name : 'Nye-Madden',
    disabled : false
  },{
    pin : '15180',
    first_name : 'Eric',
    last_name : 'Sims',
    disabled : true,
    disableReason : 'Disabled by Administrator!'
  },{
    pin : '20330',
    first_name : 'Michael',
    last_name : 'Nye-Madden',
    disabled : true,
    disableReason : 'Abuse of Library Pass privleges.'
  });
});

Signin.find({}).remove(function() {
  Signin.create();
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    role: 'admin',
    name: 'Lansing Nye-Madden',
    email: 'me@lansing.io',
    password: 'Lansing123'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Library Login',
    email: 'library@fpsct.org',
    password: 'SomePassword234'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Attendance Login',
    email: 'attendance@fpsct.org',
    password: 'OtherPassword234'
  }, function() {
      console.log('finished populating users');
    }
  );
});