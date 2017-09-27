'use strict';

var now = new Date();

function daysInMonth(date) {

    var month = date.getMonth();
    var year = date.getFullYear();

    return new Date(year, month+1, 0).getDate();
}

angular.module('hotel')

.value('DateParams',{
	secondPrev : {
	    date: new Date(now.setMonth(now.getMonth() - 2)),
        month: []
    },
	prev : {
	    date: new Date(now.setMonth(now.getMonth() + 1)),
        month: []
    },
    current : {
	    date: new Date(now.setMonth(now.getMonth() + 1)),
        month: []
    },
    next: {
	    date: new Date(now.setMonth(now.getMonth() + 1)),
        month: []
    },
    secondNext: {
	    date: new Date(now.setMonth(now.getMonth() + 1)),
        month: []
    }
})

.value('Bookings',{})

.value('CurrentReservation', {})

.factory('schedule', ['$http', '$mdDateLocale', '$mdDialog', '$timeout', 'DateParams', 'Bookings', 'CurrentReservation', function($http, $mdDateLocale, $mdDialog, $timeout, DateParams, Bookings, CurrentReservation, translations) {

    var factory = {};

    factory.getSchedule = function(){
        DateParams.secondPrev.month = new Array(daysInMonth(DateParams.secondPrev.date));
        DateParams.prev.month = new Array(daysInMonth(DateParams.prev.date));
        DateParams.current.month = new Array(daysInMonth(DateParams.current.date));
        DateParams.next.month = new Array(daysInMonth(DateParams.next.date));
        DateParams.secondNext.month = new Array(daysInMonth(DateParams.secondNext.date));

        $http.get('/get_apartments').then(function successCallback(response) {

            factory.apartments = response.data;

            angular.forEach(factory.apartments, function(val){
                val.calender = angular.copy(DateParams);
                val.calender = selectPastMonth(val.calender);
            });

            getNewReservation(DateParams.secondPrev.date, DateParams.secondNext.date);
        });

    };

    function getNewReservation(fromDate, toDate){

        var data = {
            fromDate: fromDate,
            toDate: toDate
        };

        $http.get('/get_bookings', {params: data}).then(function successCallback(response) {

            factory.bookings = response.data;
            factory.bookingDownloaded = true;
            factory.generateBookings(factory.bookings);
        });
    }

    function selectPastMonth(calender){

        now = new Date();

        var dayNow = now.getDate();
        var monthNow = now.getMonth();
        var yearNow = now.getFullYear();

        var i;

        angular.forEach(calender, function(val, key){

            for(i = 0; i < val.month.length; i++){

                if(val.date.getFullYear() < yearNow || (val.date.getFullYear() <= yearNow && val.date.getMonth() < monthNow) || (val.date.getFullYear() <= yearNow && val.date.getMonth() === monthNow && i < dayNow - 1)){

                    val.month[i] = {
                        selected: false,
                        past: true
                    }
                    DateParams[key].month[i] = {
                        past: true
                    }
                }
                else{

                    val.month[i] = {
                        selected: false,
                        past: false
                    }
                    DateParams[key].month[i] = {
                        past: false
                    }
                }
            }
        })

        return calender;
    }

    factory.getNextMonth = function(){

        DateParams.secondPrev.date = new Date(DateParams.secondPrev.date.setMonth(DateParams.secondPrev.date.getMonth() + 1));
        DateParams.secondPrev.month = new Array(parseInt(daysInMonth(DateParams.secondPrev.date)));

        DateParams.prev.date = new Date(DateParams.prev.date.setMonth(DateParams.prev.date.getMonth() + 1));
        DateParams.prev.month = new Array(parseInt(daysInMonth(DateParams.prev.date)));

        DateParams.current.date = new Date(DateParams.current.date.setMonth(DateParams.current.date.getMonth() + 1));
        DateParams.current.month = new Array(parseInt(daysInMonth(DateParams.current.date)));

        DateParams.next.date = new Date(DateParams.next.date.setMonth(DateParams.next.date.getMonth() + 1));
        DateParams.next.month = new Array(parseInt(daysInMonth(DateParams.next.date)));

        DateParams.secondNext.date = new Date(DateParams.secondNext.date.setMonth(DateParams.secondNext.date.getMonth() + 1));
        DateParams.secondNext.month = new Array(parseInt(daysInMonth(DateParams.secondNext.date)));

        angular.forEach(factory.apartments, function(apartment){

            angular.forEach(apartment.calender, function(val){

                val.date = new Date(val.date.setMonth(val.date.getMonth() + 1));
                val.month = new Array(parseInt(daysInMonth(val.date)));
            })

            apartment.calender = selectPastMonth(apartment.calender);
        });

        factory.marginLeft = -1000;
        factory.generateBookings(factory.bookings);
        getNewReservation(DateParams.secondPrev.date, DateParams.secondNext.date);
    };

    factory.getPrevMonth = function(){

        DateParams.secondPrev.date = new Date(DateParams.secondPrev.date.setMonth(DateParams.secondPrev.date.getMonth() - 1));
        DateParams.secondPrev.month = new Array(parseInt(daysInMonth(DateParams.secondPrev.date)));

        DateParams.prev.date = new Date(DateParams.prev.date.setMonth(DateParams.prev.date.getMonth() - 1));
        DateParams.prev.month = new Array(parseInt(daysInMonth(DateParams.prev.date)));

        DateParams.current.date = new Date(DateParams.current.date.setMonth(DateParams.current.date.getMonth() - 1));
        DateParams.current.month = new Array(parseInt(daysInMonth(DateParams.current.date)));

        DateParams.next.date = new Date(DateParams.next.date.setMonth(DateParams.next.date.getMonth() - 1));
        DateParams.next.month = new Array(parseInt(daysInMonth(DateParams.next.date)));

        DateParams.secondNext.date = new Date(DateParams.secondNext.date.setMonth(DateParams.secondNext.date.getMonth() - 1));
        DateParams.secondNext.month = new Array(parseInt(daysInMonth(DateParams.secondNext.date)));

        angular.forEach(factory.apartments, function(apartment){

            angular.forEach(apartment.calender, function(val){

                val.date = new Date(val.date.setMonth(val.date.getMonth() - 1));
                val.month = new Array(parseInt(daysInMonth(val.date)));
            })

            apartment.calender = selectPastMonth(apartment.calender);
        });

        factory.marginLeft = -1550;
        factory.generateBookings(factory.bookings);
        getNewReservation(DateParams.secondPrev.date, DateParams.secondNext.date);
    };

    factory.generateBookings = function(bookings){

        angular.forEach(factory.apartments, function(apartment, key){

            Bookings[apartment.apartment_id] = [];

            angular.forEach(bookings, function(val){

                if(val.apartment_id === apartment.apartment_id && val.booking_start <= val.booking_end){

                    Bookings[apartment.apartment_id].push({
                        bookingStart: val.booking_start,
                        bookingEnd: val.booking_end,
                        bookingId: val.booking_id,
                        information: val.information,
                        apartmentId: val.apartment_id,
                        apartmentIndex: key,
                        marginLeft: getItemMargin(val),
                        width: getItemWidth(val)
                    })
                }
            })
        });
    };

     function getItemMargin(val){

        var margin = -23;
        var day = new Date(val.booking_start).getDate();
        var month = new Date(val.booking_start).getMonth();
        var tempMonth;

        angular.forEach(DateParams, function(val){

            tempMonth = DateParams.secondPrev.date.getMonth() > DateParams.secondNext.date.getMonth() && val.date.getMonth() < 8 ? val.date.getMonth() + 12 : val.date.getMonth();

            if(month > tempMonth){

                margin += val.month.length * 24;
            }
        })

        margin += day * 24;

        return margin;
    }

    function getItemWidth(val){

        var startDate = new Date(val.booking_start);
        var endDate = new Date(val.booking_end);

        var timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return ((diffDays + 1) * 24) - 10;
    }

    factory.startSwipeElement = function(event, index, date, monthType, apartment, id){

        CurrentReservation.startDate =  new Date(date.setDate(index + 1))
        CurrentReservation.startDay = index;
        CurrentReservation.endDate = date;
        CurrentReservation.apartmentIndex = apartment;
        CurrentReservation.apartmentId = id;
        CurrentReservation.monthType = monthType;
        CurrentReservation.firstElementLeft = event.initialElementBounds.left;
        CurrentReservation.firstElementRight = event.initialElementBounds.right;
        CurrentReservation.additionalInfo = '';
        CurrentReservation.bookingId = 0;

        factory.apartments[apartment].calender[monthType].month[index].selected = true;
    };

    factory.swipeElement = function(event){

        var count = 0;
        var direction = '';

        if(event.hDir === 'r'){

            direction = 'right';
            count = ((event.x - CurrentReservation.firstElementRight + 20) - ((event.x - CurrentReservation.firstElementRight + 20)%24) )/24;
        }
        else {

            direction = 'left';
            count = ((CurrentReservation.firstElementLeft + 20 - event.x) - ((CurrentReservation.firstElementLeft + 20 - event.x)%24) )/24;
        }

        if(count < 50 ) factory.selectDays(count, direction);

    };

     factory.selectDays = function(count, direction){

        var date = {};

        angular.forEach(factory.apartments, function(val){

            val.calender = selectPastMonth(val.calender);
        });

        for(var i = 0; i <= count; i++){

            if(direction === 'right'){

                date = calculateDayMonth(i, CurrentReservation.monthType);
                factory.apartments[CurrentReservation.apartmentIndex].calender[date.month].month[date.day].selected = true;
            }
            else if(direction === 'left'){
                date = calculateDayMonth(-i, CurrentReservation.monthType);
                factory.apartments[CurrentReservation.apartmentIndex].calender[date.month].month[date.day].selected = true;
            }
        }

    };

    function calculateDayMonth(i, monthType){

        var months = [
            'secondPrev',
            'prev',
            'current',
            'next',
            'secondNext'
        ];
        var monthIndex = months.indexOf(monthType);
        var date = {};

        if(CurrentReservation.startDay + i < factory.apartments[CurrentReservation.apartmentIndex].calender[monthType].month.length && CurrentReservation.startDay + i >= 0){

            date.day = CurrentReservation.startDay + i;
            date.month = monthType;
        }
        else if(CurrentReservation.startDay + i <= 0 ){

            date.month = months[monthIndex - 1];
            date.day = CurrentReservation.startDay + i + factory.apartments[CurrentReservation.apartmentIndex].calender[date.month].month.length;
            i = i + factory.apartments[CurrentReservation.apartmentIndex].calender[date.month].month.length;
            date = calculateDayMonth(i, date.month);

        }
        else if(CurrentReservation.startDay + i >= factory.apartments[CurrentReservation.apartmentIndex].calender[monthType].month.length){

            date.month = months[monthIndex + 1];
            date.day = CurrentReservation.startDay + i - factory.apartments[CurrentReservation.apartmentIndex].calender[date.month].month.length + 1;
            i = i - factory.apartments[CurrentReservation.apartmentIndex].calender[monthType].month.length;
            date = calculateDayMonth(i, date.month);

        }
        CurrentReservation.endDate = new Date(factory.apartments[CurrentReservation.apartmentIndex].calender[date.month].date.setDate(date.day + 1));
        return date;
    }

    factory.endSwipeElement = function(event){

        if(CurrentReservation.startDate > CurrentReservation.endDate){

            var temp = CurrentReservation.endDate;
            CurrentReservation.endDate = CurrentReservation.startDate;
            CurrentReservation.startDate = temp;
        }

        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'views/schedule_dialog',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:false,
            escapeToClose: false
        })
    };

    factory.changeReservation = function(event, reservation){

        CurrentReservation.startDate = new Date(reservation.bookingStart);
        CurrentReservation.endDate = new Date(reservation.bookingEnd);

        CurrentReservation.apartmentIndex = reservation.apartmentIndex;
        CurrentReservation.apartmentId = parseInt(reservation.apartmentId);
        CurrentReservation.additionalInfo = reservation.information;
        CurrentReservation.bookingId = reservation.bookingId;

        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'views/schedule_dialog',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:false,
            escapeToClose: false
        })
    }

    factory.validateReservation = function(){

        var correctDate = true;
        var count = 0;

        if(CurrentReservation.startDate.getTime() <= (CurrentReservation.endDate.getTime() + 7200000)){

            angular.forEach(factory.bookings, function(val){


                if(val.apartment_id == CurrentReservation.apartmentId && val.booking_id != CurrentReservation.bookingId){

                    if( ! ((CurrentReservation.startDate.getTime() < Date.parse(val.booking_start) && CurrentReservation.startDate.getTime() < Date.parse(val.booking_end) && CurrentReservation.endDate.getTime() < Date.parse(val.booking_start) && CurrentReservation.endDate.getTime() < Date.parse(val.booking_end)) ||
                        (CurrentReservation.startDate.getTime() > Date.parse(val.booking_start) && CurrentReservation.startDate.getTime() > Date.parse(val.booking_end) && CurrentReservation.endDate.getTime() > Date.parse(val.booking_start) && CurrentReservation.endDate.getTime() > Date.parse(val.booking_end))))
                    {
                        correctDate = false;
                    }

                    count++;
                }
            });
        }
        else {

            correctDate = false;
        }


        if(correctDate){

            setReservation();
        }
        else{

            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .clickOutsideToClose(false)
                .escapeToClose(false)
                .title('Błędna rezerwacja')
                .textContent('Podano błędny zakres rezerwacji')
                .ariaLabel('Błędna rezerwacja')
                .ok('Popraw')
                .cancel('Anuluj')
                .targetEvent(event)

            $mdDialog.show(confirm).then(function(){

                $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'views/schedule_dialog',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:false,
                    escapeToClose: false
                })
            }, function(){

                factory.selectDays(0, '');
                $mdDialog.cancel();
            });
        }

    };

    function setReservation(){

        var data = {
            fromDate: new Date(CurrentReservation.startDate.setHours(2)),
            toDate: new Date(CurrentReservation.endDate.setHours(2)),
            info: CurrentReservation.additionalInfo,
            apartmentId: CurrentReservation.apartmentId,
            bookingId: CurrentReservation.bookingId
        };

        $http.post('/set_reservation', data).then(function successCallback(response) {

            getNewReservation(DateParams.secondPrev.date, DateParams.secondNext.date);
            factory.selectDays(0, '');
            $mdDialog.cancel();

        });
    };

    factory.deleteReservation = function(){

        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .clickOutsideToClose(false)
            .escapeToClose(false)
            .title('Usunięcie rezerwacji')
            .textContent('Czy na pewno chcesz usunąć rezerwacje?')
            .ariaLabel('Usunięcie rezerwacji')
            .ok('Usuń')
            .cancel('Anuluj')
            .targetEvent(event)

        $mdDialog.show(confirm).then(function(){

            deleteReservation();
        }, function(){

            $mdDialog.cancel();
        });

    }

    function deleteReservation (){

        var data = {
            bookingId: CurrentReservation.bookingId
        };

        $http.post('/delete_reservation', data).then(function successCallback(response) {

            getNewReservation(DateParams.secondPrev.date, DateParams.secondNext.date);
            factory.selectDays(0, '');
            $mdDialog.cancel();
        });
    }

    return factory;
}]);

