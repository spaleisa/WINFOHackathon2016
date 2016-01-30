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
    .state('main', {
    	url: '/main',
    	templateUrl: 'templates/main.html',
    	controller: 'MainController'
    })
    .state('leaderboard', {
    	url: '/leaderboard',
    	templateUrl: 'templates/leaderboard.html',
    	controller: 'LeaderboardController'
    })
});

myApp.controller('HomeController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject, $http, $location) {
	var email = $scope.email;
	var password = $scope.password;
	logInSignUp(email, password, $scope, $firebaseObject, $firebaseAuth, $location, $http);
});

myApp.controller('MainController', function($scope $firebaseAuth, $firebaseArray, $firebaseObject, $http, $location) {
	var name = $scope.name;
	var type = $scope.type;
	var lat = $scope.lat;
	var lon = $scope.lon;
	function placeSave(name, type, lat, lon, $firebaseObject, $firebaseAuth, $location, $http, $scope);
});

myApp.controller('LeaderboardController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject, $http, $location) {

});

function placeSave(name, type, lat, lon, $firebaseObject, $firebaseAuth, $location, $http, $scope) {
	var userRef = ref.child("users");
	var name = name;
	var type = type;
	var date = date;
	var lat = lat;
	var lon = lon;
	var userobjectsRef = userRef.child($scope.email);
	var userPlaceRef = userobjectsRef.child(name);
	var PlaceObject = $firebaseObject(userPlaceRef);
	PlaceObject = {
		"name": name,
		"type": type,
		"date": date,
		"lat": lat,
		"lon": lon
	}
}

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