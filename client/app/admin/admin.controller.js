'use strict';

angular.module('fhsLibApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, socket) {
    $scope.activeTab = 'signins';
    $scope.searchType = 'Global Search';
    
    $scope.signins = [];
    $http.get('/api/signins').success(function(signins) {
      $scope.signins = signins;
      socket.syncUpdates('signin', $scope.signins);
    });
    
    $scope.profiles = [];
    $http.get('/api/profiles').success(function(profiles) {
      $scope.profiles = profiles;
      socket.syncUpdates('profile', $scope.profiles);
    });
    
    $scope.delProfile = function(profile) {
      $http.delete('/api/profiles/' + profile._id);
      $http.get('/api/profiles').success(function(profiles) {
        $scope.profiles = profiles;
        socket.syncUpdates('profile', $scope.profiles);
      });
    };
  
    // Use the User $resource to fetch all users
    $scope.users = User.query();
    $scope.delUser = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
    
    
  });
