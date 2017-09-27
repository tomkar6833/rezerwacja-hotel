'use strict';

angular.module('hotel')

.controller('LoginController', ['$rootScope', '$scope', '$state', '$location', '$http', 'parameters', 'translations', 'authentication',
    function($rootScope, $scope, $state, $location, $http, parameters, translations, authentication) {

        $scope.parameters = parameters;
        $scope.authentication = authentication;
        $scope.rememberPassword = false;

        parameters.showLoginBox = true;

        $scope.setText = function(id) {
            return translations.setText(id);
        };
}]);