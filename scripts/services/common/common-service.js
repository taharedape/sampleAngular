(function() {
    'use strict';

    PackageName.factory('commonService', commonService);

    commonService.$inject = ['$http', '$rootScope', 'ngToast', '$sce', '$q'];

    function commonService($http, $rootScope, ngToast, $sce, $q) {
        var service = {};
        var url = 'http://52.178...'; //default api
        

        service.getMenu = getMenu;
        service.noResponse = noResponse;
        service.toaster = toaster;
        service.getLanguageList = getLanguageList;
        service.getNationalityList = getNationalityList;
        service.getStatesList = getStatesList;
        service.getCurrencyList = getCurrencyList;

        return service;

        //Fetching menu content
        function getMenu(requestObj) {
            var chosenNewsStory = "";

            setUserKey(requestObj);
            return $http({
                method: 'GET',
                url: url + 'job',
                data: 'requestObj',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': requestObj.userKey }
            }).then(handleSuccess, handleError);
        }

        // var getNewsStory = function(news_id, callback) {
        //     var deferred = $q.defer();
        //     $http({
        //             method: "GET",
        //             url: "news/article/" + news_id
        //         })
        //         .success(function(newsStory) {
        //             deferred.resolve(newsStory);
        //             console.log("RESOLVED " + newsStory);
        //         });
        //     return deferred.promise;
        // });

        //If no response / cannot reach back end
        function noResponse() {
            var message = ngToast.create({
                className: 'primary',
                content: 'Sorry, we are unable to reach our server, please try again in a few minutes.',
                //dismissButton : true,
                //dismissOnTimeout: false
            });
            return message;
        }

        function removeFromArray(index, array) {
            array.splice(index, 1);
        }

        function pushToArray(obj, array) {
            array.push(ob);
        }
        //get languages from JSON
        function getLanguageList() {
            return $http.get('json/languages.json');
        }

        //get nationalities from JSON
        function getNationalityList() {
            return $http.get('json/nationalities.json');
        }
        //get nationalities from JSON
        function getStatesList(val) {
            return $http.get('json/countries/' + val.name + '.json');
        }
        //get currency from JSON
        function getCurrencyList() {
            return $http.get('json/currency-list.json');
        }

        //generic toaster messages 

        function toaster(className, content, dismissButton, dismissOnTimeout) {
            var message = ngToast.create({
                className: className,
                content: $sce.trustAsHtml(content),
                compileContent: true,
                dismissButton: dismissButton,
                dismissOnTimeout: dismissOnTimeout

            });
            return message;
        }


        function setUserKey(requestObj) {
            requestObj.userKey = $rootScope.globals.userKey;
        }

        function getUserKey() {
            return $rootScope.globals.userKey;
        }

        function handleSuccess(res) {
            var deferred = $q.defer();

            deferred.resolve(res);
            console.log("RESOLVED " + res.data);
            return deferred.promise.$$state.value.data;
            // return res.data;

        }

        function handleError(error) {
            return error.data;

        }
    }
    PackageName.factory('ToastService', function(commonService, $rootScope) {
        var service = {};
        service.undo = function(users, action) {
            commonService.toaster('info', '' + users.length + ' have been moved back to ' + action + ' tab', true, true);
            $rootScope.action = action;
            setTimeout(function() {
                $rootScope.action = '';
            }, 3000);
        }

        return service;
    })


})();
