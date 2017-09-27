'use strict';

angular.module('hotel', ['ui.router', 'ngMaterial', 'angular-swipe-element', 'ngStorage', 'ngSanitize'])

.config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {

    $mdDateLocaleProvider.firstDayOfWeek = 0;
    $mdDateLocaleProvider.formatDate = function(date) {
        return moment(date).format('YYYY-MM-DD');
    };
}])
.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', '$qProvider', function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, $qProvider) {

    $qProvider.errorOnUnhandledRejections(false); // possibly unhandled rejection
    $httpProvider.interceptors.push('responseObserver');
    $httpProvider.defaults.headers.common['Pragma'] = 'no-cache'; // angular IE caching issue

    if (window.history && window.history.pushState) {

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

    $stateProvider

    .state('login', {
        url: '/login',
        views: {
            headerView: {
                templateUrl: 'views/login_header',
                controller: 'MenuController'
            },
            mainView: {
                templateUrl: 'views/login',
                controller: 'LoginController'
            }
        }
    })

    .state('registration', {
        url: '/registration',
        views: {
            headerView: {
                templateUrl: 'views/login_header'
            },
            mainView: {
                templateUrl: 'views/registration'
            }
        }
    })

    .state('home', {
        url: '/authenticated',
        views: {
            headerView: {
                templateUrl: 'views/top_menu',
                controller: 'MenuController'
            },
            mainView: {
                templateUrl: 'views/home',
                controller: 'HomeController'
            }
        }
    })

    .state('schedule', {
        url: '/schedule',
        views: {
            headerView:{
                templateUrl: 'views/top_menu',
                controller: 'MenuController'
            },
            mainView: {
                templateUrl: 'views/schedule',
                controller: 'ScheduleController'
            }
        }
    })

    .state('error404', {
        url: '/404',
        views: {
            errorView: {
                templateUrl: 'views/error_404'
            }
        }
    });

    $urlRouterProvider.otherwise('/404');

}])


.service('responseObserver',['$q', function($q) {

    var service = this;

    service.responseError = function(response) {

        if (response.status === 401) {

            window.location = '/login';
        }
        return $q.reject(response);
    };

}])


.run(['$rootScope', '$state', '$stateParams', '$http', 'parameters', 'authentication', 'translations',
    function ($rootScope, $state, $stateParams, $http, parameters, authentication, translations) {

    $rootScope.state = $state;
    $rootScope.stateParams = $stateParams;
    $rootScope.authenticated = null;

    translations.getTranslations();

    $rootScope.$on('$locationChangeStart', function (event, newLocation, oldLocation) {

        var newPath = newLocation.split('/').slice(-1)[0];
        var oldPath = oldLocation.split('/').slice(-1)[0];

        if ($rootScope.authenticated === null) {

            $http.post('/is_authenticated').then(function successCallback(response) {

                $rootScope.authenticated = response.data.authenticated;
                $rootScope.username = response.data.username;
            });
        }
        else {

            if (newPath === 'login' && oldPath === 'authenticated' && $rootScope.authenticated) {

                event.preventDefault();

            }
            else if (newPath === 'authenticated' && oldPath === 'login' && !$rootScope.authenticated) {

                event.preventDefault();
            }
        }

    });

}]);

