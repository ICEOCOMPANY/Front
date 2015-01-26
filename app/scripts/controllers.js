'use strict';

/* Controllers */

/**
 * BaseController use for sing up/sin in/logout/remind password
 */
angular.module('ICEOapp')
    .controller('BaseCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {

        //Function runs when user sing in on website
        $scope.signin = function () {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }
            //Use MainFactory from services.js
            MainFactory.signin(formData, function (res) {
                console.log(res)
                if (res.token == false) {
                    console.log(res)
                } else {
                    $localStorage.token = res.token;
                    alert($localStorage.token);
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
                    alert(res.data.token)
                    window.location = "/"
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
            }, function () {
                alert("Failed to logout!");
            });
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
