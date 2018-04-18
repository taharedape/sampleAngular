(function() {
    'use strict';

    PackageName.controller('modalJobCtrl', modalJobCtrl);

    modalJobCtrl.$inject = ['$scope', 'commonService', '$uibModal', '$uibModalInstance', 'modalType', 'ngToast'];

    function modalJobCtrl($scope, commonService, $uibModal, $uibModalInstance, modalType, ngToast) {

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

        $scope.modalStatus = modalType;

        $scope.closeModal = function() {
            $uibModalInstance.dismiss();
        }

        $scope.upgradeCBooster = function() {
            commonService.toaster('success', 'Upgraded job ad to Booster C!', true, true);
            $scope.closeModal();

        }


    }

})();
