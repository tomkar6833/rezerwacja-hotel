'use strict';

angular.module('hotel')

.controller('HomeController', ['$rootScope', '$scope', '$state', '$location', '$http', 'parameters', 'translations',
    function($rootScope, $scope, $state, $location, $http, parameters, translations) {

        $scope.parameters = parameters;
        parameters.showLoginBox = true;
        $scope.setText = function(id) {
            return translations.setText(id);
        };

        $scope.getData = function() {

            $http.get('/api', { params: {id: 0} }).then(function successCallback(response) {

                console.log(response.data);
            });

        };
}]);