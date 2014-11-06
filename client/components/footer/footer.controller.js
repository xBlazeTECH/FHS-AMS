'use strict';

angular.module('fhsLibApp')
  .controller('FooterCtrl', function ($scope, $location) {
    $scope.app = {
      "name": "FHS-AMS",
      "version": "1.0.0",
      "twitter": {
        "name":"xBlazeTECH",
        "url":"http://twitter.com/xBlazeTECH"
      },
      "git": {
        "url": "https://github.com/xBlazeTECH/FHS-LIB",
        "issues": "https://github.com/xBlazeTECH/FHS-LIB/issues"
      }
    };
  });