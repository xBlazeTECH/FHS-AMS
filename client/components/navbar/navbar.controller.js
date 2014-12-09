'use strict';

angular.module('fhsLibApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.showing = false;
    $scope.menu = [
    {
      'title': 'Home',
      'link': '/'
    },{
      'title': 'FHS Library',
      'link': '/library'
    },{
      'title': 'Math Tutorial',
      'link': '/math'
    },{
      'title': 'Science Tutorial',
      'link': '/science'
    },{
      'title': 'Fitness Ctr',
      'link': '/fitness'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login')
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });