(function() {
    'use strict';

    PackageName.factory('candidateService', candidateService);

    candidateService.$inject = ['$http', '$rootScope'];

    function candidateService($http, $rootScope) {
       var service = {};
        var url='/123../';//default api
        



        service.getCandidates = getCandidates;
        service.getCandidatesSmsTemplate = getCandidatesSmsTemplate;

        return service;

        //getCandidates
        function getCandidates(requestObj) {
            
            // return $http({
            //     method: 'POST',
            //     url: url+'getCandidates',
            //     data: requestObj,
            //     headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token' : requestObj.userKey }
            // }).then(handleSuccess, handleError);
            return $http.get('json/candidates.json');

        }

         //get Candidates sms templates
        function getCandidatesSmsTemplate(requestObj) {
            
            // return $http({
            //     method: 'POST',
            //     url: url+'getCandidates',
            //     data: requestObj,
            //     headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token' : requestObj.userKey }
            // }).then(handleSuccess, handleError);
            return $http.get('json/smsTemplates.json');

        }



        function setUserKey(requestObj) {
            requestObj.userKey = $rootScope.globals.userKey;
        }

        function getUserKey() {
            return $rootScope.globals.userKey;
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return error.data;
            
        }
    }

})();
