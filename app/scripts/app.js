/* Main App */

angular.module('ICEOapp', [
    'ngStorage',
    'ngRoute',
    'angular-loading-bar',
    'angularFileUpload'
])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

        //Router managing paths (input controller)
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

        $httpProvider.interceptors.push(['$rootScope', '$q', '$location', '$localStorage', function ($rootScope, $q, $location, $localStorage) {
            return {
                'request': function (config) {
                    //Inject Authorization header to recognition user
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = $localStorage.token;
                    }
                    return config;
                },
                'responseError': function (response) {
                    //If request contains extinct token -> clean $localStorage, token, and redirect to sign in page with error message
                    if (response.status === 401 || response.status === 403) {
                        delete $localStorage.token;
                        $rootScope.token = null;
                        $rootScope.error = "Twoja sesja wygasła! zaloguj się ponownie.";
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    }
    ]);