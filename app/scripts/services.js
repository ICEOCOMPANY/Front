'use strict';

angular.module('ICEOapp')
    .factory('Main', ['$http', '$localStorage', function ($http, $localStorage) {
        //API domain url
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
        $http.defaults.headers.post["Content-Type"] = "text/plain";

        return {
            save: function (data, success, error) {
                $http.post(baseUrl + '/index.php', data).success(success).error(error)
            },
            signin: function (data, success, error) {
                $http.post(baseUrl + '/auth', data).success(success).error(error)
            },
            me: function (success, error) {
                $http.get(baseUrl + '/index.php').success(success).error(error)
            },
            logout: function (success) {
                changeUser({});
                delete $localStorage.token;
                success();
            }
        };
    }
    ]);