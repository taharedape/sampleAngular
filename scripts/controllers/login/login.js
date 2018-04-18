(function() {
    'use strict';

    PackageName.controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$rootScope', '$http', '$state', 'LoginService', 'AuthenticationService', 'ngToast', '$window', 'commonService', '$timeout'];

    function loginCtrl($scope, $rootScope, $http, $state, LoginService, AuthenticationService, ngToast, $window, commonService, $timeout) {

        $scope.user = {}; //user object
        $scope.newUser = {}; //new user for registration
        $scope.loginTxt = 'Sign In'; //default button text
        $scope.signUpTxt = 'Register'; //default button text
        $scope.loginStatus = 'login'; //default status of login ui view
        $scope.countryCode = '+60'; //default country code - this might be changed later on
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


        //change tab function
        $scope.changeTab = function(tab) {
            $scope.selectTabIndex = tab;
        };

        //login 
        $scope.login = function() {

            $scope.wrongPassword = false; //set false by default
            $scope.loginTxt = 'Signning In...';
            LoginService.login($scope.user).then(function(response) {

                if (response) {

                    if (response.success == true) {

                        AuthenticationService.setCredentials(response.token);
                        $state.go('admin', {});

                        commonService.toaster('success', 'Succesfully Logged in', true, true);

                    } else if (response.status == 'invalid_username') {

                        swal({
                            html: true,
                            // type: 'error',
                            title: " <h4 class='md-mt-20 l-h-1-5'>Uh-oh, Looks like you don't have an account with us. Sign up with us now!</h4>",
                            imageUrl: "images/icon-alert.svg",
                            text: "",
                            customClass: 'sweet-close',
                            showCancelButton: true,
                            confirmButtonText: "Register Now",
                            cancelButtonText: "Cancel",
                            confirmButtonClass: "btn-primary"
                        }, function(isConfirm) {
                            if (isConfirm) {
                                $timeout(function() {
                                    $scope.changeTab(1); //change to register tab
                                })
                            }
                        });

                        $scope.loginTxt = 'Sign In';

                    } else if (response.status == 'invalid_pass') {
                        $scope.wrongPassword = true;
                        $scope.loginTxt = 'Sign In';

                    } else if (response.status == 'not_verified') {
                        swal({
                            html: true,
                            // type: 'error',
                            title: "<h4 class='md-mt-20 l-h-1-5'> This email is not verified yet.</h4>",
                            text: "Kindly click below button and verify your email in order to proceed",
                            imageUrl: "images/icon-alert.svg",
                            showCancelButton: true,
                            confirmButtonText: "Resend Email Verification",
                            cancelButtonText: "Cancel",
                            confirmButtonClass: "btn-primary",
                        }, function(isConfirm) {
                            if (isConfirm) {
                                //if resend email 
                                $scope.resendVerification($scope.user);
                            } else {
                                //nothing
                            }
                        });

                        $scope.loginTxt = 'Sign In';

                    } else {

                        commonService.toaster('danger', 'Username or password is wrong', true, true);

                        $scope.loginTxt = 'Sign In';

                    }
                } else {
                    commonService.noResponse();
                    $scope.loginTxt = 'Sign In';

                }

            });
        }

        //sign up
        $scope.signUp = function() {

            $scope.emailStatus = '';
            $scope.contactStatus = ''; //set false by default

            $scope.signUpTxt = 'Registering...';
            if ($scope.newUser.contact_number) {
                $scope.newUser.contact_number = $scope.newUser.contact_number.replace(/\+/g, "");
            }

            LoginService.signUp($scope.newUser).then(function(response) {
                if (response) {

                    if (response.success == true) {
                        // $scope.loginStatus = 'confirmation';
                        $scope.signUpTxt = 'Register';
                        // commonService.toaster('success', 'Sign up successful', true, true);

                        $state.go("registration-success", { "email": $scope.newUser.email });

                    } else if (response.status == 'validation_error') {
                        $scope.signUpTxt = 'Register';

                        if (response.errors.email != '' && response.errors.email != undefined) {
                            if (response.errors.email == 'already_taken') {

                                $scope.emailStatus = 'taken';

                            } else if (response.errors.email == 'not_verified') {

                                $scope.emailStatus = '';

                                swal({
                                    html: true,
                                    // type: 'error',
                                    title: "<h4 class='md-mt-20 l-h-1-5'> This email has already been registered.</h4>",
                                    text: "However this email is not verified. Kindly click below button to resend.",
                                    imageUrl: "images/icon-alert.svg",
                                    showCancelButton: true,
                                    confirmButtonText: "Resend Email Verification",
                                    cancelButtonText: "Cancel",
                                    confirmButtonClass: "btn-primary",
                                }, function(isConfirm) {
                                    if (isConfirm) {
                                        //if resend email 
                                        $scope.resendVerification($scope.newUser);
                                    } else {
                                        //nothing
                                    }
                                });

                            } else {
                                $scope.emailStatus = 'invalid';

                            }
                        } else {
                            //nthn
                        }

                        if (response.errors.contact_number != '' && response.errors.contact_number != undefined) {
                            if (response.errors.contact_number == 'already_taken') {

                                $scope.contactStatus = 'taken';
                            } else {
                                $scope.contactStatus = 'invalid';

                            }
                        } else {
                            //nthn
                        }

                    } else {

                        $scope.emailStatus = 'invalid';

                        $scope.signUpTxt = 'Register';

                    }
                } else {
                    commonService.noResponse();
                    $scope.signUpTxt = 'Register';

                }
            });
        }

        //resend
        $scope.resendVerification = function(user) {

            LoginService.resendVerification(user).then(function(response) {
                if (response) {

                    if (response.success == true) {

                        commonService.toaster('success', 'Resend verification email successful', true, true);

                    } else if (response.status == 'verified_already') {

                        commonService.toaster('warning', 'Your email is already verified', true, true);

                    } else if (response.status == 'invalid_email') {

                        commonService.toaster('error', 'The email is not valid, please try again.', true, true);

                    } else {
                        commonService.toaster('error', 'The email is not valid, please try again.', true, true);
                    }
                } else {
                    commonService.noResponse();

                }
            });
        }

        //Open the live chat - TAHA
        $scope.liveChat = function() {


        }




    }

})();
