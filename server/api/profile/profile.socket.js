/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var profile = require('./profile.model');

exports.register = function(socket) {
  profile.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  profile.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('profile:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('profile:remove', doc);
}