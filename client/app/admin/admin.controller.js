'use strict';

angular.module('fhsLibApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, socket) {
    $scope.activeTab = 'signins';
    $scope.searchType = 'Global Search';
    
    $scope.signins = [];
    $scope.settings = [];
    $scope.lib_max = 0;
    $scope.lib_max_remote = 0;
    $scope.lib_max_id = '';
    
    $scope.put = function() {
      $http.put('/api/setting/' + $scope.lib_max_id, {
        key : "lib-max",
        type : "number",
        value : $scope.lib_max
      });
      $scope.lib_max_remote = $scope.lib_max;
    }
    

    $http.get('/api/signins').success(function(signins) {
      $scope.signins = signins;
      socket.syncUpdates('signin', $scope.signins);
    });
    
    $http.get('/api/setting').success(function(settings) {
      $scope.settings = settings;
      for (var x in settings) {
        if (settings[x].key == 'lib-max') {
          $scope.lib_max = settings[x].value;
          $scope.lib_max_remote = settings[x].value;
          $scope.lib_max_id = settings[x]._id;
        }
      }
      socket.syncUpdates('setting', $scope.settings);
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
