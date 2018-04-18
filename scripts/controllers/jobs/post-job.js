(function() {
    'use strict';

    PackageName.controller('postJobCtrl', postJobCtrl);

    postJobCtrl.$inject = ['$scope', 'postJobService', 'commonService', '$uibModal', '$rootScope'];

    function postJobCtrl($scope, postJobService, commonService, $uibModal, $rootScope) {

        //initial config/declarations 
        $scope.newJob = {}; //new job  obj
        $scope.newJob.emails=[];
        $scope.newJob.phones=[];
        $scope.newJobStatus = 1; // new job status default to 1 
        $scope.newJob.showOnAd = true;
        $scope.modalInstance = $uibModal;
        $scope.proceedBtnText = 'PROCEED';


        $scope.options = {
                height: 300,

                toolbar: [
                    ['style', ['bold', 'italic']],
                    ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                    ['view', ['fullscreen']],

                ]
            }
            // var ref = firebase.database().ref().child("data");
            // download the data into a local object
            // var syncObject = $firebaseObject(ref);
            // synchronize the object with a three-way data binding
            // click on `index.html` above to see it used in the DOM!
            // syncObject.$bindTo($scope, "data");
            // window.addEventListener("beforeunload", function(e) {
            //     var confirmationMessage = 'It looks like you have been editing something. ' + 'If you leave before saving, your changes will be lost.';

        //     (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        //     return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        // });



        $scope.onLoad = function() {

            $scope.jobTypes = ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'];
            $scope.salaryTypes = ['Per Month', 'Per Hour', 'Per Year', 'Per Project'];

            //get currency list
            var obj = {};
            commonService.getCurrencyList(obj).then(function(response) {
                if (response) {
                    $scope.currency = response.data;
                    if (response.success == true) {

                    } else if (response.status == '') {

                    } else {
                        commonService.noResponse();
                    }
                }
            })


        }

        //filter the brand branches 
        $scope.brandSelectionChange = function() {
            var temp = $rootScope.brands.filter(function(m) {
                return m.id == $scope.newJob.brandSelected.id;
            });
            $scope.branches = temp[0].branchName;
        }

        //Post new job 

        $scope.postJob = function() {

            postJobService.postJob($scope.newJob).then(function(response) {
                if (response) {

                    if (response.success == true) {

                        commonService.toaster('success', '', true, true);

                    } else if (response.status == '') {


                        commonService.toaster('', '', true, true);

                    } else if (response.status == '') {

                        
                        commonService.toaster('', '', true, true);

                    }
                } else {
                    commonService.noResponse();
                }
            })
        }

        //Save job as template

        $scope.saveAsTemplate = function() {

            postJobService.saveAsTemplate($scope.job).then(function(response) {
                if (response) {

                    if (response.success == true) {

                        commonService.toaster('success', '', true, true);

                    } else if (response.status == '') {

                        commonService.toaster('', '', true, true);

                    } else if (response.status == '') {

                        commonService.toaster('', '', true, true);

                    }
                } else {
                    commonService.noResponse();
                }
            })
        }

        //Save job as draft

        $scope.saveAsDraft = function() {

            commonService.toaster('info', 'Your Job ad is in Saved Drafts. You can access it from the menu top at the top of this page.', true, true);


            postJobService.saveAsDraft($scope.job).then(function(response) {
                if (response) {

                    if (response.success == true) {

                        commonService.toaster('success', '', true, true);

                    } else if (response.status == '') {

                        commonService.toaster('', '', true, true);

                    } else if (response.status == '') {

                        commonService.toaster('', '', true, true);

                    }
                } else {
                    commonService.noResponse();
                }
            })
        }

        $scope.modalPopUp = function(modalType) {
            // swal({
            //     html: true,
            //     // type: 'error',
            //     // title: "",
            //     // imageUrl: "images/icon-alert.svg",
            //     title: "Duplicate From Previous Job <div><ui-select ng-model='data.selected' theme='bootstrap' class='col - md - 2 md - mb - 0 col - lg - 2 lg - mb - 0 col - sm - 6 col - xs - 12 xs - mb - 10 '> < ui - select - match placeholder = 'Select A Job' > {{ $select.selected.name } } < /ui-select-match> < ui - select - choices refresh = 'fetch($select)'refresh - delay = '300'repeat = 'item in items | filter: $select.search' > {{ $index } } - {{ item.name } } < /ui-select-choices> < /ui-select></div>",
            //     customClass: 'sweet-close',
            //     showCancelButton: true,
            //     confirmButtonText: "Duplicate Job",
            //     cancelButtonText: "Cancel",
            //     confirmButtonClass: "btn-info"
            // }, function(isConfirm) {
            //     if (isConfirm) {
            //         $timeout(function() {
            //             $scope.changeTab(1); //change to register tab
            //         })
            //     }
            // });
            var modalInstance = $uibModal.open({
                templateUrl: 'views/jobs/modal-job.html',
                controller: 'modalJobCtrl',
                resolve: {
                    modalType: function() {
                        return modalType;
                    }
                }
            }).result.then(function(result) {
                console.log('result: ' + result);
            }, function() {

            })

        }

        //switch view back / proceed 
        $scope.switchStep = function(step) {
            $scope.proceedBtnText = 'PROCEED';

            if (step === 'back') {
                $scope.newJobStatus -= 1;
            } else if (step === 'forward') {
                $scope.newJobStatus += 1;

            } else {
                //do nothing 
            }
            //check the btn text to checkout
            if ($scope.newJobStatus == 3) {
                $scope.proceedBtnText = 'PROCEED TO CHECKOUT';
            }
        }
        

        $scope.addEmail = function() {

            $scope.newJob.emails.push($scope.email);

        }
        $scope.skills = [];
        $scope.skill = {};

        $scope.addSkill = function() {

            $scope.skills.push($scope.skill.name);
        }

        $scope.addPhone = function() {

            $scope.user = { phone: $scope.newPhone }

            $scope.newJob.push($scope.user);
        }

        $scope.removeFromArray = function(index, array) {

            array.splice(index, 1);

        }

        $scope.confirmOrder = function() {
            $scope.switchStep('forward');
        }

        $scope.onLoad();


    }

})();
