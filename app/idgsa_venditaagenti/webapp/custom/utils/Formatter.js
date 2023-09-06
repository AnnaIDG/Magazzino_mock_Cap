jQuery.sap.declare("utils.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("model.i18n");

utils.Formatter = {

    formatDateState: function (req, shipp) {
        //        if (requestedDate) {
        //            var fromR = requestedDate.split("/");
        //            var req = new Date(fromR[2], fromR[1] - 1, fromR[0]);
        //        }
        //        if (shippmentDate) {
        //            var fromS = shippmentDate.split("/");
        //            var shipp = new Date(fromS[2], fromS[1] - 1, fromS[0]);
        //        }
        //        if (typeof requestedDate === "undefined" || typeof shippmentDate === "undefined") {
        //            return "None";
        //        } else 
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
            if (val === "Bloccato") {
                return "Warning";
            } else if (val === "Chiuso") {
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

    formatDimensionByType: function (type) {
        if (type === "Desktop") {
            return "180px";
        }
        if (type === "Tablet") {
            return "120px";
        }
        if (type === "Phone") {
            return "120px";
        }
        return "120px";
    },

    formatVisibleIcon: function (val) {
        if (typeof val === "undefined") {
            return false;
        } else return true;
    },

    formatAvailable: function (value) {
        if (value === true) {
            return "./custom/images/tick.png";
        } else {
            return "./custom/images/warning.png";
        }
    },
    
    formatAvailabilityInfo: function(available, warn){
        if(typeof available === 'undefined' || typeof warn === 'undefined'){
            return model.i18n._getLocaleText("notAvailable");
        }else{
            if(available === false && warn === false){
                return model.i18n._getLocaleText("notAvailable");
            }
            if(available === true && warn === true){
                return model.i18n._getLocaleText("shortStockAvailability");
            }
            if(available === true && warn === false){
                return model.i18n._getLocaleText("fullyAvailable");
            }
        }
        
    },
    
    formatAvailabilityIconOnProductDetail: function(available, warn){
        if(typeof available === 'undefined' || typeof warn === 'undefined'){
            return "sap-icon://warning2";
        }else{
            if(available === false && warn === false){
                return "sap-icon://warning2";
            }
            if(available === true && warn === true){
                return "sap-icon://message-warning";
            }
            if(available === true && warn === false){
                return "sap-icon://message-success";
            }
        }
    },

    formatDecimalValue: function (val) {
        return val.toFixed(2);
    },

};