(function() {
    'use strict';

    PackageName.factory('AuthenticationService',
        AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope',
        '$timeout'
    ];

    function AuthenticationService($http, $cookieStore, $rootScope, $timeout) {
        var service = {};
        

        // service.login = login;
        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;
        service.updateGlobals = updateGlobals;

        return service;

        function setCredentials(userKey) {



            $rootScope.globals = {
                "currentUser": loginUser.user,
                "userKey": userKey,
                'userRole': loginUser.role 
            };
            $cookieStore.put('globals', $rootScope.globals);

        }

        function clearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $cookieStore.remove('permissions');
            $cookieStore.remove('userRole');
        }

        function updateGlobals() {

            $rootScope.globals = $cookieStore.get('globals') || null;
        }
    }



})();
