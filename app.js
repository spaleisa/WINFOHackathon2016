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

    function getRequest (query, boundbox, wheelchair, page, per_page, key) {
        var url = 'http://wheelmap.org/api/nodes/search?api_key=' + key;

        if (query != null) {
            url += '&q=' + query;
        }
        if (boundbox != null) {
            url += '&bbox='; // + USER LAT, LONG BOUNDS + X DISTANCE
        }
        if (wheelchair != null) {
            url += '&wheelchair=' + wheelchair;
        }
        if (page != null) {
            url += '&page=' + page;
        }
        if (per_page != null) {
            url += '&per_page=' + per_page;
        }

        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            return response;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            return null;
        });
    }

    function putRequest (node_id, type, lat, lon, wheelchair, name, wheelchair_description,
                         street, housenumber, city, postcode, website, phone, key) {
        var url = 'http://wheelmap.org/api/nodes/' + node_id + '?api_key=' + key;

        if (type != null) {
            url += '&type=' + type;
        }
        if (lat != null) {
            url += '&lat=' + lat;
        }
        if (lon != null) {
            url += '&lon=' + lon;
        }
        if (wheelchair != null) {
            url += '&wheelchair=' + wheelchair;
        }
        if (name != null) {
            url += '&name=' + name;
        }
        if (wheelchair_description != null) {
            url += '&wheelchair_description=' + wheelchair_description;
        }
        if (street != null) {
            url += '&street=' + street;
        }
        if (housenumber != null) {
            url += '&housenumber=' + housenumber;
        }
        if (city != null) {
            url += '&city=' + city;
        }
        if (postcode != null) {
            url += '&postcode=' + postcode;
        }
        if (website != null) {
            url += '&website=' + website;
        }
        if (phone != null) {
            url += '&phone=' + phone;
        }

        url += 'method=PUT';

        $http({
            method: 'POST',
            url: url
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            return response;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            return null;
        });
    }

	var email = $scope.email;
	var password = $scope.password;
	logInSignUp(email, password, $scope, $firebaseObject, $firebaseAuth, $location, $http);
});

myApp.controller('MainController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject, $http, $location) {
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
    };

    // SignIn function, reads whatever set-up the user has
    $scope.signIn = function() {
        $scope.logIn().then(function(authData){
            $scope.userId = authData.uid;
			console.log($scope.userId);
			var id = $scope.userId;
			$scope.badges = $scope.users[id].badges;
			location.reload();
        })
    };
	
    // LogIn function
    $scope.logIn = function() {
        return $scope.authObj.$authWithPassword({
            email: $scope.email,
            password: $scope.password
        })
    };
	
    // LogOut function
    $scope.logOut = function() {
        $scope.authObj.$unauth();
        $scope.userId = false;
		$location.path('/');
    }
}