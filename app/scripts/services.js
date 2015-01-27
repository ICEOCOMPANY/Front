'use strict';

/**
 * Service to handle basic functions
 */
angular.module('ICEOapp')
    .factory('MainFactory', ['$http', '$localStorage', function ($http, $localStorage) {

        //API domain url - here you should define a domain of your REST API!
        var baseUrl = "http://back.core.iceo.zone";

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();

        //set Content-Type to prevent browser from send preflight OPTIONS to domain
        $http.defaults.headers.post["Content-Type"] = 'text/plain';
        $http.defaults.headers.put["Content-Type"] = 'text/plain';

        return {
            checkToken: function(success, error){
                $http.get(baseUrl + '/auth').success(success).error(error)
            },
            signup: function (data, success, error) {
                $http.post(baseUrl + '/users', data).success(success).error(error)
            },
            signin: function (data, success, error) {
                $http.post(baseUrl + '/auth', data).success(success).error(error)
            },
            profile: function (success, error) {
                $http.get(baseUrl + '/user').success(success).error(error)
            },
            logout: function (success, error) {
                $http.delete(baseUrl + '/auth').success(success).error(error)
                changeUser({});
            },
            remind: function(data, success, error){
                $http.post(baseUrl+"/users/"+data.email+"/reset-password").success(success).error(error)
            },
            reset: function(data, key, success, error){
                $http.put(baseUrl+"/users/reset-password/"+key, data).success(success).error(error)
            }
        };
    }
    ]);