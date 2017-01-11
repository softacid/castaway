/*global angular*/

angular.module('castawayApp.controllers', []);
angular.module('castawayApp.services', []);
angular.module('castawayApp.directives', []);
angular.module('castawayApp.filters', []);

// Declare app level module which depends on filters, and services
angular.module('castawayApp', [
    'castawayApp.controllers',
    'castawayApp.services',
    'castawayApp.directives',
    'castawayApp.filters',

    // AngularJS
    'ngRoute', 'ngFileUpload', 'ngWig', 'ngSanitize'
]);

// configure our routes
var app = angular.module('castawayApp').config([
    '$routeProvider', '$locationProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {
        'use strict';
        $locationProvider.html5Mode(true);

        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');

        $routeProvider
        // route for the home page
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'homeCtrl',
                access: {
                    auth: true
                }
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'loginCtrl',
                access: {
                    auth: false
                }
            })
            .when('/newTrip', {
                templateUrl: 'views/newTrip.html',
                controller: 'tripCtrl',
                access: {
                    auth: true
                }
            })
            .when('/trips', {
                templateUrl: 'views/trips.html',
                controller: 'tripCtrl',
                access: {
                    auth: true
                }
            })
            .when('/trip/:trip_id', {
                templateUrl: 'views/singleTrip.html',
                controller: 'tripDetailCtrl',
                access: {
                    auth: true
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);


app.run(function($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and the user is not logged in
    $rootScope.$on('$routeChangeStart', function(event, next) {
        if (next.$$route.access.auth) {
            if (!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/login')
            }
        }
    });
});