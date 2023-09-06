jQuery.sap.declare("utils.Validator");

// jQuery.sap.require("models.json.postal_codes");
//jQuery.sap.require("model.i18n");

utils.Validator = {
    tel_fax: function (control) {
        var val = control.getValue();
        var telFaxRegex = /^\+{0,1}[ #*\d\(\)/-]+$/;
        if (!val.match(telFaxRegex)) {
            control.setValueState("Error");
            //            if (this.T === undefined) {
            //                this.T = models.resource.i18n.getModel().getResourceBundle();
            //            }
            control.setValueStateText(model.i18n._getLocaleText("TEL_FAX_INVALID"));
            return false;
        }
        control.setValueState("Success");
        return true;
    },
    email: function (control) {
        var val = control.getValue();
        // var mailregex = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-zA-Z]{2,3}$/;
        var mailregex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!val.match(mailregex)) {
            control.setValueState("Error");
            //            if (this.T === undefined) {
            //                this.T = models.resource.i18n.getModel().getResourceBundle();
            //            }
            control.setValueStateText(model.i18n._getLocaleText("EMAIL_INVALID"));
            return false;
        }
        control.setValueState("Success");
        return true;
    },
    byPattern: function (val, pattern) {
        if (pattern === undefined || pattern === "") {
            pattern = /.+/;
        }
        if (val.match(pattern)) {
            return true;
        }
        return false;
    },
    passwords: function (control1, control2) {
        var val1 = control1.getValue();
        var val2 = control2.getValue();
        if (val1 === 'undefined') {
            control1.setValueState("Error");
            control2.setValueState("Error");
            return;
        }
        if (val2 === 'undefined') {
            control1.setValueState("Error");
            control2.setValueState("Error");
            return;
        }
        if (val1 !== val2 || val1 === "" && val2 === "") {
            control1.setValueState("Error");
            control2.setValueState("Error");

            //            if (this.T === undefined) {
            //                this.T = models.resource.i18n.getModel().getResourceBundle();
            //            }
            control2.setValueStateText(model.i18n._getLocaleText("PASS_NO_MATCH"));
            return;
        }
        control1.setValueState("Success");
        control2.setValueState("Success");
    },
    postalCode: function (val, countryISO) {
        if (val === undefined) {
            val = "";
        }
        var r = true;

        this.pCodeModel = models.json.postal_codes.getModel();
        var cObj = utils.filter.find(countryISO, this.pCodeModel.oData, "ISO");
        if (cObj && cObj.Regex) {
            r = false;
            var regex = cObj.Regex;
            if (this.regexes === undefined) {
                this.regexes = {};
            }
            if (this.regexes[regex] === undefined) {
                this.regexes[regex] = new RegExp(regex, "g");
            }
            var rgx = this.regexes[regex];
            if (val.trim().match(rgx)) {
                r = true;
                return r;
            }
        }
        if (cObj && !cObj.Regex) {
            if (val !== "") {
                r = false;
            }
        }
        return r;
    },
    required: function (control) {
        var val = control.getValue();
        if (val !== undefined && val !== "" && val.trim(" ") !== "") {
            control.setValueState("Success");
            return true;
        } else {
            control.setValueState("Error");
            return false;
        }
    },

    vat: function (control) {
        var str = control.getValue();
        str = str.replace(/\s+/g, '');
        if (str !== undefined) {
            var re = /^[A-Z]{2}\w+$/;
            var m;


            if (re.exec(str) !== null) {
                control.setValueState("Success");
                return;
            } else {
                control.setValueState("Error");
                return;
            }

            control.setValueState("Success");
        } else {
            control.setValueState("Error");
        }

        return;
    },

    availability: function (obj, controlQuantity) {
        var qty = parseInt(controlQuantity.getValue());
        if (qty > 0) {
            controlQuantity.setValueState(obj.quantity_state);
            controlQuantity.setValueStateText(obj.quantity_state_text);
        }
    },

    controllaCF: function (control) {
        var cf = control.getValue();

        cf = cf.toUpperCase();
        
        if (cf == '' || !/^[0-9A-Z]{16}$/.test(cf)) {
            control.setValueState("Error");
            control.setValueStateText("Il codice fiscale deve contenere 16 tra lettere e cifre");
            return false;
        }

        var map = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 1, 0, 5, 7, 9, 13, 15, 17,
		19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23];
        var s = 0;
        for (var i = 0; i < 15; i++) {
            var c = cf.charCodeAt(i);
            if (c < 65)
                c = c - 48;
            else
                c = c - 55;
            if (i % 2 == 0)
                s += map[c];
            else
                s += c < 10 ? c : c - 10;
        }
        var atteso = String.fromCharCode(65 + s % 26);
        if (atteso != cf.charAt(15)) {
            control.setValueState("Error");
            control.setValueStateText("Il codice fiscale non è valido:\n" +
                "il codice di controllo non corrisponde.\n");
            return false;
        }

        control.setValueState("Success");
        return true;
    }


};