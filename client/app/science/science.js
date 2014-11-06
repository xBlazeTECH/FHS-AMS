'use strict';

angular.module('fhsLibApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('science', {
        url: '/science',
        templateUrl: 'app/science/science.html',
        controller: 'ScienceCtrl'
      });
  });