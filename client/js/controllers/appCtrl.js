/*global angular*/

angular.module('castawayApp.controllers').controller('appCtrl', [
    '$rootScope', '$scope', '$location', 'Auth',
    function ($rootScope, $scope, $location, Auth) {
        'use strict';
        $scope._init = function () {
            $scope.isLoggedIn = Auth.isLoggedIn();

            // check to see if a user is logged in on every request
            $rootScope.$on('$routeChangeStart', function () {
                $scope.isLoggedIn = Auth.isLoggedIn();
            });

            /**
             * Navigation helper
             * @param {String} page
             */
            $scope.goTo = function (page) {
                $location.path(page);
            };

            $scope.doLogout = function() {
                Auth.logout();
                $scope.user = '';
                $location.path('/login');
            };
        };

        // DESTRUCTOR
        $scope.$on('$destroy', function () {

        });

        // Run constructor
        $scope._init();

        if (castawayAppConfig.debug) {
            console.log('info', '[AppCtrl] initialized');
        }
    }
]);