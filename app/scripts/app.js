'use strict';

angular.module('ICEOapp', [
    'ngStorage',
    'ngRoute',
    'angular-loading-bar'
])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $routeProvider.
            when('/', {
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl'
            }).
            when('/signin', {
                templateUrl: 'partials/signin.html',
                controller: 'HomeCtrl'
            }).
            when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'HomeCtrl'
            }).
            when('/me', {
                templateUrl: 'partials/me.html',
                controller: 'HomeCtrl'
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