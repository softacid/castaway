/*global angular*/

angular.module('castawayApp.controllers').controller('tripDetailCtrl', [
    '$rootScope', '$scope','Auth','tripService','$routeParams', 'Upload', '$location',
    function ($rootScope, $scope, Auth, tripService, $routeParams, Upload, $location) {
        'use strict';
        $scope._init = function () {

            $scope.trip = [];
            $scope.editMode = false;

            $scope.busy = true;
            $scope.ready = false;
            $scope.uploadUrl = [];
            $scope.files = [];
            $scope.photos = [];

            var tripId = $routeParams.trip_id || '';
            getTripById(tripId);
            getTripPhotosById(tripId);

            $scope.editTrip = function(){
                $scope.editMode = true;
            };

            $scope.viewTrip = function(){
                $scope.editMode = false;
            };

            $scope.deleteTrip = function(){
                $scope.editMode = false;
                tripService.deleteTrip(tripId).then(function(data){
                    $location.path('/trips');
                });

            };

            // check to see if a user is logged in on every request
            $rootScope.$on('$routeChangeStart', function () {
                $scope.isLoggedIn = Auth.isLoggedIn();

                // get user information on page load
                Auth.getUser()
                    .then(function (data) {
                        $scope.user = data.data;
                    });
            });

            $scope.$watch('files', function () {
                $scope.upload($scope.files);
            });

            $scope.upload = function (files) {
                console.log("upload... ", files);

                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        Upload.upload({
                            url: "/api/upload/" + tripId,
                            file: file
                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                        }).success(function (data, status, headers, config) {
                            getTripPhotosById(tripId);
                        });
                    }
                }
            };
        };

        var getTripById = function(tripId){
            tripService.getTripById(tripId).then(function(data){
                if(data){
                    $scope.trip = data;
                    $scope.uploadUrl = "/api/upload/" + $scope.trip._id;
                } else {
                    $location.path('/trips');
                }

            });
        };

        var getTripPhotosById = function(tripId) {
            tripService.getTripPhotosById(tripId).then(function (data) {
                $scope.photos = data;
            });
        };


        // DESTRUCTOR
        $scope.$on('$destroy', function () {
            $scope.trip = [];
            $scope.editMode = false;

            $scope.busy = true;
            $scope.ready = false;
            $scope.uploadUrl = [];
            $scope.files = [];
            $scope.photos = [];
        });

        // Run constructor
        $scope._init();

        if (castawayAppConfig.debug) {
            console.log('info', '[TripDetailCtrl] initialized');
        }
    }
]);
