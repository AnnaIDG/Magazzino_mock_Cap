jQuery.sap.declare("utils.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

utils.Formatter = {

    formatDateState: function (req, shipp) {
        
        if (shipp > req) {
            return "Warning";
        } else return "None";
    },


    formatDate: function (date) {
        if (!date)
            return "";
        var d = new Date(date);
        var dateFormatter = sap.ui.core.format.DateFormat.getInstance({
            pattern: "dd/MM/yyyy"
        });
        d = dateFormatter.format(d);
        return d;
    },


    formatStatusState: function (val) {
        if (val) {
            if (val === "B") {
                return "Warning";
            } else if (val === "C") {
                return "Success";
            } else {
                return "None";
            }
        } else {
            return "None";
        }
    },

    orderDetailCheckBox: function (val) {
        if (val === "X") {
            return true;
        } else {
            return false;
        }
    },

    adaptCheckBoxValue: function (val) {
        if (val !== true && val !== "true")
            return false;
        return true;
    },

    formatShippmentAvailableButtonType: function (val) {
        if (!val || typeof val === "undefined" || val === false) {
            return "Transparent"
        } else {
            return "Accept";
        }
    },

    formatShowOrderBlockButtonType: function (val) {
        if (!val || typeof val === "undefined" || val === false) {
            return "Transparent";
        } else {
            return "Reject";
        }
    },

    isSelected: function (obj) {
        if (obj !== "")
            return true;
        return false;

    },

    fixPriceLength: function (val) {
        return val.toFixed(2);
    },

    timeToMs: function (s) {
        if (s === 0 || s === "" || s === undefined || s === null) {
            return "";
        } else {
            var ms = s % 1000;
            s = (s - ms) / 1000;
            var secs = s % 60;
            s = (s - secs) / 60;
            var mins = s % 60;
            var hrs = (s - mins) / 60;
            if (hrs < 10)
                hrs = "0" + hrs;
            if (mins < 10)
                mins = "0" + mins;
            return hrs + ':' + mins + ':' + secs;
        }


    },

    formatPercentage: function (percentage) {
        if (percentage) {
            var floatNr = parseFloat(percentage.toFixed(2));
            return floatNr;
        } else {
            return 0;
        }
    },

    formatColorCredit: function (percentage) {
        if (percentage) {
            var d = parseFloat(percentage.toFixed(2));
            if (d >= 80) {
                return "Error";
            } else if (d >= 30 && d < 80) {
                return "Warning";
            } else {
                return "Success";
            }
        } else {
            return "None";
        }

    },
    removeLeadingZeroes: function (value) {
        if (value)
            return value.replace(/^(0+)/g, '');
        return '';
    },

    AggiungiVirgole: function (val) {
        if (val) {
            val = parseFloat(val).toLocaleString();
            if (val.indexOf(",") < 0) {
                val = val + ",00"
            } else if (val.indexOf(",") >= 0) {
                var array = val.split(",");
                var decimali = array[1].substring(0,2);

                if (array[1] && array[1].length === 1) {
                    decimali = array[1] + "0";

                }
                val = array[0] + "," + decimali;
            }
            return val;
        }
    }

};