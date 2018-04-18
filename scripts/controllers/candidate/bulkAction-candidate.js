(function() {
	'use strict';

	PackageName.controller('bulkActionCandidateCtrl', bulkActionCandidateCtrl);

	bulkActionCandidateCtrl.$inject = ['$scope', '$rootScope', 'commonService', 'candidateService', '$uibModal', '$uibModalInstance', 'action', 'selectedUsers', 'ngToast', '$sce'];

	function bulkActionCandidateCtrl($scope, $rootScope, commonService, candidateService, $uibModal, $uibModalInstance, action, selectedUsers, ngToast, $sce) {

		//initial config/declarations 

		$scope.selectedUsers = [];
		$scope.action = action;

		$scope.actionResponse = {};
		//every sms credit
		$scope.everySmsCredit = 0.3;
		//count of each sms
		$scope.everySmsCount = 160;

		$scope.maxSmsCount = $scope.everySmsCount * 2;
		$scope.smsCount = 1;

		for (var id in selectedUsers) {
			if (selectedUsers.hasOwnProperty(id)) {
				if (selectedUsers[id]) {
					$scope.selectedUsers.push(id);
				} else {

				}
			}
		}

		$scope.closeModal = function() {
			// $uibModalInstance.dismiss();
			$uibModalInstance.close({ status: $scope.action, attrib: $scope.selectedUsers });

		}

		$scope.closeJob = function() {

		}
		$scope.checkCredit = function(modalType, attrib) {
			// if ($rootScope.credit >= $scope.totalCreditSelected) {
				ngToast.create({
					content: $sce.trustAsHtml('' + $scope.selectedUsers.length + ' Applicants have been moved to ' + action + ' tab <a class="link link-underline" ng-click="toastSvc.undo(\''+$scope.selectedUsers+'\',\''+action+'\')">Undo</a>'),
					compileContent: true,
					dismissOnTimeout: true,
					dismissOnClick: true,
					dismissButton: true,
					timeout:10000,

				});
				$scope.closeModal();

			// } else {
			//     var modalInstance = $uibModal.open({
			//         templateUrl: 'views/candidate/modal-candidate.html',
			//         controller: 'modalCandidateCtrl',
			//         resolve: {
			//             modalType: function() {
			//                 return modalType;
			//             },
			//             modalAttrib: function() {
			//                 return attrib;
			//             }
			//         }
			//     }).result.then(function(result) {
			//         console.log('result: ' + result);
			//     }, function() {

			//     })
			// }
		}

		//Watching the char value if changes 
		$scope.$watch('actionResponse', function() {
			if ($scope.actionResponse.applicantMessage) {
				if ($scope.actionResponse.applicantMessage.length > $scope.everySmsCount) {
					$scope.smsCount = 2;
				} else {
					$scope.smsCount = 1;

				}
			}
			$scope.calculateTotalCreditSelected();

		}, true);

		//Calculating the total credit
		$scope.calculateTotalCreditSelected = function() {
			return $scope.totalCreditSelected = $scope.everySmsCredit * $scope.selectedUsers.length * $scope.smsCount;
		}

		//on page load 
		$scope.onLoad = function() {
			candidateService.getCandidatesSmsTemplate().then(function(response) {
				$scope.smsTemplates = response.data;
			});
			$scope.calculateTotalCreditSelected();
		}
		
		
		$scope.selectSmsTemplate = function(template){
			$scope.actionResponse.applicantMessage = template.text;
		}

		$scope.mouseOverSmsTemplate = function(template){
			$scope.actionResponse.applicantMessage = template.text;
		}

		

		$scope.onLoad();

		$scope.undoAction = function() {
			alert('Clicked!');
			commonService.toaster('info', 'Action is successfully undoed', true, true);
		}


	}


})();
