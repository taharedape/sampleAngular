(function() {
    'use strict';

    PackageName.controller('menuCtrl', menuCtrl);

    menuCtrl.$inject = ['$scope', '$rootScope', '$window', 'commonService', 'LoginService', 'AuthenticationService', 'ngToast', '$state'];

    function menuCtrl($scope, $rootScope, $window, commonService, LoginService, AuthenticationService, ngToast, $state) {

        //state
        $scope.sidebar = false;
        $scope.backdrop = false;
        $rootScope.bodyclass = '';


        // sidebar
        $scope.sidebarToggle = function(action) {
            var action = action;
            $scope.sidebar = !$scope.sidebar;

            //enable backdrop on medium screen
            if ($window.innerWidth < 1200) {
                $scope.backdrop = !$scope.backdrop;
                if ($scope.backdrop == true) { $rootScope.bodyclass = 'backdrop-open' } else { $rootScope.bodyclass = '' }
            }

            //close
            if (action == 'close') {
                $scope.sidebar = true;
                if ($window.innerWidth < 1200) {
                    $scope.backdrop = false;
                }
            }

            //show
            if (action == 'show') {
                $scope.sidebar = false;
                if ($window.innerWidth < 1200) {
                    $scope.backdrop = true;
                }
            }
        }

        // layout
        $scope.layout = function() {
            $scope.sidebarHeight = $window.innerHeight - 55; // get sidebar height window height - header height
        }

        // on load
        $rootScope.Onload = function() {
            $scope.layout();
            $scope.backdrop = false; //close backdrop
            $rootScope.bodyclass = ''; // remove body class
            if ($window.innerWidth < 1200) { // medium size screen hide sidebar
                $scope.sidebar = true; // medium size screen hide sidebar
            } else {
                $scope.sidebar = false; // large size screen show sidebar
            }

            //Fetching the menu content - pending on Taha...
            var obj = {}
            commonService.getMenu(obj).then(function(response) {
                if (response) {

                    if (response.success == true) {

                        $rootScope.jobs = response.jobs;

                    } else {

                        commonService.noResponse();
                    }
                } else {
                        commonService.noResponse();

                }
            });
        }

        //on resize
        $scope.Resize = function() {
            $window.onresize = function() {
                $scope.$apply(function() {
                    $scope.layout();
                    $scope.backdrop = false; //close backdrop
                    $rootScope.bodyclass = ''; // remove body class
                    if ($window.innerWidth < 1200) {
                        $scope.sidebar = true; // medium size screen hide sidebar
                    } else {
                        $scope.sidebar = false; // larger size screen hide sidebar
                    }
                })

            };
        }

        //menu selection check
        $scope.menuSwitch = function(state) {
            $scope.menuSelected = state;
        }

        //logout
        $scope.logOut = function() {
            var obj = {}
            LoginService.logout(obj).then(function(response) {
                if (response) {

                    if (response.success == true) {
                        AuthenticationService.clearCredentials();
                        $state.go('login', {});
                        commonService.toaster('success', 'Logged out successfully', true, true);

                    } else {
                        AuthenticationService.clearCredentials();
                        $state.go('login', {});
                        commonService.toaster('danger', 'Something is not right, please login again', true, true);

                    }
                } else {
                     AuthenticationService.clearCredentials();
                        $state.go('login', {});
                        commonService.toaster('danger', 'Something is not right, please login again', true, true);


                }
            });
        }

        //Fetching the candidate listing based on the job ID
        $scope.getCandidates = function(candidateId) {

            $state.go("admin.candidate", { "job_id": candidateId });

        }

        // init
        $rootScope.Onload();
        $scope.Resize();



    }

})();
