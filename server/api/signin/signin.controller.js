/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /signins              ->  index
 * POST    /signins              ->  create
 * GET     /signins/:id          ->  show
 * PUT     /signins/:id          ->  update
 * DELETE  /signins/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Signin = require('./signin.model');

// Get list of things
exports.index = function(req, res) {
  Signin.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

// Get a single profile
exports.show = function(req, res) {
  Signin.findById(req.params.id, function (err, signin) {
    if(err) { return handleError(res, err); }
    if(!signin) { return res.send(404); }
    return res.json(signin);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Signin.create(req.body, function(err, signin) {
    if(err) { return handleError(res, err); }
    return res.json(201, signin);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Signin.findById(req.params.id, function (err, signin) {
    if (err) { return handleError(res, err); }
    if(!signin) { return res.send(404); }
    var updated = _.merge(signin, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, signin);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Signin.findById(req.params.id, function (err, signin) {
    if(err) { return handleError(res, err); }
    if(!signin) { return res.send(404); }
    signin.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}