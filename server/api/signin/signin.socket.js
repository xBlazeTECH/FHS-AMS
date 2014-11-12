/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var signin = require('./signin.model');

exports.register = function(socket) {
  signin.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  signin.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('signin:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('signin:remove', doc);
}