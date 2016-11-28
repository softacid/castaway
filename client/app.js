angular.module('home', []);
angular.module('login', []);
angular.module('adminHome', []);
angular.module('authService', []);

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
    'ngRoute',

    // All modules are being loaded here but EMPTY - they will be filled with controllers and functionality
    'home',
    'login',
    'adminHome'
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
                    auth: false
                }
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'dashboardCtrl',
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
            .when('/forgot', {
                templateUrl: 'views/forgot.html',
                controller: 'loginCtrl',
                access: {
                    auth: false
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