/*global angular*/

angular.module('castawayApp.controllers').controller('homeCtrl', [
    '$rootScope', '$scope','Auth',
    function ($rootScope, $scope, Auth) {
        'use strict';
        $scope.isLoggedIn = Auth.isLoggedIn();
        $scope._init = function () {


            // check to see if a user is logged in on every request
            $rootScope.$on('$routeChangeStart', function () {
                $scope.isLoggedIn = Auth.isLoggedIn();
            });
        };

        // DESTRUCTOR
        $scope.$on('$destroy', function () {

        });

        // Run constructor
        $scope._init();

        if (castawayAppConfig.debug) {
            console.log('info', '[HomeCtrl] initialized');
        }
    }
]);
