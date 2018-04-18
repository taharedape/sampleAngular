(function() {
    'use strict';

    PackageName.controller('forwardResumeCandidateCtrl', forwardResumeCandidateCtrl);

    forwardResumeCandidateCtrl.$inject = ['$scope','$rootScope', 'commonService','candidateService',  '$uibModal', '$uibModalInstance', 'selectedUsers', 'ngToast'];

    function forwardResumeCandidateCtrl($scope, $rootScope, commonService, candidateService, $uibModal, $uibModalInstance, selectedUsers, ngToast) {

        //initial config/declarations 

        // if (modalType == 'duplicate') {
        //     $scope.modalStatus = 'duplicate';

        // } else if (modalType == 'template') {
        //     $scope.modalStatus = 'template';

        // }else if (modalType == 'saveTemplate') {
        //     $scope.modalStatus = 'saveTemplate';

        // }else if (modalType == 'unlockApplicants') {
        //     $scope.modalStatus = 'unlockApplicants';

        // }else{
        //     //do nothing
        // }

        $scope.selectedUsers=[];

        for (var id in selectedUsers) {
            if (selectedUsers.hasOwnProperty(id)) {
                if (selectedUsers[id]) {
                    $scope.selectedUsers.push(id);
                }else{

                }
            }
        }
        $scope.emails=[];
        $scope.addEmail = function() {
            $scope.emails.push($scope.email);
        }
         $scope.removeFromArray = function(index, array) {

            array.splice(index, 1);

        }

        $scope.closeModal = function() {
            $uibModalInstance.dismiss();
        }

        $scope.closeJob = function(){

        }
        $scope.forwardResume = function(){
            commonService.toaster('success', 'The applicant resume is successfully forwarded', true, true);
            $scope.closeModal();

        }


    }

})();
