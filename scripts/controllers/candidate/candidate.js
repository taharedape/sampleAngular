(function() {
    'use strict';

    PackageName.controller('candidateCtrl', candidateCtrl);

    candidateCtrl.$inject = ['$scope', '$state', '$location', 'candidateService', '$rootScope', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', '$stateParams', 'commonService', 'myCache', '$uibModal'];

    function candidateCtrl($scope, $state, $location, candidateService, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, $stateParams, commonService, myCache, $uibModal) {

        //obj/val declarations 
        $scope.education = {};
        $scope.salary = {};
        $scope.gender = {};
        $scope.salaryIndex = -1;
        $scope.ageIndex = -1;
        $scope.experienceIndex = -1;
        $scope.genderIndex = -1;

        //defalt to compatibiity
        $scope.sortSelected = 'compatibility';

        //checking if the param is there
        $scope.job = {};
        if ($stateParams.job_id) {
            $scope.job.job_id = $stateParams.job_id;
            $scope.$watch('commonService.getMenu', function(newVal) {
                console.log(newVal);
                if ($rootScope.jobs) {

                    $rootScope.selectedJob = $rootScope.jobs.filter(function(m) {
                        return m.id == $scope.job.job_id;
                    });
                }
            }, true);
            // $scope.$watch('selectedItemsFilter4', function() {
            //     if ($scope.nation) {


            //         $scope.nationality = $scope.selectedItemsFilter4[0].label;
            //     }
            //     $scope.search();

            // }, true);

        } else {
            $state.go('admin');
        }

        //init and onload starts
        $scope.onLoad = function() {
            commonService.getLanguageList().then(function(response) {
                $scope.languages = response.data;
            });
            commonService.getNationalityList().then(function(response) {
                $scope.nationalities = response.data;
            });
            commonService.getCurrencyList().then(function(response) {
                $scope.currencies = response.data;
            });
                // commonService.getStatesList().then(function(response) {
                //     $scope.states = response.data;
                // });
            }
            //taha remve the deafult timer later
            $scope.endTime = 'January 1, 2018 (GMT)';

            $scope.defaultBtnText = 'Add';
            $scope.salaryBtnText = $scope.defaultBtnText;
            $scope.ageBtnText = $scope.defaultBtnText;
            $scope.experienceBtnText = $scope.defaultBtnText;


            $scope.onLoad();

        //filter starts 
        
        //brands
        $scope.brands = [{
            "brandName": "brand1",
            "branchName": [{ "name": "Bangsar" }, { "name": "KL" }, { "name": "Selangor" }]
        }, {
            "brandName": "brand2",
            "branchName": [{ "name": "Bangsar" }, { "name": "KL" }, { "name": "Selangor" }]
        }, {
            "brandName": "brand3",
            "branchName": [{ "name": "Bangsar" }, { "name": "KL" }]
        }]
            //  $scope.$watch('education', function(newValue, oldValue) {
            //     if ($scope.education) {
            //         console.log($scope.education);
            //     }
            //     $scope.search();

        // }, true);
        $scope.updateFilter = function(val) {
            if ($scope.selectedItemsFilter4[val] == 'primary School') {
                $scope.education.primarySchool = false;
            } else if ($scope.selectedItemsFilter4[val] == 'degree') {
                $scope.education.degree = false;
            } else if ($scope.selectedItemsFilter4[val] == 'high School') {
                $scope.education.highSchool = false;
            } else if ($scope.selectedItemsFilter4[val] == 'master/Phd') {
                $scope.education.masterPhd = false;
            } else if ($scope.selectedItemsFilter4[val] == 'diploma') {
                $scope.education.diploma = false;
            }
            // $scope.education[$scope.selectedItemsFilter4[val]]=false;
        }

        $scope.findState = function(val) {

            commonService.getStatesList(val).then(function(response) {
                $scope.states = response.data;
            });
        }

        $scope.filter = function(type, value, attr, brand) {
            if (type == 'branch') {
                if (attr == false || attr == undefined) {
                    $scope.remove(brand + '-' + value.name);
                } else {
                    $scope.selectedItemsFilter4.push(brand + '-' + value.name);
                }
            } else if (type == 'education') {
                if (attr == true) {
                    $scope.selectedItemsFilter4.push(value);
                } else {
                    $scope.remove(value);
                }
            } else if (type == 'nationality') {
                var tempNation = $scope.selectedItemsFilter4.filter(function(e) {
                    return e == value;
                })
                if (tempNation == null || tempNation == undefined || tempNation.length == 0) {
                    $scope.selectedItemsFilter4.push(value);
                } else {
                        //do nothing 
                    }
                } else if (type == 'language') {
                    var tempLang = $scope.selectedItemsFilter4.filter(function(e) {
                        return e == value;
                    })
                    if (tempLang == null || tempLang == undefined || tempLang.length == 0) {
                        $scope.selectedItemsFilter4.push(value);
                    } else {
                        //do nothing 
                    }
                } else if (type == 'location') {
                    var tempLocation = $scope.selectedItemsFilter4.filter(function(e) {
                        return e == value;
                    })
                    if (tempLocation == null || tempLocation == undefined || tempLocation.length == 0) {
                        $scope.selectedItemsFilter4.push(value);
                    } else {
                        //do nothing 
                    }
                } else if (type == 'salary') {
                    $scope.salaryBtnText = 'Update';
                    if ($scope.salaryIndex === -1) {
                        $scope.selectedItemsFilter4.push(value);
                        $scope.salaryIndex = $scope.selectedItemsFilter4.length - 1;
                    } else {
                        $scope.selectedItemsFilter4[$scope.salaryIndex] = value;
                    }
                } else if (type == 'age') {
                    if ($scope.ageIndex === -1) {
                        $scope.ageBtnText = 'Update';
                        $scope.selectedItemsFilter4.push(value + ' years');
                        $scope.ageIndex = $scope.selectedItemsFilter4.length - 1;
                    } else {
                        $scope.selectedItemsFilter4[$scope.ageIndex] = value + ' years';
                    }
                } else if (type == 'experience') {
                    if ($scope.experienceIndex === -1) {
                        $scope.experienceBtnText = 'Update';
                        $scope.selectedItemsFilter4.push(value + ' - exp. years');
                        $scope.experienceIndex = $scope.selectedItemsFilter4.length - 1;
                    } else {
                        $scope.selectedItemsFilter4[$scope.experienceIndex] = value + ' - exp. years';
                    }
                } else if (type == 'gender') {
                    if ($scope.genderIndex === -1 && value != 'both') {
                        $scope.selectedItemsFilter4.push(value);
                        $scope.genderIndex = $scope.selectedItemsFilter4.length - 1;
                    } else if (value == 'both') {
                        $scope.remove($scope.genderIndex);
                    } else {
                        $scope.selectedItemsFilter4[$scope.genderIndex] = value;
                    }
                } else if (type == 'customFilter') {
                    $scope.selectedItemsFilter4.push(value);
                }
                $scope.search();

            }
            //filter ends

        //clear filter
        $scope.clearFiler = function() {
            $scope.selectedItemsFilter4 = '';
        }

        //init and onload ends


        $scope.click = function() {
            $scope.search();
        }

        //filter selection
        $scope.selectedItemsFilter4 = [];


        $scope.filter4Setting = {
            scrollableHeight: '200px',
            scrollable: true,
            enableSearch: true,
            disable: false,
            idProp: 'label',
            externalIdProp: 'label',
        }

        //swtich sort
        $scope.switchSort = function(type) {
            $scope.sortSelected = type;
            $scope.search();
        }


        $scope.switchFilter = function(type) {
            $scope.candidateType = type;
            $scope.search();
        }


        //Fetching the candidate listing based on the job ID
        $scope.getCandidates = function() {

            candidateService.getCandidates($scope.job).then(function(response) {
                if (response) {
                    if (response.success == true) {
                        commonService.toaster('success', 'Loaded successfully', true, true);
                    } else if (response.status == '') {
                        commonService.toaster('danger', response.message, true, true);
                    } else {
                        commonService.noResponse();

                    }
                } else {
                    commonService.noResponse();

                }
            });

        }
        $scope.getCandidates();

        $scope.remove = function(index) {
            if (index == $scope.salaryIndex) {
                $scope.salaryIndex = -1; //back to initials
                $scope.salaryBtnText = $scope.defaultBtnText;
            } else if (index == $scope.genderIndex) {
                $scope.genderIndex = -1; //back to initials
                $scope.salaryBtnText = $scope.defaultBtnText;
            } else if (index == $scope.ageIndex) {
                $scope.ageIndex = -1; //back to initials
                $scope.ageBtnText = $scope.defaultBtnText;
            } else if (index == $scope.experienceIndex) {
                $scope.experienceIndex = -1; //back to initials
                $scope.experienceBtnText = $scope.defaultBtnText;
            }

            $scope.updateFilter(index);

            // var rm = $scope.selectedItemsFilter4.indexOf(index);
            $scope.selectedItemsFilter4.splice(index, 1);
            $scope.search();


        }

        $scope.message = '';
        $scope.search = search;
        $scope.getName = getName;
        $scope.getType = getType;
        $scope.getStatus = getStatus;
        $scope.getLogo = getLogo;
        $scope.getDate = getDate;
        $scope.searchCriteria = {};
        $scope.dtInstance = {};
        $scope.sortBy = {};
        $scope.selected = {};
        $scope.selectAll = false;
        $scope.candidateType = 'NEW';
        // $scope.nationality = 'ALL';

        $scope.items1 = [
        { name: 'Techinal officer' },
        { name: 'Techinal analyst' },
        { name: 'Web developer' },
        { name: 'Web designer' },
        { name: 'Front end dev' },
        { name: 'Back end dev' },
        ];
        $scope.items2 = [
        { name: 'KL' },
        { name: 'Johor' },
        { name: 'Melaka' },
        { name: 'Selangor' }
        ];

        $scope.items3 = [
        { name: 'Age' },
        { name: 'Education' },
        { name: 'Nationality' },
        { name: 'Language' },
        { name: 'Expected salary' },
        { name: 'Location' }
        ];
        $scope.item2Select = function() {
            $scope.search();
        }
        $scope.item3Select = function(selected) {
            if (selected.name == 'Age') {

                $scope.filter4 = [{
                    "label": "20-25",
                    "id": "AL"
                }, {
                    "label": "25-30",
                    "id": "AK"
                }, {
                    "label": "30+",
                    "id": "AS"
                }]
                $scope.nation = false;



            } else if (selected.name == 'Language') {
                $scope.filter4 = [{
                    "label": "English",
                    "id": "AL"
                }, {
                    "label": "Malay",
                    "id": "AK"
                }, {
                    "label": "Chinese",
                    "id": "AS"
                }]
                $scope.nation = false;

            } else if (selected.name == 'Nationality') {
                $scope.nation = true;
                $scope.filter4 = [{
                    "label": "Malaysian",
                    "id": "AL"
                }, {
                    "label": "Indonasian",
                    "id": "AK"
                }, {
                    "label": "Singaporian",
                    "id": "AS"
                }]
            }


        }

        onLoad();

        function onLoad() {

            var requestObj1 = {}


            setDatatableOptions();
        }
        // $scope.$watch('selectedItemsFilter4', function() {
        //     if ($scope.nation) {


        //         $scope.nationality = $scope.selectedItemsFilter4[0].label;
        //     }
        //     $scope.search();

        // }, true);


        $scope.viewCandidate = function(id) {
            if (id) {
                $state.go("admin.view-candidate", { "job_id": $scope.job.job_id, "cat": $scope.candidateType, "candidate_id": id });
            }
        }
        $scope.selectedUsersTaha = [];
        $scope.CandidateSelectAction = function(action, selectedUsers) {
            // for (var id in selectedUsers) {
            //     if (selectedUsers.hasOwnProperty(id)) {
            //         if (selectedUsers[id]) {
            //             $scope.selectedUsersTaha.push(id);
            //         } else {

            //         }
            //     }
            // }
            $scope.selectedUsers = {};
            $scope.selectedUsers.users = [];
            $scope.selectedUsers.users.push(selectedUsers);
            $scope.selectedUsers.action = action;

            if (selectedUsers != undefined) {
                $scope.bulkAction(action, selectedUsers);

            } else {

                commonService.toaster('danger', 'Please select at least one candidate ' + action + ' ' + selectedUsers + '', true, true);
            }


        }

        var titleHtml = '<div  class="checkbox text-grey-light" ><label><input type="checkbox" name="" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"><span>Select all</span></label></div>';
        var titleHtml2 = '<div style="position: absolute;left: 131px;top: 17px; " class="select"><li class="dropdown list-style-none" style="width: 120px"><a data-toggle="dropdown" class="text-grey-light"><div class="form-group group xs-mb-0"><div class="group auto"><div>Select Action</div></div><div class="group xs-pl-5"><span class="caret"></span></div></div> </a><ul class="dropdown-menu min-w-250"><li><a ng-click="bulkSms(selected)">Bulk SMS</a></li><li><a ng-click="forwardResume(selected)">Forward Resume</a></li><li class="divider"></li><li><a ng-click="CandidateSelectAction(\'reject\', selected)">Reject</a></li><li><a ng-click="CandidateSelectAction(\'Onhold\', selected)">Onhold</a></li><li><a ng-click="CandidateSelectAction(\'shortlist\', selected)">Shortlisted</a></li><li><a ng-click="CandidateSelectAction(\'Hire\', selected)">Hire</a></li></ul></li></div>';
        //hidden xs 
        var h = '<select class="gray-darker b-none" ng-model="action" ng-init="action=\'\'" ng-change="select(selected, action)"><option value="">Select Action</option><option value="sms">Bulk SMS</option><option value="forwardResume">forwardResume</option><option value="Reject">Reject</option><option value="Onhold">Onhold</option><option value="Hire">Hire</option></select><span class="caret"></span>'
        var titleHtml3 = '<div style="position: absolute;right: 31px;top: 17px;" class="select text-grey-light hidden-xs"><div class="pull-right">Sort by:  <span ng-click="switchSort(\'compatibility\')" ng-class="{\'text-white\':sortSelected==\'compatibility\'}">Compatibility</span> | <span ng-click="switchSort(\'date\')" ng-class="{\'text-white\':sortSelected==\'date\'}">Date</span></div>';
        $scope.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle(titleHtml + titleHtml2 + titleHtml3).withOption('width', '100px').notSortable().renderWith(getLogo),
            // DTColumnBuilder.newColumn(-1).withTitle(titleHtml2).renderWith().withOption('orderable', false),
            // DTColumnBuilder.newColumn('logoUrl').withTitle('').renderWith(getLogo).withOption('orderable', false),
            DTColumnBuilder.newColumn('name').withTitle('').renderWith(getName).withOption('orderable', false).withOption('width', '150px'),
            DTColumnBuilder.newColumn('address').withTitle('').renderWith(getAddress).withOption('orderable', false).withOption('width', '500px'),
            DTColumnBuilder.newColumn('type').withTitle('').renderWith(getType).withOption('orderable', false)
            ];

            $scope.toggleAll = function(selectAll, selectedItems) {
            // if(selectAll==true){
            //     $scope.selectedItems=dataRecords;
            // }else{
            //     $scope.selectedItems=[];

            // }
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }

        $scope.toggleOne = function(selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if (!selectedItems[id]) {
                        $scope.selectAll = false;
                        return;
                    }
                }
            }
            $scope.selectAll = true;
            // if (selected == true) {
            //     $scope.selectedItems.push(data);

            // } else {
            //     $scope.selectedItems.filter(function(e) {
            //         return e.id != data.id

            //     });

            // }
            // if ($scope.selectedItems.length == dataRecords.length) {

            // } else {
            //     $scope.selectAll = false;

            // }
        }

        function getRecords(data, callback, settings) {
            var obj = {};
            $scope.searchCriteria.pageCount = data.start;

            $scope.searchCriteria.sortColumn = getColumnNameByNum(settings.aaSorting[0][0]);
            if (data.order[0].column != 0) {
                if (data.order[0].dir == "asc" || data.order[0].dir == "ASC") {
                    $scope.searchCriteria.sortType = "ASC";
                } else {
                    $scope.searchCriteria.sortType = "DESC";
                }
            }
            // var cachedData = myCache.get('myData');
            //     if(cachedData){
            //         console.log(cachedData);
            // prepareDataRecords(callback, cachedData);


            // }else{
            // myCache.put('myData', data);
            // console.log(cachedData);
            candidateService.getCandidates(obj).then(function(response) {

                response.data = response.data.filter(function(m) {
                    return m.type == $scope.candidateType || $scope.candidateType == 'ALL';
                });
                // response.data = response.data.filter(function(m) {
                //     return m.nationality == $scope.nationality || $scope.nationality == 'ALL';
                // });
                $scope.total = response.data.length;

                // $scope.dataObj = response;
                // $scope.datsResults = response;
                prepareDataRecords(callback, response);
            })

            // }
            // $scope.categories = [{ 'id': 1, 'type': 'shortlisted', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 2, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 3, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 4, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 5, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 6, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 7, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 8, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahdddda' }, { 'id': 9, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 10, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 11, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end developdd' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end develop' }, { 'id': 1, 'type': 'Onhold', 'address': '01229323. some text here and there 50000 salary, photoshop, illustrator, 3d max, front end dev and many more', 'logoUrl': 'logo', 'name': 'tahashokouhi front-end developss' }];

        }

        function getStatus(data, type, full, meta) {
            if (data != null && data != undefined) {
                if (data == 'ACTIVE') {
                    return '<div ><span class="btn-active">{{"' + data + '"}}</span></div>';
                } else {
                    return '<div ><span class="btn-orange">{{"' + data + '"}}</span></div>';
                }
            } else {
                return '<div ><span class="t-a-c">-</span></div>';
            }
        }

        function getD(data, type, full, meta) {

            if (data != null && data != undefined) {

                return '<div ng-click="viewCandidate(' + data.id + ')" class="m-h-70 xs-mt-20 pointer"><span class="btn-active">{{"' + data + '"}}</span></div>';

            } else {
                return '<div ng-click="viewCandidate(' + data.id + ')" class="m-h-70 xs-mt-20 pointer"><span class="t-a-c">-</span></div>';
            }

        }

        function getName(data, type, full, meta) {

            if (data != null && data != undefined) {
                return '<div class="text-grey-light m-h-70 xs-mt-20 pointer t-t-capitalize" ng-click="viewCandidate(' + full.id + ')"><strong class="text-black f-s-16" ng-if="' + full.unlocked + '">{{"' + data + '"| cut:false:3:\'...\'}}<img src="images/exclaimation.svg" width="13" class="xs-ml-5" ng-click="$event.stopPropagation();modalPopUp(\'blockedCandidate\',\' \')" ></img></strong><strong ng-if="!' + full.unlocked + '" class="text-black f-s-16">{{"' + data + '"| cut:false:15:\'\'}}<img src="images/exclaimation.svg" width="13" class="xs-ml-5" ng-click="$event.stopPropagation();modalPopUp(\'blockedCandidate\',\' \')" ></img></strong><div class="text-grey-light xs-mt-5">{{"' + full.position + '"| cut:true:20:\'...\'}}</div><div class="link link-default text-info f-w-700" ng-if="' + full.unlocked + '" ng-click="$event.stopPropagation();modalPopUp(\'unlockCandidate\',\' \')">Unlock H/P</div><div ng-if="!' + full.unlocked + '">{{"' + full.phone + '"+" "}}</div></div>';
            } else {
                return '<div class="text-grey-light m-h-70 xs-mt-20 pointer t-t-capitalize" ng-click="viewCandidate(' + full.id + ')"><span>-</span></div>';
            }
        }

        function getAddress(data, type, full, meta) {
            if (full.percentage === 100) {
                full.type2 = 'success';
            } else if (full.percentage >= 50 && full.percentage <= 99) {
                full.type2 = 'primary';
            } else {
                full.type2 = 'danger';
            }
            full.viewSummary = false;
            if (data != null && data != undefined) {
                return '<div class="text-grey-light m-h-70 xs-mt-20 pointer t-t-capitalize" ng-click="viewCandidate(' + full.id + ')"><span><span ng-if="!' + full.unlocked + '">{{"' + full.salary + '"}}</span><span class="link link-default text-info f-w-700" ng-if="' + full.unlocked + '" ng-click="$event.stopPropagation();modalPopUp(\'unlockCandidate\',\' \')">Unlock salary </span><i class="fa fa-circle f-s-5 xs-m-10" aria-hidden="true"></i><span>{{"' + full.degree + '"}}</span><div> {{"' + data + '"| cut:true:70:\'...\'}}</div><div class="col-xs-12 xs-p-0 f-w-700" ng-click="$event.stopPropagation(); modalPopUp(\'CandidateMatches\',' + full.percentage + ')"><span class="col-xs-6 col-sm-3 xs-p-0 sm-mt-10 xs-mt-5" ><uib-progressbar  ng-class="{\'border-1px-danger\': \'' + full.type2 + '\'==\'danger\', \'border-1px-primary\': \'' + full.type2 + '\'==\'primary\'}" type="' + full.type2 + '"  value="' + full.percentage + '"></uib-progressbar></span><span class="col-xs-12 col-sm-5 xs-pl-5 xs-mt-5"  ng-class="{\'text-success\':\'' + full.type2 + '\'==\'success\', \'text-danger\':\'' + full.type2 + '\'==\'danger\', \'text-primary\':\'' + full.type2 + '\'==\'primary\'}">{{' + full.percentage + '}}% Match</span></div><div class="link link-default text-info f-w-700" ng-click="viewSummary($event, \'' + full.name + '\');$event.stopPropagation()"><i class="fa fa-plus-circle xs-mr-10 f-s-17" aria-hidden="true"></i>View summary</div><div ng-if="' + full.viewSummary + '==\'true\'">hhh{{' + full.name + '}}</div>';
            } else {
                return '<div class="text-grey-light m-h-70 xs-mt-20 pointer t-t-capitalize" ng-click="viewCandidate(' + full.id + ')"><span>-</span></div>';
            }
        }
        $scope.viewSummary = function(me, full) {
            $('tr').removeClass('bg-gray-lighter');

            if (me.target.open) {

                $(me.target).closest('tr').next().remove();
                me.target.open = false;
                $(me.target).parents('tr').removeClass('bg-gray-lighter');

            } else {
                me.target.open = true;

                // $(me.target).parents('.table').find('.child').remove();
                // $(me.target).closest('tr.').next().remove();

                //taha change this back to original resume download
                $('<tr class="child bg-gray-lighter"><td class="child xs-pl-120 xs-pr-120" colspan="8"><div class="col-sm-12 col-xs-12 xs-pt-30 text-grey-light"><p>lawdla lwdawld lawldawldal dwdlwdlaw ldawldlfeasejfea wad lwldadl awl dlawd lawl dlaw dlawl dal wld lawl da DWLAW DLAL DLAW DKAWK D KAWK DAWK lawdla lwdawld lawldawldal dwdlwdlaw ldawldlfeasejfea wad lwldadl awl dlawd lawl dlaw dlawl dal wld lawl da DWLAW DLAL DLAW DKAWK D KAWK DAWK</p></div><div class="col-xs-12"><span class=" text-info link link-default"><i class="fa fa-download" aria-hidden="true"></i> <a target="_self" href="images/chat.svg" download="images/chat.svg">Download Resume</a></span></div></td></tr>').insertAfter($(me.target).closest('tr')).fadeIn();
                $(me.target).closest('tr').addClass('bg-gray-lighter');

            }
            // $(this).parents('').append('<tr class="child"><td class="child" colspan="2"><ul data-dtr-index="142"><li data-dtr-index="2" data-dt-row="142" data-dt-column="2"><span class="dtr-title">Last name</span> <span class="dtr-data">Whateveryournameis</span></li></ul></td></tr>');
        }


        function getType(data, type, full, meta) {

            if (data != null && data != undefined) {
                //hidden xs
                return '<div class="text-grey-light m-h-70 xs-mt-20 pointer text-right" ng-click="viewCandidate(' + full.id + ')"><strong class="text-black" ng-class="{\'text-primary\':\'' + data + '\'==\'NEW\', \'text-success\':\'' + data + '\'==\'HIRED\' || \'' + data + '\'==\'INTERVIEW\'}">{{"' + data + '"}}</strong><div class="col-xs-12 xs-p-0"><span class="xs-mt-5 sm-mt-10" ng-bind="\'' + full.date + '\'"></span></div><div class="xs-mt-5 sm-mt-10"><img ng-if="' + full.messages + '<1" src="images/chat.svg" width="17px"></img><span ng-if="' + full.messages + '>0" class="text-success"><img class="xs-mr-5" src="images/green-chat.svg" width="17px"></img>' + full.messages + '</span><span> Chat</span></div></div>';
            } else {
                return '<div class="text-grey-light m-h-70 xs-mt-20 pointer text-right" ng-click="viewCandidate(' + full.id + ')"><span class="text-primary">-</span></div>';
            }
        }

        function getLogo(data, type, full, meta) {

            $scope.selected[full.id] = false;
            var checkbox = '';

            if (data != null && data != undefined) {
                return checkbox + '<div class="checkbox m-h-70 pointer" ng-click="viewCandidate(' + data.id + ')"><label><input type="checkbox" name="" ng-model="selected[' + data.id + ']" ng-click="$event.stopPropagation();toggleOne(selected)"></input><span class="text-grey"></span></label><span class="green-circle xs-ml-55 xs-mt-5 absolute"></span><div class="b-r-9999 d-inline-table " ng-class="{\'bg-black opacity-1\': \'' + full.unlocked + '\'==\'true\'}"><img ng-class="{\'opacity-5\': \'' + full.unlocked + '\'==\'true\'}" class="b-r-9999" width="60" src="images/user.jpg"><i ng-if="' + full.unlocked + '" class="fa fa-lock absolute b-r-9999 text-white unlock-img" aria-hidden="true" ng-click="$event.stopPropagation();modalPopUp(\'unlockCandidate\',\' \')"></i></div>';
            } else {
                return checkbox + '<div class="pointer"ng-click="viewCandidate(' + full.id + ')"><span width="70px" height="40px" src="img/no-logo.png"></span></div>';
            }
        }

        function getDate(data, type, full, meta) {
            if (data != null && data != undefined) {
                return '<div title="' + data + '"><span>{{"' + data + '"|currentdate}}</span></div>';
            } else {
                return '<div><span class="t-a-c">-</span></div>';
            }
        }


        function prepareDataRecords(callback, response) {

            $rootScope.dataRecords = response.data;
            $scope.sortBy = getColumnNumByName(response);
            // $scope.dtOptions.withOption('aaSorting', [$scope.sortBy, 'asc']);
            for (var i = 0; i < $rootScope.dataRecords.length; i++) {
                $rootScope.dataRecords[i].selected = false;
            }
            callback({
                "recordsTotal": response.length,
                "recordsFiltered": response.length,
                "data": $rootScope.dataRecords
            });


        }


        function setDatatableOptions() {
            $scope.dtOptions = DTOptionsBuilder
            .newOptions()
            .withOption('serverSide', true)
            .withOption('processing', true)
            .withOption('lengthMenu', false)
            .withOption('bLengthChange', false)
            .withOption('bFilter', false)
            .withOption('bInfo', false)
            .withOption('bSort', true)
            .withOption('responsive', true)
            .withPaginationType('full_numbers').withDisplayLength(10)

            /* .withOption('aaSorting', [ $scope.sortBy, 'asc' ]) */
            .withOption('createdRow', function(row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            })
            .withOption('ajax', function(data, callback, settings) {
                getRecords(data, callback, settings);
            })
            .withDataProp('data')
            .withOption(
                'headerCallback',
                function(header) {
                    if (!$scope.headerCompiled) {
                        $scope.headerCompiled = true;
                        $compile(angular.element(header).contents())
                        ($scope);
                    }
                });

        }

        function search() {
            $scope.dtInstance.reloadData();
        }

        function getColumnNameByNum(temp) {
            var sortColumn;
            switch (temp) {
                case 1:
                sortColumn = "name";
                break;
                case 2:
                sortColumn = "status";
                break;
                case 3:
                sortColumn = "modifiedDate";
                break;
                default:
                sortColumn = "modifiedDate";
            }

            return sortColumn;
        }

        function getColumnNumByName(columnName) {
            if (columnName == "name") {
                return 1;
            } else if (columnName == "status") {
                return 2;
            } else if (columnName == "modifiedDate") {
                return 3;
            } else {
                return 3;
            }

        }

        //modal pop up
        $scope.modalPopUp = function(modalType, attrib) {
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
            }).result.then(function({ status, attrib }) {

                if (status == 'actionConfirmation') {
                    $rootScope.action = attrib.action;

                }
                $scope.search();
            }, function() {
                $scope.search();


            })
        }
            //bulk sms pop up
            $scope.totalUsers = []
            $scope.bulkSms = function(selectedUsers) {

            //checking if at least one selected
            // for (var id in $scope.selectedUsers) {
            //     if ($scope.selectedUsers.hasOwnProperty(id)) {
            //         if ($scope.selectedUsers[id]) {
            //             $scope.totalUsers.push(id);
            //         } else {

            //         }
            //     }
            // }
            // var temp = selectedUsers.filter(function(e){
            //     return e==
            // })
            // if ($scope.totalUsers) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'views/candidate/bulkSms-candidate.html',
                    controller: 'bulkSmsCandidateCtrl',
                    resolve: {
                        selectedUsers: function() {
                            return selectedUsers;
                        }
                    }
                }).result.then(function(result) {
                    console.log('result: ' + result);
                    $scope.search();

                }, function() {

                })

            // } else {
            //     commonService.toaster('danger', 'Please select at least one candidate', true, true);
            // }
        }
        $scope.bulkAction = function(action, selectedUsers) {

            //checking if at least one selected
            // for (var id in $scope.selectedUsers) {
            //     if ($scope.selectedUsers.hasOwnProperty(id)) {
            //         if ($scope.selectedUsers[id]) {
            //             $scope.totalUsers.push(id);
            //         } else {

            //         }
            //     }
            // }
            // var temp = selectedUsers.filter(function(e){
            //     return e==
            // })
            // if ($scope.totalUsers) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'views/candidate/bulkAction-candidate.html',
                    controller: 'bulkActionCandidateCtrl',
                    resolve: {
                        action: function() {
                            return action;
                        },
                        selectedUsers: function() {
                            return selectedUsers;
                        }
                    }
                }).result.then(function({ status, attrib }) {
                    if (status) {
                        $rootScope.action = status;
                        setTimeout(function() {
                            $rootScope.action = '';
                        }, 3000);
                    }
                    $scope.search();

                }, function() {

                })

            // } else {
            //     commonService.toaster('danger', 'Please select at least one candidate', true, true);
            // }
        }
        $scope.forwardResume = function(selectedUsers) {

            //checking if at least one selected
            // for (var id in $scope.selectedUsers) {
            //     if ($scope.selectedUsers.hasOwnProperty(id)) {
            //         if ($scope.selectedUsers[id]) {
            //             $scope.totalUsers.push(id);
            //         } else {

            //         }
            //     }
            // }
            // var temp = selectedUsers.filter(function(e){
            //     return e==
            // })
            // if ($scope.totalUsers) {

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
                    $scope.search();

                }, function() {

                })

            // } else {
            //     commonService.toaster('danger', 'Please select at least one candidate', true, true);
            // }
        }

        //counter
        $scope.blink = true;
        $scope.fontSize = {};
        $scope.timerColor = {};
        $scope.deadlineMillis = 0;
        $scope.timerRunning = true;

        $scope.timeOver = function() {
            $scope.timerColor.color = $scope.blink ? 'blinking-end' : 'end';
        };

        $scope.changeSize = function(value) {
            $scope.fontSize = { 'font-size': value + 'px' };
        };

        $scope.startTimer = function(deadline) {
            $scope.$broadcast('timer-start');
            $scope.timerRunning = true;
            $scope.deadlineMillis += deadline * 1000 * 60;
        };

        $scope.stopTimer = function() {
            $scope.$broadcast('timer-stop');
            $scope.timerColor = {};
            $scope.deadlineMillis = 0;
            $scope.timerRunning = false;
        };

        $scope.$on('timer-tick', function(event, data) {
            if ($scope.timerRunning && data.millis >= $scope.deadlineMillis) {
                $scope.$apply($scope.timeOver);
            }
        });

        //counter ends


    }
    name.factory('myCache', function($cacheFactory) {
        return $cacheFactory('myData');
    })

})();
