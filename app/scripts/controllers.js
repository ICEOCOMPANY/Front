'use strict';

/* Controllers */

/**
 * BaseController use for sing up/sin in/logout/remind password
 */
angular.module('ICEOapp')
    .controller('BaseCtrl', ['$rootScope', '$scope', '$location', '$localStorage', '$route', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, $route, MainFactory) {

        //First check if token exists and is not extinct
        if ($localStorage.token !== undefined && $localStorage.token !== null ) {
            MainFactory.checkToken(function () {
                console.log("Fuck yeah");
            }, function () {
                delete $localStorage.token;
                $location.path("/");
                $scope.token = null;
            });
        }

        //Function runs when user sing in on website
        $scope.signin = function () {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }
            //Use MainFactory from services.js
            MainFactory.signin(formData, function (res) {
                if (res.token == false) {
                    console.log(res)
                } else {
                    $localStorage.token = res.token;
                    $location.path("/");
                    $route.reload();
                    $scope.token = $localStorage.token;
                }
            }, function () {
                $rootScope.error = 'Failed to signin';
            })
        };

        $scope.signup = function () {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }

            MainFactory.signup(formData, function (res) {
                if (res.token == false) {
                    alert(res)
                } else {
                    $localStorage.token = res.data.token;
                    $location.path("/");
                }
            }, function () {
                $rootScope.error = 'Failed to signup';
            })
        };

        $scope.me = function () {
            MainFactory.me(function (res) {
                $scope.myDetails = res;
            }, function () {
                $rootScope.error = 'Failed to fetch details';
            })
        };

        $scope.logout = function () {
            MainFactory.logout(function () {
                delete $localStorage.token;
                $location.path("/");
            }, function () {
                alert("Failed to logout!");
            });
            $scope.token = null;
        };

        $scope.remind = function () {
            var formData = {
                email: $scope.email
            }
            MainFactory.remind(formData, function () {
                alert("Nowe hasło wyslano na e-mail");
            }, function () {
                alert("Wystąpił błąd przy przypomnieniu hasła!");
            });
        };

        $scope.token = $localStorage.token;

    }])

    .controller('MeCtrl', ['$rootScope', '$scope', '$location', 'MainFactory', function ($rootScope, $scope, $location, MainFactory) {

        MainFactory.me(function (res) {
            $scope.myDetails = res;
        }, function () {
            $rootScope.error = 'Failed to fetch details';
        })
    }]);
