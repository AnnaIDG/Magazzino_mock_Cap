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
                return "FI-CA";
            } else {
                return ""
            }

        },
        idStatoErroreVisibility: function (sValue) {
            if (sValue === 2) {
                return true;
            } else {
                return false
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
                return ""
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

        idStatoErroreToString: function (sValue) {
            if (sValue == 1) {
                return "Errore";
            } else if (sValue == 2) {
                return "Gestione Tecnica";
            } else if (sValue == 3) {
                return "Risolto";
            } else {
                return ""
            }

        },

        idNomeFlussoToString: function (sValue) {
            if (sValue == 1) {
                return "Vendita Alimentare";
            } else if (sValue == 2) {
                return "Fatture Vendite";
            } else if (sValue == 3) {
                return "Contratti Dipendenti";
            } else if (sValue == 4) {
                return "Controllo Stipendi";
            } else if (sValue == 5) {
                return "Clienti Registrati";
            } else if (sValue == 6) {
                return "Magazzino Amazon";
            } else if (sValue == 7) {
                return "Magazzino Padova";
            } else {
                return "Magazzino Generale"
            }

        },


        prova: function (sValue) {
            var idStatoErrore=this.getView().byId(itemSelect).getKey();
           if(sValue==idStatoErrore){
            return "{Stato_Errore}"
           }
        },


        listColor: function (sValue) {

            if (sValue == 1) {
                return "Error";
            } else if (sValue == 2) {
                return "Warning";
            } else if (sValue == 3) {
                return "Success";
            } else {

            }

        },

    };

});