(function() {
	'use strict';

	PackageName.factory('postJobService', postJobService);

	postJobService.$inject = [ '$http', '$rootScope', '$state'];
	function postJobService($http, $rootScope, $state) {
		var service = {};
		var url='http://52.178.../';//default api
		service.postJob = postJob;
		
		return service;

		//postJob
		function postJob(requestObj) {
			return $http({
				method: 'POST',
				url: url+'postJob',
				data: requestObj,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).then(handleSuccess, handleError);
		}

		//handle the success call back
		function handleSuccess(res) {
			return res.data;
		}

		//set user key common service for other apis
		function setUserKey(requestObj) {
			requestObj.userKey = $rootScope.globals.userKey;
		}

		//handle the error
		function handleError(res) {
			
				return res.data;
				
			

			// return function() {
			// 	return {
			// 		success : false,
			// 		message : error
			// 	};
			// };
		}
	}
	

})();
