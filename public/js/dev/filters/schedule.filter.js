'use strict';

angular.module('hotel')

.filter('monthName', ['translations', function (translations) {
    return function (number) {

        var month;

        switch (number){
            case 0:

            month = translations.setText(1010);
            break;

            case 1:

            month = translations.setText(1011);
            break;

            case 2:

            month = translations.setText(1012);
            break;

            case 3:

            month = translations.setText(1013);
            break;

            case 4:

            month = translations.setText(1014);
            break;

            case 5:

            month = translations.setText(1015);
            break;

            case 6:

            month = translations.setText(1016);
            break;

            case 7:

            month = translations.setText(1017);
            break;

            case 8:

            month = translations.setText(1018);
            break;

            case 9:

            month = translations.setText(1019);
            break;

            case 10:

            month = translations.setText(1020);
            break;

            case 11:

            month = translations.setText(1021);
            break;
        }

        return month;

    };
}]);