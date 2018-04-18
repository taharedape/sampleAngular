(function() {
    'use strict';

    PackageName.controller('forgotPassword', forgotPassword);

    forgotPassword.$inject = ['$http', '$scope', '$rootScope', 'AuthenticationService', '$state', 'LoginService', 'ngToast', 'commonService', '$window'];

    function forgotPassword($http, $scope, $rootScope, AuthenticationService, $state, LoginService, ngToast, commonService, $window) {

        $scope.forgotPass = {}; //forgotpass obj initilization  
        $scope.forgotPasswordSent = false;

        // some layout changes - login menu starts
        $scope.layout = function() {
            $scope.loginHeight = $window.innerHeight;
        }
        $scope.Onload = function() {
            $scope.layout();
        }
        $scope.Resize = function() {
            $window.onresize = function() {
                $scope.$apply(function() {
                    $scope.layout();
                })
            };
        }
        $scope.Onload();
        $scope.Resize();
        // some layout changes - login menu ends


        $scope.forgotPassword = function() {
          $scope.emailStatus = '';

            LoginService.forgotPassword($scope.forgotPass).then(function(response) {
                if (response) {
                    if (response.success == true) {
                        $scope.forgotPasswordSent = true;
                        
                        commonService.toaster('success', 'Password reset instructions has been sent to ' + $scope.forgotPass.email + '', true, true);

                    } else if (response.status == 'invalid_email') {
                        $scope.forgotPasswordSent = false;

                        commonService.toaster('danger', 'Email does not exist', true, true);

                    } else if (response.status == 'validation_error') {
                        if (response.errors.email != '' && response.errors.email != undefined) {
                            if (response.errors.email == 'not_exist_email') {

                                $scope.emailStatus = 'not_exist';
                            } else {
                                $scope.emailStatus = 'invalid';

                            }
                        }
                        $scope.forgotPasswordSent = false;


                    } else {
                        $scope.forgotPasswordSent = false;

                        
                        commonService.toaster('danger', 'An error has occured, please enter another email', true, true);

                    }
                } else {
                    $scope.forgotPasswordSent = false;
                    commonService.noResponse();


                }
            });
        }

        //Open the live chat - TO BE DONE LATER
        $scope.liveChat = function() {


        }



    }

})();
