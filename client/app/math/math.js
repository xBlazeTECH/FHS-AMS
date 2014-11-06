'use strict';

angular.module('fhsLibApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('math', {
        url: '/math',
        templateUrl: 'app/math/math.html',
        controller: 'MathCtrl'
      });
  });