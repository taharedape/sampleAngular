(function() {
    'use strict';

    PackageName.controller('viewCandidateCtrl', viewCandidateCtrl);

    viewCandidateCtrl.$inject = ['$scope', '$state', 'candidateService', '$rootScope', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', '$stateParams', '$uibModal', '$http', '$window'];

    function viewCandidateCtrl($scope, $state, candidateService, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, $stateParams, $uibModal, $http, $window) {

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams,
            fromState, fromParams) {
            $rootScope.job_id = fromParams.job_id;
            $rootScope.cat = toParams.cat;
            $rootScope.candidate_id = parseInt(toParams.candidate_id);
            $rootScope.catData = $rootScope.dataRecords.filter(function(m) {
                return m.type == $rootScope.cat;
            });
            console.log($rootScope.catData);

        })

        $scope.back = function() {
            if ($rootScope.job_id) {
                $state.go("admin.candidate", { "job_id": $rootScope.job_id });
            } else {
                $state.go("admin.candidate", { "job_id": 'allCandidate' });
            }
        }
        $scope.switchUser = function(action) {
            if (action == 'next') {
                if ($rootScope.catData.length == $rootScope.candidate_id) {

                $state.go("admin.view-candidate", { "job_id": $rootScope.job_id ,"cat": 'SHORTLISTED' , "candidate_id": $rootScope.candidate_id });

                }
                $rootScope.candidate_id += 1;
                $scope.userData = $rootScope.dataRecords.filter(function(m) {
                    return m.id == $rootScope.candidate_id;
                });
            } else if (action == 'previous') {
                $rootScope.candidate_id -= 1;
                $scope.userData = $rootScope.dataRecords.filter(function(m) {
                    return m.id == $rootScope.candidate_id;
                });
            } else {
                $scope.userData = $rootScope.dataRecords.filter(function(m) {
                    return m.id == $rootScope.candidate_id;
                });
            }
        }

        $scope.languages = [
            { name: 'English', email: 'wcoka@email.com', value: 20 },
            { name: 'Malay', email: 'sam@email.com', value: 30 },
            { name: 'Chinese', email: 'esmith@email.com', value: 10 },
            { name: 'Tamil', email: 'ncoka@email.com', value: 40 },
            { name: 'Persian', email: 'nicky@email.com', value: 10 }
        ];

        $scope.skills = [
            { name: 'Angular js', email: 'wcoka@email.com', value: 20 },
            { name: 'PHP', email: 'sam@email.com', value: 30 },
            { name: 'Java', email: 'esmith@email.com', value: 10 },
            { name: 'Typescript', email: 'ncoka@email.com', value: 40 },
            { name: 'Javascript', email: 'ncoka@email.com', value: 40 },
            { name: 'Marketing management', email: 'ncoka@email.com', value: 40 },
            { name: 'Copy writing management', email: 'ncoka@email.com', value: 40 },
            { name: 'Goodle analytics', email: 'ncoka@email.com', value: 40 },
            { name: 'Adobe experience', email: 'nicky@email.com', value: 10 }
        ];


        onLoad();

        function onLoad() {

            //checking if the param is there
            if ($rootScope.candidate_id && $rootScope.job_id) {
                $rootScope.candidate_id = $rootScope.candidate_id;
                $rootScope.job_id = $rootScope.job_id;

                $rootScope.selectedJob = $rootScope.jobs.filter(function(m) {
                    return m.id == $rootScope.job_id;
                });
                $scope.switchUser();
            } else {
                $scope.back();
            }

        }

        //modal pop up
        $scope.modalPopUp = function(modalType, attrib) {
                $('.modal-content > .ng-scope').each(function() {
                    try {
                        $(this).scope().$dismiss();
                    } catch (_) {}
                })
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/candidate/modal-candidate.html',
                    controller: 'modalCandidateCtrl',
                    resolve: {
                        modalType: function() {
                            return modalType;
                        },
                        modalAttrib: function() {
                            return attrib;
                        }
                    }
                }).result.then(function(result) {
                    //if invite modal closes
                    if (result.status == 'invite') {
                        $scope.switchUser('next');
                    }
                }, function() {


                })
            }
        


        $scope.moveApplicant = function(action) {
            $('.modal-content > .ng-scope').each(function() {
                try {
                    $(this).scope().$dismiss();
                } catch (_) {}
            });
            $scope.selectedUsers = [];

            $scope.selectedUsers.push($rootScope.candidate_id);
            var modalInstance = $uibModal.open({
                templateUrl: 'views/candidate/bulkAction-candidate.html',
                controller: 'bulkActionCandidateCtrl',
                resolve: {
                    action: function() {
                        return action;
                    },
                    selectedUsers: function() {
                        return $scope.selectedUsers;
                    }
                }
            }).result.then(function(result) {
                console.log('result: ' + result);

                $scope.switchUser('next');

            }, function() {

            })
        }
        $scope.transferBranch = function(action) {
            $('.modal-content > .ng-scope').each(function() {
                try {
                    $(this).scope().$dismiss();
                } catch (_) {}
            })
            $scope.selectedUsers = [];
            $scope.selectedUsers.push($rootScope.candidate_id);
            var modalInstance = $uibModal.open({
                templateUrl: 'views/candidate/modal-candidate.html',
                controller: 'modalCandidateCtrl',
                resolve: {
                    modalType: function() {
                        return action;
                    },
                    modalAttrib: function() {
                        return $scope.selectedUsers;
                    }
                }
            }).result.then(function(result) {
                console.log('result: ' + result);
                $scope.switchUser('next');
            }, function() {

            })
        }


        $scope.forwardResume = function(selectedUsers) {
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
                        return selectedUsers;
                    }
                }
            }).result.then(function(result) {
                console.log('result: ' + result);


            }, function() {

            })

            // } else {
            //     commonService.toaster('danger', 'Please select at least one candidate', true, true);
            // }
        }
        $scope.printPdf = function(elementId) {
            // var printwWindow = $window.open(url);
            // $window.print('images/test-resume.pdf');
            var getMyFrame = document.getElementById(elementId);
            getMyFrame.focus();
            getMyFrame.contentWindow.print();

        };








    }
})();
