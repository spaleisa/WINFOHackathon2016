/**
 * Created by Brad on 1/30/2016.
 */
var myApp = angular.module('myApp', ['firebase', 'ui.router']);
var ref = new Firebase("https://winfo.firebaseio.com/");

myApp.config(function($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeController'
    })
});

myApp.controller('HomeController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject, $http, $location) {
	var email = $scope.email;
	var password = $scope.password;
	logInSignUp(email, password, $scope, $firebaseObject, $firebaseAuth, $location, $http);
});

function logInSignUp(email, password, $scope, $firebaseObject, $firebaseAuth, $location, $http){
	// Create a variable 'ref' to reference your firebase storage
    var userRef = ref.child("users");

    // Create a firebaseObject of your users, and store this as part of $scope
    $scope.users = $firebaseObject(userRef);
	
    // Create authorization object that referes to firebase
    $scope.authObj = $firebaseAuth(ref);
	
    // Test if already logged in
    var authData = $scope.authObj.$getAuth();
    if (authData) {
        $scope.userId = authData.uid;
    }
    // SignUp function
	$scope.signUp = function() {
        // Create user
		// Here, you set default values for users if there is any
		$scope.create = false;

		// Authenticate user
        $scope.authObj.$createUser({
            email: $scope.email,
            password: $scope.password
        })

        // Once the user is created, call the logIn function
        .then($scope.logIn)

        // Catch any errors
        .catch(function(error) {
            console.error("Error: ", error);
			console.log(error.code);
			if(error.code == "INVALID_EMAIL"){
				alert("Email is invalid")
			}
			if(error.code == "EMAIL_TAKEN"){
				alert("Email already in use")
			}
        });
    }

    // SignIn function, reads whatever set-up the user has
    $scope.signIn = function() {
        $scope.logIn().then(function(authData){
            $scope.userId = authData.uid
			console.log($scope.userId)
			var id = $scope.userId;
			$scope.badges = $scope.users[id].badges
			location.reload();
        })
    }
	
    // LogIn function
    $scope.logIn = function() {
        return $scope.authObj.$authWithPassword({
            email: $scope.email,
            password: $scope.password
        })
    }
	
    // LogOut function
    $scope.logOut = function() {
        $scope.authObj.$unauth();
        $scope.userId = false;
		$location.path('/');
    }

}

function success(pos) {
    var crd = pos.coords;

    console.log('Your current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('More or less ' + crd.accuracy + ' meters.');
};

navigator.geolocation.getCurrentPosition(success);
