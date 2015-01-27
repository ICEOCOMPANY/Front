'use strict';

/* Controllers */

/**
 * BaseController use for sing up/sin in/logout/remind password
 */
angular.module('ICEOapp')
    .controller('BaseCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$localStorage', '$route', 'MainFactory', function ($rootScope, $scope, $location, $routeParams, $localStorage, $route, MainFactory) {

        //Check if token exists and is not extinct
        if ($localStorage.token !== undefined && $localStorage.token !== null) {
            MainFactory.checkToken(function (res) {
                console.log(res);
                $scope.profile = {
                    id: res.id,
                    email: res.email,
                    registered: res.registered
                }
            }, function (res) {
                delete $localStorage.token;
                $location.path("/");
                $scope.token = null;
            });
        }

        //Function runs when user sign in on website
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

        $scope.reset = function () {
            var formData = {
                new_password: $scope.new_password,
                reset_new_password: $scope.reset_new_password
            }
            MainFactory.reset(formData, $route.current.params.param, function () {
                alert("Nowe hasło wyslano wygenerowane");
            }, function () {
                alert("Wystąpił błąd przy generowaniu hasła!");
            });
        };

        $scope.token = $localStorage.token;

    }])
;
