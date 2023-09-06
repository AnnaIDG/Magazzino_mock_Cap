sap.ui.define([], function () {
    "use strict";

   

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
    

        numberUnit: function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },

        idModuloToString: function (sValue) {
            if (sValue == 1) {
                return "SD";
            } else if (sValue == 2) {
                return "FI";
            } else if (sValue == 3) {
                return "MM";
            } else if (sValue == 4) {
                return "PM";
            } else if (sValue == 5) {
                return "FI-CO";
            } else {

            }

        },
        idRuoloToString: function (sValue) {
            if (sValue == 1) {
                return "Admin";
            } else if (sValue == 2) {
                return "Technical";
            } else if (sValue == 3) {
                return "Consumer";
            } else {

            }

        },

        currencyValue: function (sValue) {
            if (!sValue) {
                return "";
            }

            return parseFloat(sValue).toFixed(2);
        },

        currencyValue2: function (sValue) {
            if (!sValue) {
                return "";
            }
            var formatValue = parseFloat(sValue).toFixed(2);
            formatValue = formatValue.replace(".", ",");
            return formatValue;
        },

        currencyValue3: function (sValue) {
            if (!sValue) {
                sValue = 0;
                // return "";
            }
            var formatValue = parseFloat(sValue).toFixed(2);
            formatValue = formatValue.replace(".", ",");
            return formatValue;
        },

        date: function (value) {

            if (value) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "dd/MM/yyyy"
                });
                return oDateFormat.format(new Date(value));
            } else {
                return value;
            }
        },

        time: function (value) {
            if (value) {
                var date = new Date(value.ms);
                //                             console.log("date po value.ms: "+ date);
                var timeinmiliseconds = date.getTime(); //date.getTime(); //date.getSeconds(); //date.getTime();
                //                             console.log(timeinmiliseconds);
                var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
                    pattern: "kk:mm"
                });
                var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                //                             console.log(TZOffsetMs);
                var timeStr = oTimeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
                //                             console.log(timeStr);
                if (timeStr === "24:00") {
                    timeStr = "00:00";
                }
                return timeStr;
            } else {
                //return value;
                return "";
            }
        },
        idRuoloToString: function (sValue) {
            if (sValue == 1) {
                return "Admin";
            } else if (sValue == 2) {
                return "Technical";
            } else if (sValue == 3) {
                return "Consumer";
            } else {

            }

        },





    };

});