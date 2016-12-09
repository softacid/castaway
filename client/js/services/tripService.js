/*global angular*/
angular.module('castawayApp.services').factory('tripService',[
    '$http', '$q',
    function ($http, $q) {
        var service = {};
        var URI = {
            newTrip: '/api/trips/',
            getTrip: '/api/trip/',
            photo: '/api/photo/'
        };

        service.addTrip = function(tripName, tripDate, tripDescription) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: URI.newTrip,
                data: {
                    'tripName' : tripName,
                    'tripDate' : tripDate,
                    'tripDescription' : tripDescription
                }
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.getTrips = function(){
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: URI.newTrip
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.getTripById = function(tripId){
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: URI.getTrip + tripId
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.getTripPhotosById = function(tripId){
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: URI.getTrip + tripId
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.deleteTrip = function(tripId){
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: URI.getTrip + tripId
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.editTrip = function(tripId, data){
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                url: URI.getTrip + tripId,
                data: {
                    tripName: data.tripName,
                    tripDate: data.tripDate,
                    tripDescription: data.tripDescription
                }
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.deleteTripPhoto = function(photoId, tripId){
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: URI.photo + photoId + '/trip/' + tripId
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        return service;
    }]);