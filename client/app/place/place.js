'use strict';

angular.module('fhsLibApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place', {
        url: '/:place',
        templateUrl: 'app/place/place.html',
        controller: 'PlaceCtrl'
      });
  });