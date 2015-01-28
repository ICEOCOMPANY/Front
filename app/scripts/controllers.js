/* Controllers */

var ICEOapp = angular.module('ICEOapp');

/**
 * BaseController use for sing up/sin in/logout/remind password
 */
ICEOapp.controller('BaseCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$localStorage', '$route', 'MainFactory', function ($rootScope, $scope, $location, $routeParams, $localStorage, $route, MainFactory) {

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

    //check token and redirect if user want to access a area he can't
    $scope.$on('$routeChangeSuccess', function (event, next, current) {
        if ($localStorage.token !== undefined && $localStorage.token !== null) {

            var guestPaths = ["/signin", "/signup"];

            angular.forEach(guestPaths, function (value, key) {
                if (value == next.originalPath) {
                    $location.path("/");
                }
            });

        } else {

            var loggedPaths = ["/profile", "/loogut"];

            angular.forEach(loggedPaths, function (value, key) {
                if (value == next.originalPath) {
                    $location.path("/");
                }
            });

        }
    });

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
                $scope.token = res.token;
                //$location.path("/");
                console.log("w fabryce "+$scope.token)
            }
        }, function () {
            $rootScope.error = 'Failed to signin';
        });
        console.log("Na końcu "+$localStorage.token)
    };

    //User registration
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

    //Remind password
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

    //Reset password if key is valid
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

    //Set token to inform that user is authenticated
    console.log($localStorage.token)
    $scope.token = $localStorage.token;

}]);

ICEOapp.controller('FileController', ['$scope', '$upload', 'MainFactory', function ($scope, $upload, MainFactory) {

    //upload via angular-file-upload module, you can use drag&drop for further information see: https://github.com/danialfarid/angular-file-upload#manual
    var url = "http://back.core.iceo.zone/files";
    $scope.$watch('files', function () {
        if ($scope.files !== undefined) {
            $scope.upload = $upload.upload({
                url: url,
                data: {myObj: $scope.myModelObj},
                file: $scope.files
            }).progress(function (event) {
                $scope.success = "Upload pliku " + parseInt(100.0 * event.loaded / event.total) + "%";
            }).success(function (data, status, headers, config) {
                $scope.success = "Poprawnie dodano plik " + data.original_name + "!"
            }).error(function () {
                $scope.success = "Wystąpił bład w uploadzie!"
            });
        }
    });

}]);
