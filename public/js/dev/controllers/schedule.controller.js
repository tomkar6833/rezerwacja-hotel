'use strict';

angular.module('hotel')

.controller('ScheduleController', ['$scope', 'translations', 'schedule', 'DateParams', 'Bookings',
    function($scope, translations, schedule, DateParams, Bookings) {

        $scope.translations = translations;
        $scope.Bookings = Bookings;
        $scope.DateParams = DateParams;
        $scope.schedule = schedule;

        schedule.apartments = [];
        schedule.bookings = [];

        schedule.marginLeft = -1050 - DateParams.current.date.getDate() * 24;
        schedule.bookingDownloaded = false;

        $scope.$watch('schedule.marginLeft', function(newVal, oldVal){

            if(newVal <= -1700 && newVal < oldVal){
                schedule.getNextMonth();
            }
            else if(newVal >= -850 && newVal > oldVal){

                schedule.getPrevMonth();
            }

       });
        schedule.getSchedule();

    }]);