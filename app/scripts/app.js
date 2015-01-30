angular.module('ICEOapp', [
    'ngStorage',
    'ngRoute',
    'angular-loading-bar',
    'angularFileUpload'
])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

        $routeProvider.
            when('/', {
                templateUrl: 'partials/home.html'
            }).
            when('/signin', {
                templateUrl: 'partials/signin.html'
            }).
            when('/signup', {
                templateUrl: 'partials/signup.html'
            }).
            when('/me', {
                templateUrl: 'partials/profile.html'
            }).
            when('/remind', {
                templateUrl: 'partials/remind.html'
            }).
            when('/reset/:param', {
                templateUrl: 'partials/reset.html'
            }).
            when('/signup/:key?', {
                templateUrl: 'partials/signup.html',
                controller: "ActivateCtrl"
            }).
            when('/upload', {
                templateUrl: 'partials/upload.html',
                controller: 'FileCtrl'
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