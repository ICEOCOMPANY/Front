'use strict';

/* Controllers */

/**
 * BaseController use for sing up/sin in/logout/remind password
 */
angular.module('ICEOapp')
    .controller('BaseCtrl', ['$rootScope', '$scope', '$location', '$localStorage', '$route', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, $route, MainFactory) {

        $scope.checkToken = false;
        console.log("Zaczynam plik");
        //First check if token exists and is not extinct
        if ($scope.checkToken === false) {
            if ($localStorage.token !== undefined && $localStorage.token !== null) {
                console.log("Sprawdzam token");
                MainFactory.checkToken(function () {
                    console.log("Fuck yeah");
                }, function () {
                    delete $localStorage.token;
                    $location.path("/");
                    $scope.token = null;
                });
            }
            $scope.checkToken = true;
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
                password: $scope.password,
                password_repeat: $scope.password_repeat
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

        $scope.profile = function () {
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

        $scope.reset = function () {
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

    .
    controller('MeCtrl', ['$rootScope', '$scope', '$location', 'MainFactory', function ($rootScope, $scope, $location, MainFactory) {

        MainFactory.profile(function (res) {
            $scope.myDetails = res;
        }, function () {
            $rootScope.error = 'Failed to fetch details';
        })

    }]);
