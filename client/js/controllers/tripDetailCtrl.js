/*global angular*/

angular.module('castawayApp.controllers').controller('tripDetailCtrl', [
    '$rootScope', '$scope','Auth','tripService','$routeParams', 'Upload',
    function ($rootScope, $scope, Auth, tripService, $routeParams, Upload) {
        'use strict';
        $scope._init = function () {

            $scope.trip = [];
            $scope.editTrip = false;
            var tripId = $routeParams.trip_id || '';

            $scope.busy = true;
            $scope.ready = false;
            $scope.uploadUrl = [];
            $scope.files = [];
            $scope.photos = [];

            // check to see if a user is logged in on every request
            $rootScope.$on('$routeChangeStart', function () {
                $scope.isLoggedIn = Auth.isLoggedIn();

                // get user information on page load
                Auth.getUser()
                    .then(function (data) {
                        $scope.user = data.data;
                    });
            });

            tripService.getTripById(tripId).then(function(data){
               $scope.trip = data;
               $scope.uploadUrl = "/api/upload/" + $scope.trip._id;
            });

            tripService.getTripPhotosById(tripId).then(function(data){
                $scope.photos = data;
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
                            //console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        });
                    }
                }
            };
        };
        // DESTRUCTOR
        $scope.$on('$destroy', function () {
            $scope.trip = [];
            $scope.editTrip = false;
            //$scope.files = [];
            //$scope.uploadUrl = [];
        });

        // Run constructor
        $scope._init();

        if (castawayAppConfig.debug) {
            console.log('info', '[TripDetailCtrl] initialized');
        }
    }
]);
