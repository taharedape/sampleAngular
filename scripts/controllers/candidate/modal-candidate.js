(function() {
    'use strict';

    PackageName.controller('modalCandidateCtrl', modalCandidateCtrl);

    modalCandidateCtrl.$inject = ['$scope', 'commonService', 'candidateService', '$uibModal', '$uibModalInstance', 'modalType', 'modalAttrib', 'ngToast', '$sce'];

    function modalCandidateCtrl($scope, commonService, candidateService, $uibModal, $uibModalInstance, modalType, modalAttrib, ngToast, $sce) {

        //initial config/declarations 
        $scope.modalStatus = modalType;
        $scope.modalAttrib = modalAttrib;


        //Close modal
        $scope.closeModal = function() {
            $uibModalInstance.close({ status: $scope.modalStatus, attrib: $scope.modalAttrib });
        }


        $scope.upgradeCBooster = function() {
            commonService.toaster('success', 'Upgraded job ad to Booster C!', true, true);
            $scope.closeModal();

        }

        $scope.closeJob = function() {
            commonService.toaster('info', 'This job - marketing executive is closed', true, true);
            $scope.closeModal();
        }

        //bulk action here
        // $scope.takeAction = function(action, attr) {
        //     //taha do the undo
        //     // commonService.toaster('info', '16 Applicants have been moved to '+action+' <strong class="link link-underline pointer" ng-click="undoAction('+action+')"> UNDO</strong>', false, false);

        //     ngToast.create({
        //         content: $sce.trustAsHtml('23 Applicants have been moved to '+action+' <button id="sss" class="ss" ng-click="undoAction()">Undo</button>'),
        //         compileContent: true
        //     });
        //     $scope.closeModal();
        // }

        //submit records
        $scope.submitRecord = function(action) {
            $uibModalInstance.close(action);
        }

        //taha - to do 
        $scope.purchase = function() {

        }

        //transferCandidate
        $scope.transferCandidate = function(branch) {

            commonService.toaster('info', '' + $scope.modalAttrib + ' successfully transfered to ' + branch + ' branch', true, true);
            $uibModalInstance.close();

        }
        $scope.forwardResume = function() {
            $('.modal-content > .ng-scope').each(function() {
                try {
                    $(this).scope().$dismiss();
                } catch (_) {}
            })
            var modalInstance = $uibModal.open({
                templateUrl: 'views/candidate/forwardResume-candidate.html',
                controller: 'forwardResumeCandidateCtrl',
                resolve: {
                    selectedUsers: function() {
                        return $scope.modalAttrib;
                    }
                }
            }).result.then(function(result) {
                console.log('result: ' + result);
                $scope.search();

            }, function() {

            })

        }

        //interview
        var today = new Date();
        $scope.interview={};
        // $scope.AvailableDate = new Date();

        $scope.dateFormat = 'yyyy-MM-dd';
        $scope.availableDateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            minDate: today,
            maxDate: new Date(2030, 5, 22)
        };
        $scope.availableDatePopup = {
            opened: false
        };

        $scope.OpenAvailableDate = function() {
            $scope.availableDatePopup.opened = !$scope.availableDatePopup.opened;
        };
        $scope.times = ['AM', 'PM'];
        $scope.hours = ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];

        $scope.setRole = function(value) {
            if ($scope.branchSelected != value) {
                $scope.branchSelected = value;
            } else {
                $scope.branchSelected = null;
            }
        }
        $scope.invite = function(branch){
            //taha do the calender redirection here 
            commonService.toaster('success', 'Interview invite sent successfully and added to your Calendar. Candidate moved to interview tab.', true, true);
            $uibModalInstance.close({ status: 'invite', attrib: $scope.modalAttrib });
        }
        $scope.selectBranch = function(brand, branch){
            $scope.interview.branch=brand+ ' - ' + branch;
        }


        //interview ends



    }


})();
