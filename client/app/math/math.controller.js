'use strict';

angular.module('fhsLibApp')
  .controller('MathCtrl', function ($scope, $http, socket) {
    $scope.needMoreInfo = false;
    $scope.pinValidated = false;
    
    $scope.profiles = [];
    
    $scope.nameFirst = '';
    $scope.firstname_valid = false;
    $scope.nameLast = '';
    $scope.lastname_valid = false;
    
    $scope.getStyle = function(type) {
      if (type == 'info') return '#D9EDF7';
      if (type == 'danger') return '#F2DEDE';
      if (type == 'warning') return '#FCF8E3';
      if (type == 'success') return '#DFF0D8';
    }
    
    /*
      Form State: What is the state of the data entered?
        0: No data entered.
        1: Invalid Pin Entered.
        2: Valid Pin Entered, Profile NOT Found.
        3: Valid Pin Entered, Profile Found. Account Enabled.
        4: Valid Pin Entered, Profile Found. Account Disabled.
        5: Valid Pin Entered, First Name Entered.
        6: Valid Pin Entered, Last Name Entered.
    */
    $scope.formState = 0;
    
    $scope.panelStyle = function() {
      if ($formState == 0) return getStyle('info');
      if ($formState == 1) return getStyle('danger');
      if ($formState == 2) return getStyle('warning');
      if ($formState == 3) return getStyle('success');
      if ($formState == 4) return getStyle('danger');
      if ($formState == 5) return getStyle('info');
    }
    
    $scope.isFormState = function(number) {
      if ($scope.formState == number) return true;
      return false;
    }
    
    function isEmpty(str) {
      return (!str || 0 === str.length);
    }
    
    $scope.clearPin = function() {
      $scope.pin = '';
      $scope.nameFirst = '';
      $scope.nameLast = '';
      $scope.formState = 0;
    }
    
    $http.get('/api/profiles').success(function(profiles) {
      $scope.profiles = profiles;
      socket.syncUpdates('profile', $scope.profiles);
    });
    
    function pinbackspace() {
      $scope.pin = $scope.pin.slice(0,-1);
    }
    
    $scope.updatePin = function() {
      if (isEmpty($scope.pin)) {
        $scope.nameFirst = '';
        $scope.nameLast = '';
        $scope.formState = 0;
        return;
      }
      if ($scope.pin.match(/[^0-9]/)) { // Prevent the user from typing anything that is not a number.
        pinbackspace();
        return;
      }
      if (!$scope.pin.match(/^.{0,5}$/)) {  // Prevent user from entering more than 5 characters.
        pinbackspace();
        return;
      }
      if ($scope.pin.match(/[0-9]{5}/)) { // Check to see if the pin contains 5 numbers. (Redundant, Yes I know...)
        for (var i in $scope.profiles) {
          if ($scope.profiles[i].pin == $scope.pin) {
            $scope.formState = 3;
            $scope.nameFirst = $scope.profiles[i].nameFirst;
            $scope.firstname_valid = true;
            $scope.nameLast = $scope.profiles[i].nameLast;
            $scope.lastname_valid = true;
            return;
          } else {
            $scope.formState = 2;
          }
        }
      } else {
        $scope.nameFirst = '';
        $scope.nameLast = '';
        $scope.formState = 1;
        return;
      }
    }
    
    $scope.updateName = function(part) {
      if (part == 'first') {
        if ($scope.nameFirst != '') {
          $scope.firstname_valid = true;
        } else {
          $scope.firstname_valid = false;
        }        
      }
      if (part == 'last') {
        if ($scope.nameLast != '') {
          $scope.lastname_valid = true;
        } else {
          $scope.lastname_valid = false;
        }
      }
    }
  });