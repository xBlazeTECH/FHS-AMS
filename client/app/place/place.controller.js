'use strict';

angular.module('fhsLibApp')
  .controller('PlaceCtrl', function ($scope, $http, $state, $window, $location, $timeout, $interval, $document, socket) {
    $scope.banner = false;
    $scope.place = $state.params.place;
    var pages = {
      library: {
        title: 'School Library',
        shortTitle: 'Library'
      },
      math: {
        title: 'Math Tutorial',
        shortTitle: 'Math'
      },
      science: {
        title: 'Science Tutorial',
        shortTitle: 'Science'
      },
      fitness: {
        title: 'Fitness Center',
        shortTitle: 'Fitness'
      }
    };
    
    $scope.option = pages[$state.params.place];
    console.log('$state.params.place:' + $scope.place.toString());
    console.log('pages[$state.params.place]: ' + pages[$state.params.place]);
        
    $scope.timedate = '*CONNECTION ERROR*';
    $scope.debug = false;
    String.prototype.isFirstCapital = function() {
      return /^[a-z]/i.test(this) && this.charAt(0) === this.charAt(0).toUpperCase();   
    }
    $scope.needMoreInfo = false;
    $scope.pinValidated = false;
    $scope.globalError = false;
    
    $scope.profids = [];
    
    $interval(function(){myTimer()}, 1000);

    function myTimer() {
      var d = new Date();
      var t = d.toLocaleString();
      $scope.timedate = t;
    }
    
    $scope.nameFirst = '';
    $scope.firstname_valid = false;
    $scope.nameLast = '';
    $scope.lastname_valid = false;
    
    $scope.alertState = {
      title:"Awaiting Input:",
      message:"Please enter your student pin below...",
      style:"info"
    };
    
    $scope.disabledReason = 'No futher information provided!';
    
    $scope.formStyle = 'panel-default';
    
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
    function setFormState(number) {
      $scope.formState = number;
      if ($scope.formState == 0) {
        $scope.formStyle = 'panel-default';
        changeAlertState('Awaiting Input: ','Please start by typing in your pin number.','info');
        $scope.globalError = false;
        $document[0].getElementById("pinbox").focus();
        var pinbox = $document[0].getElementById("pinbox");
        pinbox.focus();
      } else if ($scope.formState == 1) {
        $scope.formStyle = 'panel-default';
        changeAlertState('Invalid Pin: ','Please make sure that the pin is correct!','danger');
        $scope.globalError = false;
      } else if ($scope.formState == 2) {
        $scope.formStyle = 'panel-warning';
        changeAlertState('Missing Info: ','It seems as though we do not have you in our records. Please fill out your name for us.','warning');
        $scope.globalError = false;
      } else if ($scope.formState == 3) {
        $scope.formStyle = 'panel-success';
        changeAlertState('Thank you! ','Please just verify that your PIN, and name are correct, then click "Sign In"!','success');
        $scope.globalError = false;
      } else if ($scope.formState == 4) {
        $scope.formStyle = 'panel-default';
        changeAlertState('Found Your Profile: ','Please verify your name before you log in.','success');
        $scope.globalError = false;
      } else if ($scope.formState == 5) {
        $scope.formStyle = 'panel-danger';
        changeAlertState('ACCESS DENIED: ','YOU ARE NOT PERMITTED TO ACCESS THE LIBRARY AT THIS TIME!','danger');
        $scope.globalError = true;
      } else if ($scope.formState == 6) {
        $scope.formStyle = 'panel-warning';
        changeAlertState('Sorry About That, ','Kindly make the correction to your name below, and attendance will make the fix.','danger');
        $scope.globalError = false;
      } else if ($scope.formState == 7) {
        $scope.formStyle = 'panel-success';
        changeAlertState('Welcome back, ' + $scope.nameFirst + '!','Thank you for signing in!','success');
        $scope.globalError = false;
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
    
    var deleteProfile = function(profile) {
      $http.delete('/api/profiles/' + profile._id);
    };
    
    $scope.onload = function() {
      setFormState(0);
    }
    
    var updateProfile = function(profile) {
      $http.put('/api/profiles/' + profile._id, {
        pin: $scope.pin,
        first_name: $scope.nameFirst,
        last_name: $scope.nameLast,
        disabled: false
      });
    };
    
    var addProfile = function() {
      $http.post('/api/profiles', {
          pin: $scope.pin,
          first_name: $scope.nameFirst,
          last_name: $scope.nameLast,
          disabled: false
      });
    };
    
    $scope.submit = function() {
      if (!($scope.formState == 3 || $scope.formState == 4)) return;
      var currpin = $scope.pin;
      for (var i in $scope.profiles) {
        var prof = $scope.profiles[i];
        if (prof.pin == currpin) var existingProf = prof;
      }
      if (existingProf) { // Profile Exists
        // Add Check if the Library is Full.
        //$window.location.href = 'http://www.google.com';
        deleteProfile(existingProf);
        console.log('Profile Exists!');
        addProfile();
        signIn();
        setFormState(7);
        $timeout(reload,1200);
      } else { //Profile Doesn't Exist
        console.log('Profile Doesn\'t Exist!');
        addProfile();
        signIn();
        setFormState(7);
        $timeout(reload,1200);
      }
    }
    
    function reload() {
      $window.location.reload();
    }
        
    var signIn = function() {
      $http.post('/api/signins', {
        time: $scope.timedate,
        place: $scope.option.title,
        pin: $scope.pin,
        first_name: $scope.nameFirst,
        last_name: $scope.nameLast
      });
    }
    
    $scope.nameWrong = function() {
      setFormState(6);
    }
    
    function chgcolor(paneltype) {
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
              $scope.formStyle = 'panel-danger';
              $scope.alertState.style = 'danger';
              $scope.globalError = true;
              return;
            }
            setFormState(4);
            console.log('First Name:' + JSON.stringify($scope.profiles[i]));
            console.log('Last Name:' + JSON.stringify($scope.profiles[i]));
            $scope.nameFirst = $scope.profiles[i].first_name;
            $scope.firstname_valid = true;
            $scope.nameLast = $scope.profiles[i].last_name;
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
    
    function hasWhiteSpace(s) {
      return s.indexOf(' ') >= 0;
    }
    
    $scope.updateName = function() {
      $scope.nameFirst = $scope.nameFirst.replace(/\s/gi,'');
      $scope.nameLast = $scope.nameLast.replace(/\s/gi,'');
      if (!$scope.nameFirst.isFirstCapital()) {
        $scope.nameFirst = $scope.nameFirst.toUpperCase();
      }
      if (!$scope.nameLast.isFirstCapital()) {
        $scope.nameLast = $scope.nameLast.toUpperCase();
      }
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
      if($scope.firstname_valid && $scope.lastname_valid) {
        setFormState(3);
      } else {
        setFormState(2);
      }
    }
    
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('profiles');
    });
  });