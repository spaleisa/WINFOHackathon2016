'use strict';

var myApp = angular.module('myApp', ['firebase', 'ui.router']);
var ref = new Firebase("https://winfo.firebaseio.com/");


var lat1;
var lon1;

function success(pos) {
    var crd = pos.coords;

    lat1 = crd.latitude;
    lon1 = crd.longitude;

}

navigator.geolocation.getCurrentPosition(success);


function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}

myApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeController'
    })
    .state('leaderboard', {
        url: '/leaderboard',
        templateUrl: 'templates/leaderboard.html',
        controller: 'LeaderboardController'
    })
    .state('user', {
        url: '/user',
        templateUrl: 'templates/user.html',
        controller: 'UserController'
    })
    .state('list', {
        url: '/list',
        templateUrl: 'templates/list.html',
        controller: 'ListController'
    })
    $urlRouterProvider.otherwise('/');
});

myApp.controller('HomeController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject, $http, $location) {

    $scope.results = [];


    $scope.getNearby = function() {
        console.log('get nearby called');
        var box = '' + String(lon1 - 0.01) + ',' + String(lat1 - 0.01) + ','
            + String(lon1 + 0.01) + ',' + String(lat1 + 0.01);
        getRequest('nGitqa4bz26q76vzeKxG', null, box, 'unknown', null, 100);
    };


    function getRequest (key, query, boundbox, wheelchair, page, per_page) {
        var url = 'http://wheelmap.org/api/nodes?api_key=' + key;

        if (query != null && query != undefined) {
            url += '&q=' + query;
        }
        if (boundbox != null && boundbox != undefined) {
            url += '&bbox=' + boundbox;
        }
        if (wheelchair != null && wheelchair != undefined) {
            url += '&wheelchair=' + wheelchair;
        }
        if (page != null && page != undefined) {
            url += '&page=' + page;
        }
        if (per_page != null && per_page != undefined) {
            url += '&per_page=' + per_page;
        }

        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(response);
            var nodes = response.data.nodes;
            nodes.forEach(function(node) {
                var result = {};
                var dist = distance(node.lat, node.lon, lat1, lon1);
                var mapurl = 'http://wheelmap.org/en/map#/?';
                if (node.name != null || node.name != undefined) {
                    result.name = node.name;
                } else {
                    result.name = "No Name Given"
                }
                result.lat = node.lat;
                result.long = node.lon;
                result.distance = dist;
                result.status = node.wheelchair;
                result.id = node.id;
                result.url = mapurl + 'lat=' + result.lat + '&long=' + result.lon + '&zoom=15';
                result.description = node.wheelchair_description;
                result.toilet = node.wheelchair_toilet;
                $scope.results.push(result);
            });

            return response;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(response);
            return null;
        });
    }

    $scope.getNearby();

    $scope.updateNode = function() {
        console.log('funtwo clicked');
        //http://wheelmap.org/api/nodes/123?api_key=api_key&wheelchair=no&name=White+Horse&type=restaurant&lat=51.0&lon=13.4
        putRequest('nGitqa4bz26q76vzeKxG', 356551257, 'place of worship', 47.660135, -122.312389, 'yes');
    };

    function putRequest (key, node_id, type, lat, lon, wheelchair, name, wheelchair_description,
                         street, housenumber, city, postcode, website, phone) {
        var url = 'http://wheelmap.org/api/nodes/' + node_id + '?api_key=' + key;

        console.log(phone);
        if (type != null && type != undefined) {
            url += '&type=' + type;
        }
        if (lat != null && lat != undefined) {
            url += '&lat=' + lat;
        }
        if (lon != null && lon != undefined) {
            url += '&lon=' + lon;
        }
        if (wheelchair != null && wheelchair != undefined) {
            url += '&wheelchair=' + wheelchair;
        }
        if (name != null && name != undefined) {
            url += '&name=' + name;
        }
        if (wheelchair_description != null && wheelchair_description != undefined) {
            url += '&wheelchair_description=' + wheelchair_description;
        }
        if (street != null && street != undefined) {
            url += '&street=' + street;
        }
        if (housenumber != null && housenumber != undefined) {
            url += '&housenumber=' + housenumber;
        }
        if (city != null && city != undefined) {
            url += '&city=' + city;
        }
        if (postcode != null && postcode != undefined) {
            url += '&postcode=' + postcode;
        }
        if (website != null && website != undefined) {
            url += '&website=' + website;
        }
        if (phone != null && phone != undefined) {
            url += '&phone=' + phone;
        }

        //url += 'method=PUT';

        $http({
            method: 'PUT',
            url: url
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(response);
            return response;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(response);
            return null;
        });

        var name = $scope.name;
        var type = $scope.type;
        var lat = $scope.lat;
        var lon = $scope.lon;
        var date = $scope.date;
        placeSave(name, type, lat, lon, date, $firebaseObject, $firebaseAuth, $location, $http, $scope);
    }

});

myApp.controller('LeaderboardController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject, $http, $location) {

});

myApp.controller('ListController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject, $http, $location) {

});

myApp.controller('UserController', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject, $http, $location) {
    var email = $scope.email;
    var password = $scope.password;
    logInSignUp(email, password, $scope, $firebaseObject, $firebaseAuth, $location, $http);
});

function placeSave(user, name, type, lat, lon, date, $firebaseObject, $firebaseAuth, $location, $http, $scope) {
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
    console.log(email);
    console.log(password);
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

        .then(function(authData) {
            $scope.userId = authData.uid;
            $scope.users[authData.uid] = {
                email: $scope.email
            }
            $scope.users.$save();
        })
        // .then(function() {
        //     location.reload();
        // })
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
            //location.reload();
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








