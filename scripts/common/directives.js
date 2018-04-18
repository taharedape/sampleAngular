'use strict';

PackageName



// =========================================================================
// Password compare check
// =========================================================================


    .directive('compareTo', function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})

//TH: input only numbers
.directive('validNumber', function() {
        return {
            require: '?ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function(val) {
                    if (angular.isUndefined(val)) {
                        var val = '';
                    }

                    var clean = val.replace(/[^-0-9\.]/g, '');
                    var negativeCheck = clean.split('-');
                    var decimalCheck = clean.split('.');
                    if (!angular.isUndefined(negativeCheck[1])) {
                        negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                        clean = negativeCheck[0] + '-' + negativeCheck[1];
                        if (negativeCheck[0].length > 0) {
                            clean = negativeCheck[0];
                        }

                    }

                    if (!angular.isUndefined(decimalCheck[1])) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }

                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function(event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    })

    .directive('ngDropdownMultiselect', ['$filter', '$document', '$compile', '$parse',

        function($filter, $document, $compile, $parse) {

            return {
                restrict: 'AE',
                scope: {
                    selectedModel: '=',
                    options: '=',
                    extraSettings: '=',
                    events: '=',
                    searchFilter: '=?',
                    translationTexts: '=',
                    groupBy: '@'
                },
                
                template: function(element, attrs) {
                    var checkboxes = attrs.checkboxes ? true : false;
                    var groups = attrs.groupBy ? true : false;

                    var template = '<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 multiselect-parent btn-group dropdown-multiselect">';
                    template += '<button ng-disabled="settings.disable" type="button" class="col-md-12 col-lg-12 col-sm-12 col-xs-12 dropdown-toggle" ng-class="settings.buttonClasses" ng-click="toggleDropdown()">{{getButtonText()}}&nbsp;<span class="caret"></span></button>';
                    template += '<ul  class="dropdown-menu dropdown-menu-form col-xs-11" ng-style="{display: open ? \'block\' : \'none\', height : settings.scrollable ? settings.scrollableHeight : \'auto\' }" style="overflow: scroll" >';
                    template += '<li><a ng-show="settings.showUncheckAll" data-ng-click="deselectAll();"><span class="glyphicon glyphicon-remove"></span>   {{texts.uncheckAll}}</a><a ng-show="!settings.showCheckAll || settings.selectionLimit > 0" data-ng-click="selectAll()"><span class="glyphicon glyphicon-ok"></span>  {{texts.checkAll}}</a>';
                    // template += '<li ng-show="settings.showUncheckAll"></li>';
                    template += '<li ng-hide="(!settings.showCheckAll || settings.selectionLimit > 0) && !settings.showUncheckAll" class="divider"></li>';
                    template += '<li ng-show="settings.enableSearch"><div class="dropdown-header"><input type="text" class="form-control" style="width: 100%;" ng-model="searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>';
                    template += '<li ng-show="settings.enableSearch" class="divider"></li>';

                    if (groups) {
                        template += '<li ng-repeat-start="option in orderedItems | filter: searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupTitle(getPropertyForObject(option, settings.groupBy)) }}</li>';
                        template += '<li ng-repeat-end role="presentation">';
                    } else {
                        template += '<li role="presentation" ng-repeat="option in options | filter: searchFilter">';
                    }

                    template += '<a role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))">';

                    if (checkboxes) {
                        template += '<div class="checkbox"><label><input  type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /><span></span> {{getPropertyForObject(option, settings.displayProp)}}</label></div></a>';
                    } else {
                        template += '<span data-ng-class="{\'glyphicon glyphicon-ok\': isChecked(getPropertyForObject(option,settings.idProp))}"></span> {{getPropertyForObject(option, settings.displayProp)}}</a>';
                    }

                    template += '</li>';

                    template += '<li class="divider" ng-show="settings.selectionLimit > 1"></li>';
                    template += '<li role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{odel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>';

                    template += '</ul>';
                    template += '</div>';

                    element.html(template);
                },
                link: function($scope, $element, $attrs) {
                    var $dropdownTrigger = $element.children()[0];

                    $scope.toggleDropdown = function() {
                        $scope.open = !$scope.open;
                    };

                    $scope.checkboxClick = function($event, id) {
                        $scope.setSelectedItem(id);
                        $event.stopImmediatePropagation();
                    };

                    $scope.externalEvents = {
                        onItemSelect: angular.noop,
                        onItemDeselect: angular.noop,
                        onSelectAll: angular.noop,
                        onDeselectAll: angular.noop,
                        onInitDone: angular.noop,
                        onMaxSelectionReached: angular.noop
                    };

                    $scope.settings = {
                        dynamicTitle: true,
                        scrollable: false,
                        scrollableHeight: '300px',
                        closeOnBlur: true,
                        displayProp: 'label',
                        idProp: 'id',
                        externalIdProp: 'id',
                        enableSearch: false,
                        selectionLimit: 0,
                        showCheckAll: true,
                        showUncheckAll: true,
                        closeOnSelect: false,
                        buttonClasses: 'btn btn-default',
                        closeOnDeselect: false,
                        groupBy: $attrs.groupBy || undefined,
                        groupByTextProvider: null,
                        smartButtonMaxItems: 0,
                        smartButtonTextConverter: angular.noop,
                        disable: false
                    };

                    $scope.texts = {
                        checkAll: 'Check All',
                        uncheckAll: 'Uncheck All',
                        selectionCount: 'checked',
                        selectionOf: '/',
                        searchPlaceholder: 'Search...',
                        buttonDefaultText: 'Select',
                        dynamicButtonTextSuffix: 'checked'
                    };

                    $scope.searchFilter = $scope.searchFilter || '';

                    if (angular.isDefined($scope.settings.groupBy)) {
                        $scope.$watch('options', function(newValue) {
                            if (angular.isDefined(newValue)) {
                                $scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
                            }
                        });
                    }

                    angular.extend($scope.settings, $scope.extraSettings || []);
                    angular.extend($scope.externalEvents, $scope.events || []);
                    angular.extend($scope.texts, $scope.translationTexts);

                    $scope.singleSelection = $scope.settings.selectionLimit === 1;

                    function getFindObj(id) {
                        var findObj = {};

                        if ($scope.settings.externalIdProp === '') {
                            findObj[$scope.settings.idProp] = id;
                        } else {
                            findObj[$scope.settings.externalIdProp] = id;
                        }

                        return findObj;
                    }

                    function clearObject(object) {
                        for (var prop in object) {
                            delete object[prop];
                        }
                    }

                    if ($scope.singleSelection) {
                        if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
                            clearObject($scope.selectedModel);
                        }
                    }

                    if ($scope.settings.closeOnBlur) {
                        $document.on('click', function(e) {
                            var target = e.target.parentElement;
                            var parentFound = false;

                            while (angular.isDefined(target) && target !== null && !parentFound) {
                                if (_.includes(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                                    if (target === $dropdownTrigger) {
                                        parentFound = true;
                                    }
                                }
                                target = target.parentElement;
                            }

                            if (!parentFound) {
                                $scope.$apply(function() {
                                    $scope.open = false;
                                });
                            }
                        });
                    }

                    $scope.getGroupTitle = function(groupValue) {
                        if ($scope.settings.groupByTextProvider !== null) {
                            return $scope.settings.groupByTextProvider(groupValue);
                        }

                        return groupValue;
                    };

                    $scope.getButtonText = function() {
                        if ($scope.settings.dynamicTitle && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && _.keys($scope.selectedModel).length > 0))) {
                            if ($scope.settings.smartButtonMaxItems > 0) {
                                var itemsText = [];

                                angular.forEach($scope.options, function(optionItem) {
                                    if ($scope.isChecked($scope.getPropertyForObject(optionItem, $scope.settings.idProp))) {
                                        var displayText = $scope.getPropertyForObject(optionItem, $scope.settings.displayProp);
                                        var converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);

                                        itemsText.push(converterResponse ? converterResponse : displayText);
                                    }
                                });

                                if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
                                    itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
                                    itemsText.push('...');
                                }

                                return itemsText.join(', ');
                            } else {
                                var totalSelected;

                                if ($scope.singleSelection) {
                                    totalSelected = ($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
                                } else {
                                    totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
                                }

                                if (totalSelected === 0) {
                                    return $scope.texts.buttonDefaultText;
                                } else {
                                    return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;
                                }
                            }
                        } else {
                            return $scope.texts.buttonDefaultText;
                        }
                    };

                    $scope.getPropertyForObject = function(object, property) {
                        if (angular.isDefined(object) && object.hasOwnProperty(property)) {
                            return object[property];
                        }

                        return '';
                    };

                    $scope.selectAll = function() {
                        $scope.deselectAll(false);
                        $scope.externalEvents.onSelectAll();

                        angular.forEach($scope.options, function(value) {
                            $scope.setSelectedItem(value[$scope.settings.idProp], true);
                        });
                    };

                    $scope.deselectAll = function(sendEvent) {
                        sendEvent = sendEvent || true;

                        if (sendEvent) {
                            $scope.externalEvents.onDeselectAll();
                        }

                        if ($scope.singleSelection) {
                            clearObject($scope.selectedModel);
                        } else {
                            $scope.selectedModel.splice(0, $scope.selectedModel.length);
                        }
                    };

                    $scope.setSelectedItem = function(id, dontRemove) {
                        var findObj = getFindObj(id);
                        var finalObj = null;

                        if ($scope.settings.externalIdProp === '') {
                            finalObj = _.find($scope.options, findObj);
                        } else {
                            finalObj = findObj;
                        }

                        if ($scope.singleSelection) {
                            clearObject($scope.selectedModel);
                            angular.extend($scope.selectedModel, finalObj);
                            $scope.externalEvents.onItemSelect(finalObj);
                            if ($scope.settings.closeOnSelect) $scope.open = false;

                            return;
                        }

                        dontRemove = dontRemove || false;

                        var exists = _.findIndex($scope.selectedModel, findObj) !== -1;

                        if (!dontRemove && exists) {
                            $scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
                            $scope.externalEvents.onItemDeselect(findObj);
                        } else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
                            $scope.selectedModel.push(finalObj);
                            $scope.externalEvents.onItemSelect(finalObj);
                        }
                        if ($scope.settings.closeOnSelect) $scope.open = false;
                    };

                    $scope.isChecked = function(id) {
                        if ($scope.singleSelection) {
                            return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
                        }

                        return _.findIndex($scope.selectedModel, getFindObj(id)) !== -1;
                    };

                    $scope.externalEvents.onInitDone();
                }
            };
        }
    ])

.directive('intlTelInput', ['$log', function($log) {
        return {
            restrict: 'E',
            scope: {
                setFn: '&',
                phoneNumber: '=',
                ngClass: '@'
            },
            template: '<input type="tel" maxlength="25"/>',
            link: function(scope, element, attrs) {
                var utilsScript = "../../scripts/common/src/js/utils.js";
                var el = element.find('input');
                el.intlTelInput({
                    //allowExtensions: true,
                    autoFormat: true,
                    autoHideDialCode: true,
                    autoPlaceholder: true,
                    defaultCountry: 'us',
                    nationalMode: true,
                    numberType: 'FIXED_LINE_OR_MOBILE',
                    preferredCountries: ['us', 'gb'],
                    utilsScript: utilsScript
                });

                angular.element.getScript(utilsScript, function(data, textStatus, jqxhr) {
                    // $log.debug(data); // Data returned
                    // $log.debug(textStatus); // Success
                    // $log.debug(jqxhr.status); // 200
                    // $log.debug("Load was performed.");
                });

                //$log.debug(JSON.stringify(attrs.ngClass, 0,3));
                angular.element(el).addClass(scope.ngClass);

                function getNumber(cb) {
                    var phoneNumber = el.intlTelInput("getNumber");
                    var isValid = el.intlTelInput("isValidNumber");
                    var validationError = el.intlTelInput("getValidationError");
                    //$log.debug('validation error',validationError);
                    var errorType = intlTelInputUtils.validationError;
                    var errorMessage = "Invalid phone number";
                    // if(validationError == intlTelInputUtils.validationError.TOO_SHORT)
                    //     errorMessage = "phone number is too short";
                    // else if(validationError == intlTelInputUtils.validationError.TOO_LONG)
                    //     errorMessage = "phone number is too long";
                    // else if(validationError == intlTelInputUtils.validationError.NOT_A_NUMBER)
                    //     errorMessage = "phone number is not a number";
                    cb(isValid ? null : errorMessage, phoneNumber);
                }

                scope.setFn({
                    theDirFn: getNumber
                });

                scope.$watch('phoneNumber', function(nv, ov) {
                    $log.debug('phoneNumber', nv, ov);
                    if (nv) {
                        //$log.debug('setNumber', nv);
                        el.intlTelInput("setNumber", nv);
                    }
                });

                scope.$on('$destroy', function() {
                    el.intlTelInput("destroy");
                });
            }
        };
    }])
    .directive("switch", function() {
        return {
            restrict: "AE",
            replace: !0,
            transclude: !0,
            template: function(n, e) {
                var s = "";
                return s += "<span", s += ' class="switch' + (e.class ? " " + e.class : "") + '"', s += e.ngModel ? ' ng-click="' + e.ngModel + "=!" + e.ngModel + (e.ngChange ? "; " + e.ngChange + '()"' : '"') : "", s += ' ng-class="{ checked:' + e.ngModel + ' }"', s += ">", s += "<small></small>", s += '<input type="checkbox"', s += e.id ? ' id="' + e.id + '"' : "", s += e.name ? ' name="' + e.name + '"' : "", s += e.ngModel ? ' ng-model="' + e.ngModel + '"' : "", s += ' style="display:none" />', s += '<span class="switch-text">', s += e.on ? '<span class="on">' + e.on + "</span>" : "", s += e.off ? '<span class="off">' + e.off + "</span>" : " ", s += "</span>"
            }
        }
    })
    //tab ctrl changes 
    .directive('tabController', function() {
    return {
      restrict: 'A',
      controller: '@',
      name: 'tabController',
    }
  })

    //copy to clipboard 
.directive('copyToClipboard',  function ($window) {
        var body = angular.element($window.document.body);
        var textarea = angular.element('<textarea/>');
        textarea.css({
            position: 'fixed',
            opacity: '0'
        });

        function copy(toCopy) {
            textarea.val(toCopy);
            body.append(textarea);
            textarea[0].select();

            try {
                var successful = document.execCommand('copy');
                if (!successful) throw successful;
            } catch (err) {
                console.log("failed to copy", toCopy);
            }
            textarea.remove();
        }

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function (e) {
                    copy(attrs.copyToClipboard);
                });
            }
        }
    })

// Only numbers inputs
.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
})


//max length

.directive('myMaxlength', ['$compile', '$log', function($compile, $log) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                attrs.$set("ngTrim", "false");
                var maxlength = parseInt(attrs.myMaxlength, 10);
                ctrl.$parsers.push(function (value) {
                    // $log.info("In parser function value = [" + value + "].");
                    if (value.length > maxlength)
                    {
                        // $log.info("The value [" + value + "] is too long!");
                        value = value.substr(0, maxlength);
                        ctrl.$setViewValue(value);
                        ctrl.$render();
                        // $log.info("The value is now truncated as [" + value + "].");
                    }
                    return value;
                });
            }
        };
    }])

//read more read less directive
.directive('moreLess', function () {
    'use strict';
    return {
        restrict: 'EAC',
        replace: true,
        transclude: true,
        scope: {
            show: '=',
            more: '@',
            less: '@',
            ellipsis: '@'
        },
        template: '<div>' +
            '<span class="title">{{title}}</span><span class="content" ng-transclude></span>' +
            '<div id="details" class="link link-default text-info col-xs-12 xs-pl-0 xs-pt-15">{{lnk}}</div>' +
            '</div>',

        link: function (scope, element, attrs) {

            var title = angular.element(element.children()[0]),
                opened = true,
                details = angular.element(element.children()[2]),
                showChar = scope.show,
                body = angular.element(element.children()[1]),
                input = body.text(),
                content = input.substr(showChar, input.length - showChar),
                excerpt = input.substr(0, showChar);

            body.text(content);

            details.bind('click', function () {
                scope.$apply(toggle());
            });

            scope.title = excerpt;

            function toggle() {
                opened = !opened;
                element.removeClass(opened ? 'closed' : 'opened');
                element.addClass(opened ? 'opened' : 'closed');
                scope.$watch('lnk', function () {
                    scope.lnk = opened ? scope.less : scope.more;
                });
                opened ? body.slideDown() : body.slideUp();

            }
            toggle();

        }

    };
})
.directive('ddTextCollapse', ['$compile', function($compile) {

    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs) {

            // start collapsed
            scope.collapsed = false;

            // create the function to toggle the collapse
            scope.toggle = function() {
                scope.collapsed = !scope.collapsed;
            };

            // wait for changes on the text
            attrs.$observe('ddTextCollapseText', function(text) {

                // get the length from the attributes
                var maxLength = scope.$eval(attrs.ddTextCollapseMaxLength);

                if (text.length > maxLength) {
                    // split the text in two parts, the first always showing
                    var firstPart = String(text).substring(0, maxLength);
                    var secondPart = String(text).substring(maxLength, text.length);

                    // create some new html elements to hold the separate info
                    var firstSpan = $compile('<span>' + firstPart + '</span>')(scope);
                    var secondSpan = $compile('<span ng-if="collapsed">' + secondPart + '</span>')(scope);
                    var moreIndicatorSpan = $compile('<span ng-if="!collapsed">... </span>')(scope);
                    var lineBreak = $compile('<br ng-if="collapsed">')(scope);
                    var toggleButton = $compile('<span class="collapse-text-toggle" ng-click="toggle()">{{collapsed ? "less" : "more"}}</span>')(scope);

                    // remove the current contents of the element
                    // and add the new ones we created
                    element.empty();
                    element.append(firstSpan);
                    element.append(secondSpan);
                    element.append(moreIndicatorSpan);
                    element.append(lineBreak);
                    element.append(toggleButton);
                }
                else {
                    element.empty();
                    element.append(text);
                }
            });
        }
    };
}])


// //counter 

// .directive('timer', ['$compile', function ($compile) {
//     return {
//         restrict: 'EAC',
//         replace: false,
//         scope: {
//             interval: '=interval',
//             startTimeAttr: '=startTime',
//             endTimeAttr: '=endTime',
//             countdownattr: '=countdown',
//             finishCallback: '&finishCallback',
//             autoStart: '&autoStart',
//             maxTimeUnit: '='
//         },
//         controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {

//             // Checking for trim function since IE8 doesn't have it
//             // If not a function, create tirm with RegEx to mimic native trim
//             if (typeof String.prototype.trim !== 'function') {
//                 String.prototype.trim = function () {
//                     return this.replace(/^\s+|\s+$/g, '');
//                 };
//             }

//             //angular 1.2 doesn't support attributes ending in "-start", so we're
//             //supporting both "autostart" and "auto-start" as a solution for
//             //backward and forward compatibility.
//             $scope.autoStart = $attrs.autoStart || $attrs.autostart;

//             if ($element.html().trim().length === 0) {
//                 $element.append($compile('<span>{{millis}}</span>')($scope));
//             } else {
//                 $element.append($compile($element.contents())($scope));
//             }

//             $scope.startTime = null;
//             $scope.endTime = null;
//             $scope.timeoutId = null;
//             $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) >= 0 ? parseInt($scope.countdownattr, 10) : undefined;
//             $scope.isRunning = false;

//             $scope.$on('timer-start', function () {
//                 $scope.start();
//             });

//             $scope.$on('timer-resume', function () {
//                 $scope.resume();
//             });

//             $scope.$on('timer-stop', function () {
//                 $scope.stop();
//             });

//             $scope.$on('timer-clear', function () {
//                 $scope.clear();
//             });

//             $scope.$on('timer-set-countdown', function (e, countdown) {
//                 $scope.countdown = countdown;
//             });

//             function resetTimeout() {
//                 if ($scope.timeoutId) {
//                     clearTimeout($scope.timeoutId);
//                 }
//             }

//             $scope.start = $element[0].start = function () {
//                 $scope.startTime = $scope.startTimeAttr ? new Date($scope.startTimeAttr) : new Date();
//                 $scope.endTime = $scope.endTimeAttr ? new Date($scope.endTimeAttr) : null;
//                 if (!$scope.countdown) {
//                     $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) > 0 ? parseInt($scope.countdownattr, 10) : undefined;
//                 }
//                 resetTimeout();
//                 tick();
//                 $scope.isRunning = true;
//             };

//             $scope.resume = $element[0].resume = function () {
//                 resetTimeout();
//                 if ($scope.countdownattr) {
//                     $scope.countdown += 1;
//                 }
//                 $scope.startTime = new Date() - ($scope.stoppedTime - $scope.startTime);
//                 tick();
//                 $scope.isRunning = true;
//             };

//             $scope.stop = $scope.pause = $element[0].stop = $element[0].pause = function () {
//                 var timeoutId = $scope.timeoutId;
//                 $scope.clear();
//                 $scope.$emit('timer-stopped', {
//                     timeoutId: timeoutId,
//                     millis: $scope.millis,
//                     seconds: $scope.seconds,
//                     minutes: $scope.minutes,
//                     hours: $scope.hours,
//                     days: $scope.days
//                 });
//             };

//             $scope.clear = $element[0].clear = function () {
//                 // same as stop but without the event being triggered
//                 $scope.stoppedTime = new Date();
//                 resetTimeout();
//                 $scope.timeoutId = null;
//                 $scope.isRunning = false;
//             };

//             $element.bind('$destroy', function () {
//                 resetTimeout();
//                 $scope.isRunning = false;
//             });

//             function calculateTimeUnits() {
//                 if ($attrs.startTime !== undefined) {
//                     $scope.millis = new Date() - new Date($scope.startTimeAttr);
//                 }
//                 // compute time values based on maxTimeUnit specification
//                 if (!$scope.maxTimeUnit || $scope.maxTimeUnit === 'day') {
//                     $scope.seconds = Math.floor(($scope.millis / 1000) % 60);
//                     $scope.minutes = Math.floor((($scope.millis / (60000)) % 60));
//                     $scope.hours = Math.floor((($scope.millis / (3600000)) % 24));
//                     $scope.days = Math.floor((($scope.millis / (3600000)) / 24));
//                     $scope.months = 0;
//                     $scope.years = 0;
//                 } else if ($scope.maxTimeUnit === 'second') {
//                     $scope.seconds = Math.floor($scope.millis / 1000);
//                     $scope.minutes = 0;
//                     $scope.hours = 0;
//                     $scope.days = 0;
//                     $scope.months = 0;
//                     $scope.years = 0;
//                 } else if ($scope.maxTimeUnit === 'minute') {
//                     $scope.seconds = Math.floor(($scope.millis / 1000) % 60);
//                     $scope.minutes = Math.floor($scope.millis / 60000);
//                     $scope.hours = 0;
//                     $scope.days = 0;
//                     $scope.months = 0;
//                     $scope.years = 0;
//                 } else if ($scope.maxTimeUnit === 'hour') {
//                     $scope.seconds = Math.floor(($scope.millis / 1000) % 60);
//                     $scope.minutes = Math.floor((($scope.millis / (60000)) % 60));
//                     $scope.hours = Math.floor($scope.millis / 3600000);
//                     $scope.days = 0;
//                     $scope.months = 0;
//                     $scope.years = 0;
//                 } else if ($scope.maxTimeUnit === 'month') {
//                     $scope.seconds = Math.floor(($scope.millis / 1000) % 60);
//                     $scope.minutes = Math.floor((($scope.millis / (60000)) % 60));
//                     $scope.hours = Math.floor((($scope.millis / (3600000)) % 24));
//                     $scope.days = Math.floor((($scope.millis / (3600000)) / 24) % 30);
//                     $scope.months = Math.floor((($scope.millis / (3600000)) / 24) / 30);
//                     $scope.years = 0;
//                 } else if ($scope.maxTimeUnit === 'year') {
//                     $scope.seconds = Math.floor(($scope.millis / 1000) % 60);
//                     $scope.minutes = Math.floor((($scope.millis / (60000)) % 60));
//                     $scope.hours = Math.floor((($scope.millis / (3600000)) % 24));
//                     $scope.days = Math.floor((($scope.millis / (3600000)) / 24) % 30);
//                     $scope.months = Math.floor((($scope.millis / (3600000)) / 24 / 30) % 12);
//                     $scope.years = Math.floor(($scope.millis / (3600000)) / 24 / 365);
//                 }
//                 // plural - singular unit decision
//                 $scope.secondsS = ($scope.seconds === 1 || $scope.seconds === 0) ? '' : 's';
//                 $scope.minutesS = ($scope.minutes === 1 || $scope.minutes === 0) ? '' : 's';
//                 $scope.hoursS = ($scope.hours === 1 || $scope.hours === 0) ? '' : 's';
//                 $scope.daysS = ($scope.days === 1 || $scope.days === 0) ? '' : 's';
//                 $scope.monthsS = ($scope.months === 1 || $scope.months === 0) ? '' : 's';
//                 $scope.yearsS = ($scope.years === 1 || $scope.years === 0) ? '' : 's';
//                 //add leading zero if number is smaller than 10
//                 $scope.sseconds = $scope.seconds < 10 ? '0' + $scope.seconds : $scope.seconds;
//                 $scope.mminutes = $scope.minutes < 10 ? '0' + $scope.minutes : $scope.minutes;
//                 $scope.hhours = $scope.hours < 10 ? '0' + $scope.hours : $scope.hours;
//                 $scope.ddays = $scope.days < 10 ? '0' + $scope.days : $scope.days;
//                 $scope.mmonths = $scope.months < 10 ? '0' + $scope.months : $scope.months;
//                 $scope.yyears = $scope.years < 10 ? '0' + $scope.years : $scope.years;

//             }

//             //determine initial values of time units and add AddSeconds functionality
//             if ($scope.countdownattr) {
//                 $scope.millis = $scope.countdownattr * 1000;

//                 $scope.addCDSeconds = $element[0].addCDSeconds = function (extraSeconds) {
//                     $scope.countdown += extraSeconds;
//                     $scope.$digest();
//                     if (!$scope.isRunning) {
//                         $scope.start();
//                     }
//                 };

//                 $scope.$on('timer-add-cd-seconds', function (e, extraSeconds) {
//                     $timeout(function () {
//                         $scope.addCDSeconds(extraSeconds);
//                     });
//                 });

//                 $scope.$on('timer-set-countdown-seconds', function (e, countdownSeconds) {
//                     if (!$scope.isRunning) {
//                         $scope.clear();
//                     }

//                     $scope.countdown = countdownSeconds;
//                     $scope.millis = countdownSeconds * 1000;
//                     calculateTimeUnits();
//                 });
//             } else {
//                 $scope.millis = 0;
//             }
//             calculateTimeUnits();

//             var tick = function () {

//                 $scope.millis = new Date() - $scope.startTime;
//                 var adjustment = $scope.millis % 1000;

//                 if ($scope.endTimeAttr) {
//                     $scope.millis = $scope.endTime - new Date();
//                     adjustment = $scope.interval - $scope.millis % 1000;
//                 }


//                 if ($scope.countdownattr) {
//                     $scope.millis = $scope.countdown * 1000;
//                 }

//                 if ($scope.millis < 0) {
//                     $scope.stop();
//                     $scope.millis = 0;
//                     calculateTimeUnits();
//                     if ($scope.finishCallback) {
//                         $scope.$eval($scope.finishCallback);
//                     }
//                     return;
//                 }
//                 calculateTimeUnits();

//                 //We are not using $timeout for a reason. Please read here - https://github.com/siddii/angular-timer/pull/5
//                 $scope.timeoutId = setTimeout(function () {
//                     tick();
//                     $scope.$digest();
//                 }, $scope.interval - adjustment);

//                 $scope.$emit('timer-tick', {
//                     timeoutId: $scope.timeoutId,
//                     millis: $scope.millis
//                 });

//                 if ($scope.countdown > 0) {
//                     $scope.countdown--;
//                 } else if ($scope.countdown <= 0) {
//                     $scope.stop();
//                     if ($scope.finishCallback) {
//                         $scope.$eval($scope.finishCallback);
//                     }
//                 }
//             };

//             if ($scope.autoStart === undefined || $scope.autoStart === true) {
//                 $scope.start();
//             }
//         }]
//     };
// }])






