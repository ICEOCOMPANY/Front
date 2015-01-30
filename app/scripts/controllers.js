/* Controllers */

var ICEOapp = angular.module('ICEOapp');

/**
 * BaseController use for sign up/sign in/logout/remind password
 */
ICEOapp.controller('BaseCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {

    //Check if token exists and is not extinct
    $rootScope.$watch('token', function () {
        if ($localStorage.token !== undefined && $localStorage.token !== null) {
            MainFactory.checkToken(function (res) {
                console.log(res);
                $rootScope.profile = {
                    id: res.id,
                    email: res.email,
                    registered: res.registered
                }
            }, function (res) {
                delete $localStorage.token;
                $location.path("/");
                $rootScope.token = null;
            });
        }
    });

    //Check token and redirect if user want to access a area he can't
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

    $scope.logout = function () {
        MainFactory.logout(function () {
            delete $localStorage.token;
            $location.path("/");
        }, function () {
            alert("Nie udało się wylogować");
        });
        $rootScope.token = null;
    };

    //Set token to inform that user is authenticated
    $rootScope.token = $localStorage.token;

}]);

/**
 * SignUpCtrl use for registration of new user
 */
ICEOapp.controller('SignUpCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {
    //User registration
    $scope.signup = function () {
        if ($scope.password === $scope.password_repeat) {
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
                $scope.error = 'Wystąpił błąd przy rejestracji';
            })
        } else {
            $scope.error = "Hasła muszą być takie same!";
        }

    };
}]);

ICEOapp.controller('ActivateCtrl', ['$rootScope', '$scope', '$location', '$localStorage', '$route', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, $routeProvider, MainFactory) {

    console.log($routeProvider.current.params.key);
    var formData = {
        key: $routeProvider.current.params.key
    }
    MainFactory.activate(formData, function (res) {
        console.log(res)
    }, function () {
        $scope.error = 'Wystąpił błąd przy aktywacji';
    })

}]);

/**
 * SignInCtrl allows user to authentication
 */
ICEOapp.controller('SignInCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {
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
                $rootScope.token = $localStorage.token;
                $location.path("/");
            }
        }, function () {
            $scope.error = 'Błąd przy logowaniu, sprawdź login lub hasło';
        });
    };
}]);

/**
 * RemindCtrl use for remind user password
 */
ICEOapp.controller('RemindCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {
//Remind password
    $scope.remind = function () {
        var formData = {
            email: $scope.email
        }
        MainFactory.remind(formData, function () {
            alert("Nowe hasło wyslano na e-mail");
        }, function () {
            $scope.error = "Wystąpił błąd przy przypomnieniu hasła!";
        });
    };
}]);

/**
 * ResetCtrl to reset user password
 */
ICEOapp.controller('ResetCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {
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
}]);

/**
 * FileController to upload files
 */
ICEOapp.controller('FileCtrl', ['$rootScope', '$scope', '$upload', 'MainFactory', function ($rootScope, $scope, $upload, MainFactory) {

    console.log($rootScope.token);
    //$rootScope.token = "asd";

    //Upload via angular-file-upload module, you can use drag&drop for further information see: https://github.com/danialfarid/angular-file-upload#manual
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