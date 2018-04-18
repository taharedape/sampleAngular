(function() {
	'use strict';

	PackageName.factory('LoginService', LoginService);

	LoginService.$inject = [ '$http', '$rootScope', '$state'];
	function LoginService($http, $rootScope, $state) {
		var service = {};
		var url='http://52.178...';//default api
		
		service.login = login;
		service.signUp = signUp;
		service.logout = logout;
		service.verifyLogin = verifyLogin;
		service.forgotPassword = forgotPassword; 
		service.resetPassword = resetPassword; 
		service.verification= verification;
		service.resendVerification = resendVerification;
		service.linkVerification = linkVerification;
		service.validateResetToken = validateResetToken;
		return service;

		//login
		function login(requestObj) {
			var jsonObj = JSON.stringify(requestObj);
			return $http({
				method: 'POST',
				url: url+'login',
				data: requestObj,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).then(handleSuccess, handleError);
		}
		//sign up
		function signUp(requestObj) {
			return $http({
				method: 'POST',
				url: url+'signup',
				data: requestObj,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(handleSuccess, handleError);
		}
		//log out
		function logout(requestObj) {
			setUserKey(requestObj);

			return $http({
				method: 'GET',
				url: url+'logout',
				data: '',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token' : requestObj.userKey }
			}).then(handleSuccess, handleError);
		}
		//verify login on refresh or state change
		function verifyLogin(requestObj) {
			setUserKey(requestObj);
			return $http({
				method: 'GET',
				url: url+'job',
				data: '',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token' : requestObj.userKey }
			}).then(handleSuccess, handleError);
		}
	    //forgot password
		function forgotPassword(requestObj) {
			return $http({
				method: 'POST',
				url: url+'forgot-password',
				data: requestObj,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(handleSuccess, handleError);
		}
		//sign up link verification 
		function linkVerification(requestObj) {
			
			return $http({
				method: 'POST',
				url: url+'link-verification',
				data: requestObj,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(handleSuccess, handleError);
		}
		//sign up verification
		function verification(requestObj) {
			
			return $http({
				method: 'POST',
				url: url+'verify',
				data: requestObj,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(handleSuccess, handleError);
		}
		//reset password link check api 
		function validateResetToken(requestObj) {
			return $http({
				method: 'POST',
				url: url+'validate-reset-token',
				data: requestObj,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(handleSuccess, handleError);
		}
		//reset password
		function resetPassword(requestObj) {
			return $http({
				method: 'POST',
				url: url+'reset-password',
				data: requestObj,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(handleSuccess, handleError);
		}
		//resend verification link on signup
		function resendVerification(requestObj) {
			return $http({
				method: 'POST',
				url: url+'resend-verification',
				data: requestObj,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
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
