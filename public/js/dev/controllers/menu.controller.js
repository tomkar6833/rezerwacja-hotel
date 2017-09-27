'use strict';

angular.module('hotel')

.controller('MenuController', ['$rootScope', '$scope', '$state', '$location', '$http', 'parameters', 'translations', 'authentication',
    function($rootScope, $scope, $state, $location, $http, parameters, translations, authentication) {

        $scope.authentication = authentication;
        $scope.parameters = parameters;

        $scope.setText = function(id) {
            return translations.setText(id);
        };
}]);