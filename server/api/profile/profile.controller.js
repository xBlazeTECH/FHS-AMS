/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /profiles              ->  index
 * POST    /profiles              ->  create
 * GET     /profiles/:id          ->  show
 * PUT     /profiles/:id          ->  update
 * DISABLED: DELETE  /profiles/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Profile = require('./profile.model');

// Get list of things
exports.index = function(req, res) {
  Profile.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

// Get a single profile
exports.show = function(req, res) {
  Profile.findById(req.params.id, function (err, profile) {
    if(err) { return handleError(res, err); }
    if(!profile) { return res.send(404); }
    return res.json(profile);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Profile.create(req.body, function(err, profile) {
    if(err) { return handleError(res, err); }
    return res.json(201, profile);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Profile.findById(req.params.id, function (err, profile) {
    if (err) { return handleError(res, err); }
    if(!profile) { return res.send(404); }
    var updated = _.merge(profile, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, profile);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Profile.findById(req.params.id, function (err, profile) {
    if(err) { return handleError(res, err); }
    if(!profile) { return res.send(404); }
    profile.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}