'use strict';

angular.module('ICEOapp', [
    'ngStorage',
    'ngRoute',
    'angular-loading-bar'
])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

        $routeProvider.
            when('/', {
                templateUrl: 'partials/home.html',
                controller: 'BaseCtrl'
            }).
            when('/signin', {
                templateUrl: 'partials/signin.html',
                controller: 'BaseCtrl'
            }).
            when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'BaseCtrl'
            }).
            when('/me', {
                templateUrl: 'partials/me.html',
                controller: 'BaseCtrl'
            }).
            when('/remind', {
                templateUrl: 'partials/remind.html',
                controller: 'BaseCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });

        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = $localStorage.token;
                    }
                    return config;
                },
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    }
    ]);