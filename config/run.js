PackageName.run(function($rootScope, $location, $cookieStore, $http,
    AuthenticationService, LoginService, $state, ngToast, commonService, ToastService) {

    $rootScope.globals = $cookieStore.get('globals') || null;

    //-------------------------------------//
    //Production changes to be uncommented starts here//
    //-------------------------------------//

    // console.log = function() {};


    //-------------------------------------//
    //Production changes to be uncommented ends here //
    //-------------------------------------//


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams,
        fromState, fromParams) {
        AuthenticationService.updateGlobals();
        if (toState != null && toState != undefined && toState.name != "") {
            if (toState.name != 'login' && toState.name != 'forgot-password' && toState.name != 'verify' && toState.name != 'reset-password' && toState.name != 'registration-success') {
                if ($rootScope.globals != null && $rootScope.globals != undefined && $rootScope.globals.userKey != undefined) {
                    var reqObj = {

                    }
                    LoginService.verifyLogin(reqObj).then(function(response) {
                        if (response) {

                            if (response.success == true) {
                                //toast msg on click - taha
                                $rootScope.toastSvc = ToastService;
                                //decoding the JWT key to fetch the user data
                                $rootScope.user = JSON.parse(atob($rootScope.globals.userKey.split('.')[1])).user;
                                //taha to be removed
                                $rootScope.credit = 5;
                                //every sms credit
                                $rootScope.everySmsCredit = 0.3;
                                //count of each sms
                                $rootScope.everySmsCount = 160;

                                $rootScope.maxSmsCount = $rootScope.everySmsCount * 2;
                                $rootScope.smsCount = 1;

                                $rootScope.branches = ['KL', 'Indonasia', 'Vietnam'];
                                $rootScope.brands = [{
                                    "brandName": "brand1",
                                    "id": 1,
                                    "branchName": [{ "name": "Bangsar", "id": 1 }, { "name": "KL", "id": 2 }, { "name": "Selangor", "id": 3 }]
                                }, {
                                    "brandName": "brand2",
                                    "id": 2,
                                    "branchName": [{ "name": "Bangsar", "id": 4 }, { "name": "KL", "id": 5 }, { "name": "Selangor", "id": 6 }]
                                }, {
                                    "brandName": "brand3",
                                    "id": 3,
                                    "branchName": [{ "name": "Bangsar", "id": 7 }, { "name": "KL", "id": 8 }]
                                }]
                            } else if (response.status == 'invalid_token') {
                                AuthenticationService.clearCredentials();
                                event.preventDefault();
                                commonService.toaster('danger', 'Your session has expired, please relogin', true, true);
                                $state.go('login');

                            } else {
                                AuthenticationService.clearCredentials();
                                event.preventDefault();
                                commonService.toaster('danger', 'Your session has expired, please relogin', true, true);
                                $state.go('login');

                            }
                        } else {
                            AuthenticationService.clearCredentials();
                            event.preventDefault();
                            $state.go('login');
                            commonService.noResponse();

                        }

                    });

                } else {
                    AuthenticationService.clearCredentials();
                    event.preventDefault();
                    $state.go('login');
                    commonService.toaster('danger', 'Please login first', true, true);

                }
            }
        } else {
            AuthenticationService.clearCredentials();
            event.preventDefault();
            $state.go('login');
        }
    })




});
