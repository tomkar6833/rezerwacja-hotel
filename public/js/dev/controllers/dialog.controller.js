'use strict';

angular.module('hotel')

.controller('DialogController', ['$scope', '$mdDialog', 'schedule', 'CurrentReservation', 'translations',
function($scope, $mdDialog, schedule, CurrentReservation, translations) {

    $scope.translations = translations;
    $scope.schedule = schedule;
    $scope.CurrentReservation = CurrentReservation;

    $scope.cancelSchedule = function() {

        schedule.selectDays(0, '');
        $mdDialog.cancel();
    };

}]);