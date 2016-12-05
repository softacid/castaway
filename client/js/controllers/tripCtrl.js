/*global angular*/

angular.module('castawayApp.controllers').controller('tripCtrl', [
    '$rootScope', '$scope','Auth','tripService', '$location',
    function ($rootScope, $scope, Auth, tripService,$location) {
        'use strict';
        $scope._init = function () {

            $scope.trips = [];
            $scope.getTrips();
            // check to see if a user is logged in on every request
            $rootScope.$on('$routeChangeStart', function () {
                $scope.isLoggedIn = Auth.isLoggedIn();

                // get user information on page load
                Auth.getUser()
                    .then(function (data) {
                        $scope.user = data.data;
                    });
            });

            $scope.addTrip = function(tripName, tripDate, tripDescription){
                tripService.addTrip(tripName, tripDate, tripDescription).then(function(){
                    $location.path('/trips');
                })
            };


        };
        $scope.getTrips = function(){
            tripService.getTrips().then(function(data){
                $scope.trips = data;
            });
        };
        // DESTRUCTOR
        $scope.$on('$destroy', function () {

        });

        // Run constructor
        $scope._init();

        if (castawayAppConfig.debug) {
            console.log('info', '[TripCtrl] initialized');
        }
    }
]);
