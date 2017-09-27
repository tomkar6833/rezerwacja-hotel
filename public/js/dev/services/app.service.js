'use strict';

angular.module('hotel')

.factory('parameters', function() {

    var factory = {};

    factory.showLoginBox = true;

    factory.showLoginBoxFunction = function() {
        factory.showLoginBox = true;
    };

    return factory;
})


.factory('authentication', ['$rootScope', '$localStorage', '$http', '$state', 'parameters', 'translations',
    function($rootScope, $localStorage, $http, $state, parameters, translations) {

    var factory = {};

    factory.username = '';
    factory.password = '';
    factory.rememberMe = false;
    factory.useCookie = true;

    factory.login = function() {

        parameters.showLoginBox = false;

        var data = JSON.stringify({'username' : factory.username, 'password' : factory.password, 'rememberMe' : factory.rememberMe, 'useCookie' : factory.useCookie});

        $http.post('/login', data).then(function successCallback(response) {

            if (response.data.authenticated) {

                $rootScope.authenticated = true;
                $rootScope.username = factory.username;

                if (!factory.useCookie) {
                    $localStorage.currentUser = { token: response.data.token };
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
                }

                $state.go('home');
            }
            else {

                factory.password = '';

           }
        });

    };

    factory.logout = function() {

        factory.username = '';
        factory.password = '';
        factory.rememberMe = false;

        $http.post('/logout').then(function successCallback(response) {

            if (response.data.logged_out) {

                $rootScope.authenticated = false;
                $rootScope.username = '';

                if (!factory.useCookie) {
                    delete $localStorage.currentUser;
                    $http.defaults.headers.common.Authorization = '';
                }

                $state.go('login');
            }
        });
    };

    return factory;
}])


.factory('translations', ['$http', '$mdDateLocale', function($http, $mdDateLocale) {

    var factory = {};

    factory.translations = [];
    factory.downloaded = false;

    factory.getTranslations = function() {

        $http.get('/translations').then(function successCallback(response) {

            var data = response.data;

            factory.translations = data.translations;
            factory.downloaded = true;
            factory.setDatePicker();
        });

        return factory.translations;
    };

    factory.setText = function(id) {

        return factory.translations[id] ? factory.translations[id] : '';
    };

    factory.setDatePicker = function(){

        $mdDateLocale.days = [
            factory.setText(589),
            factory.setText(893),
            factory.setText(707),
            factory.setText(234),
            factory.setText(515),
            factory.setText(702),
            factory.setText(444)
        ];
        $mdDateLocale.months = [
            factory.setText(1010),
            factory.setText(1011),
            factory.setText(1012),
            factory.setText(1013),
            factory.setText(1014),
            factory.setText(1015),
            factory.setText(1016),
            factory.setText(1017),
            factory.setText(1018),
            factory.setText(1019),
            factory.setText(1020),
            factory.setText(1021)
        ];
        $mdDateLocale.shortDays = [
            $mdDateLocale.days[0].slice(0,1),
            $mdDateLocale.days[1].slice(0,1),
            $mdDateLocale.days[2].slice(0,1),
            $mdDateLocale.days[3].slice(0,1),
            $mdDateLocale.days[4].slice(0,1),
            $mdDateLocale.days[5].slice(0,1),
            $mdDateLocale.days[6].slice(0,1)
        ];
        $mdDateLocale.shortMonths = [
            factory.setText(1022),
            factory.setText(1023),
            factory.setText(1024),
            factory.setText(1025),
            factory.setText(1026),
            factory.setText(1027),
            factory.setText(1028),
            factory.setText(1029),
            factory.setText(1030),
            factory.setText(1031),
            factory.setText(1032),
            factory.setText(1033)
        ];
    };

    return factory;
}]);

