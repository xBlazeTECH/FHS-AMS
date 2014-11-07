'use strict';

angular.module('fhsLibApp')
  .controller('MathCtrl', function ($scope, $http, $window, $location, $timeout, socket) {
    $scope.needMoreInfo = false;
    $scope.pinValidated = false;
    
    $scope.profiles = [];
    
    $scope.nameFirst = '';
    $scope.firstname_valid = false;
    $scope.nameLast = '';
    $scope.lastname_valid = false;
    
    $scope.alertState = {
      "title":"Awaiting Input:",
      "message":"Please enter your student pin below...",
      "style":"info"
    };
    
    $scope.disabledReason = 'No futher information provided!';
    
    $scope.formStyle = 'panel-primary';
    
    /*
      Form State: What is the state of the data entered?
        0: No data entered.
        1: Invalid Pin Entered.
        2: Valid Pin Entered, Profile NOT Found.
        3: Valid Pin Entered, Profile NOT Found. Name Entered Completely.
        4: Valid Pin Entered, Profile Found. Profile Enabled.
        5: Valid Pin Entered, Profile Found. Profile Disabled.
        6: Valid Pin Entered, Profile Found. Profile Enabled. Name Incorrect.
        7: Valid Pin Entered, Profile Found. Profile Enabled. Signed In Successfully.
    */
    $scope.formState = 0;
    function setFormState(number) {
      $scope.formState = number;
      if ($scope.formState == 0) {
        $scope.formStyle = 'panel-info';
        changeAlertState('Awaiting Input: ','Please start by typing in your pin number.','info');
      } else if ($scope.formState == 1) {
        $scope.formStyle = 'panel-danger';
        changeAlertState('Invalid Pin: ','Please make sure that the pin is correct!','danger');
      } else if ($scope.formState == 2) {
        $scope.formStyle = 'panel-warning';
        changeAlertState('Missing Info: ','It seems you have not signed in before... Please provide more information:','warning');
      } else if ($scope.formState == 3) {
        $scope.formStyle = 'panel-success';
        changeAlertState('Thank you! ','Ensuring the safety of your school is everyone\'s responsibility.','success');
      } else if ($scope.formState == 4) {
        $scope.formStyle = 'panel-success';
        changeAlertState('Found Your Profile: ','Please verify your name before you log in.','success');
      } else if ($scope.formState == 5) {
        $scope.formStyle = 'panel-danger';
        changeAlertState('ACCESS DENIED: ','YOU ARE NOT PERMITTED TO ACCESS THE LIBRARY AT THIS TIME!','danger');
      } else if ($scope.formState == 6) {
        $scope.formStyle = 'panel-warning';
        changeAlertState('Sorry About That','Kindly correct the information, and it will be reviewed by attendance.','danger');
      } else if ($scope.formState == 7) {
        $scope.formStyle = 'panel-success';
        changeAlertState('Welcome back,' + $scope.nameFirst + '!','Please enjoy your time at the library!','success');
      } else {
        $scope.formStyle = 'panel-warning';
        changeAlertState('Unknown State: ',' We are in an undefined state!');
      }
    }
    
    function changeAlertState(title,message,style) {
      $scope.alertState = {
        "title": title,
        "message": message,
        "style": style
      }
    }
    $scope.pushAlert = function(msg) {
      setTimeout(function() { alert(msg); });
    };
    
    $scope.isFormState = function(number) {
      if ($scope.formState == number) return true;
      return false;
    }
    
    function isEmpty(str) {
      return (!str || 0 === str.length);
    }
    
    $scope.clearPin = function() {
      console.log('Clearing Form!');
      $scope.pin = '';
      $scope.nameFirst = '';
      $scope.nameLast = '';
      setFormState(0);
    }
    
    $http.get('/api/profiles').success(function(profiles) {
      $scope.profiles = profiles;
      socket.syncUpdates('profile', $scope.profiles);
    });
    
    $scope.submit = function() {
      if ($scope.formState == 3) { // Profile did not exist, add it to the database.
      $http.post('/api/profiles', 
        {
          pin: $scope.pin,
          nameFirst: $scope.nameFirst,
          nameLast: $scope.nameLast,
          disabled: false
        }
      );
      } else if ($scope.formState == 4) { // Profile already existed so no reason to add it to the database.
        setFormState(7);
        $timeout($scope.clearPin,3000);
      } else if ($scope.formState == 6) { // Profile already existed but a name was incorrect.
        if ($scope.firstname_valid && $scope.lastname_valid) {
          setFormState(3);
        } else {
          setFormState(2);
        }
      }
    }
    
    function pinbackspace() {
      $scope.pin = $scope.pin.slice(0,-1);
    }
    
    $scope.updatePin = function() {
      if (isEmpty($scope.pin)) {
        $scope.nameFirst = '';
        $scope.nameLast = '';
        setFormState(0);
        return;
      }
      if ($scope.pin.match(/[^0-9]/)) { // Prevent the user from typing anything that is not a number.
        pinbackspace();
        $scope.updatePin();
        return;
      }
      if (!$scope.pin.match(/^.{0,5}$/)) {  // Prevent user from entering more than 5 characters.
        pinbackspace();
        return;
      }
      if ($scope.pin.match(/[0-9]{5}/)) { // Check to see if the pin contains 5 numbers. (Redundant, Yes I know...)
        for (var i in $scope.profiles) {
          var currprofile = $scope.profiles[i];
          if (currprofile.pin == $scope.pin) {
            if (currprofile.disabled) {
              console.log('Profile Disabled!');
              setFormState(5);
              if (currprofile.disableReason) {
                $scope.alertState.message = 'Reason: ' + currprofile.disableReason;
              } else {
                $scope.alertState.message = 'Reason: No reason specified. Please See Librarian';
              }
              return;
            }
            setFormState(4);
            $scope.nameFirst = $scope.profiles[i].nameFirst;
            $scope.firstname_valid = true;
            $scope.nameLast = $scope.profiles[i].nameLast;
            $scope.lastname_valid = true;
            return;
          } else {
            setFormState(2);
          }
        }
      } else {
        $scope.nameFirst = '';
        $scope.nameLast = '';
        setFormState(1);
        return;
      }
    }
    
    $scope.updateName = function(part) {
      if ($scope.nameFirst != '') {
        $scope.firstname_valid = true;
      } else {
        $scope.firstname_valid = false;
      }        
      if ($scope.nameLast != '') {
        $scope.lastname_valid = true;
      } else {
        $scope.lastname_valid = false;
      }
    }
    
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('profiles');
    });
  });