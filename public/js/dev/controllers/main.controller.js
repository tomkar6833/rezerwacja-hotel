'use strict';

angular.module('hotel')

.controller('MainController', ['$scope', '$state', '$location', 'parameters',
    function($scope, $state, $location, parameters) {

    $scope.parameters = parameters;
    if ($location.path() === '/authenticated') {

        $scope.init = function() {

            $state.go('home');
        };
    }

}]);
