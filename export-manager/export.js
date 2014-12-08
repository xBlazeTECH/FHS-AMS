var settings =  { filename: 'latest-export.csv', port: 9001, host: 'localhost' };
var mongo = require('mongoose');
var fs = require('fs');
var http = require('http');
var model = require('../server/api/signin/signin.model.js');
var open = require("open");

var server = http.createServer(function(request, response) {
  var url = request.url.replace(/\/archive\//i,'');
  var data = fs.readFileSync(url);
  response.end(data);
  process.exit(1);
});
server.listen(settings.port);

mongo.connect('mongodb://localhost/fhslib-dev',{});

model.find({}).exec(function(err,data) {
  if(err) throw err;
  fs.writeFile(settings.filename,ConvertToCSV(JSON.stringify(data)),function(err){open('http://' + settings.host + ':' + settings.port + '/archive/' + settings.filename)});
});

function ConvertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '_id,Date,Time,Place,Pin,First Name,Last Name,isDisabled?\r\n';
  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ','
        line += array[i][index];
      }
      str += line + '\r\n';
    }
  return str;
}