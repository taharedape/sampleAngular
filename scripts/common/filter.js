'use strict';

PackageName

// Truncate the data 
.filter('cut', function() {
    return function(value, wordwise, max, tail) {
        if (!value)
            return '';

        max = parseInt(max, 10);
        if (!max)
            return value;
        if (value.length <= max)
            return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf('');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || '');
    };
})
//new date
.filter(
        'datetime',
        function($filter) {
            return function(input) {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input),
                        "HH:MM a");

                return _date.toUpperCase();

            };
        })

.filter(
        'dateOnly',
        function($filter) {
            return function(input) {
                if (input == null) {
                    return "";
                }

                var _date = $filter('date')(new Date(input),
                        "dd MMM yyyy");

                return _date.toUpperCase();

            };
        })
//change the order by to obj
.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});




