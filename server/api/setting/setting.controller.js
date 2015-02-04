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
var Setting = require('./setting.model');

// Get list of things
exports.index = function(req, res) {
  Setting.find(function (err, setting) {
    if(err) { return handleError(res, err); }
    return res.json(200, setting);
  });
};

// Get a single profile
exports.show = function(req, res) {
  Setting.findById(req.params.id, function (err, setting) {
    if(err) { return handleError(res, err); }
    if(!setting) { return res.send(404); }
    return res.json(setting);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Setting.create(req.body, function(err, setting) {
    if(err) { return handleError(res, err); }
    return res.json(201, setting);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Setting.findById(req.params.id, function (err, setting) {
    if (err) { return handleError(res, err); }
    if(!setting) { return res.send(404); }
    var updated = _.merge(setting, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, setting);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Setting.findById(req.params.id, function (err, setting) {
    if(err) { return handleError(res, err); }
    if(!setting) { return res.send(404); }
    setting.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}