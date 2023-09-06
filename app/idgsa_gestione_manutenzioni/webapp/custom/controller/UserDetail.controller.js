//jQuery.sap.require("sap.m.MessageBox");
//jQuery.sap.require("icms.Component");
//jQuery.sap.require("jquery.sap.storage");
//jQuery.sap.require("utils.AbstractController");
//jQuery.sap.require("utils.Formatter");
//jQuery.sap.require("utils.SessionStorage");
//jQuery.sap.require("utils.Util");
//jQuery.sap.require("model.attivitaOdata");
jQuery.sap.require("controller.AbstractController");

controller.AbstractController.extend("controller.UserDetail", {

    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);

        this.editPsw = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.editPsw, "editPsw");

        this.modelPropertyPage = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.modelPropertyPage, "modelPropertyPage");
    },

    handleRouteMatched: function (evt) {
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        //
        if (!this._checkRoute(evt, "userDetail")) {
            return;
        } else {
            document.onkeypress = _.bind(function (e) {
                if (e.keyCode === 13) {
                    return null;
                };
            }, this);

            this.editPsw.setProperty("/passOld", "");
            this.editPsw.setProperty("/passNew", "");
            this.editPsw.setProperty("/passNewConfirm", "");
            this.modelPropertyPage.setProperty("/modPass", false);
            this.modelPropertyPage.setProperty("/confirmChange", false);

            this.passInsertOld = false;
            this.passInsertNew = false;
            this.passInsertNewConfirm = false;

            this.busyPage = this.getView().byId("idIconTabBarMulti");
        };
    },

    onNavBackPress: function () {
        this.router.navTo("launchpad");
    },

    onPressChangePsw: function () {
        if (this.modelPropertyPage.getProperty("/modPass") === false) {
            this.modelPropertyPage.setProperty("/modPass", true);
        } else {
            this.modelPropertyPage.setProperty("/modPass", false);
        };
    },

    liveChange1: function (evt) {
        this.editPsw.setProperty("/passOld", evt.getParameters().value)
        if (evt.getParameters().value !== "") {
            this.passInsertOld = true;
            evt.getSource().removeStyleClass("inputValidateError");
        } else {
            this.passInsertOld = false;
            evt.getSource().addStyleClass("inputValidateError");
        }
        if (this.passInsertOld === true && this.passInsertNew === true && this.passInsertNewConfirm === true) {
            this.modelPropertyPage.setProperty("/confirmChange", true);
        } else {
            this.modelPropertyPage.setProperty("/confirmChange", false);
        };
    },

    liveChange2: function (evt) {
        this.editPsw.setProperty("/passNew", evt.getParameters().value)
        if (evt.getParameters().value !== "") {
            this.passInsertNew = true;
            evt.getSource().removeStyleClass("inputValidateError");
        } else {
            this.passInsertNew = false;
            evt.getSource().addStyleClass("inputValidateError");
        };
        if (this.passInsertOld === true && this.passInsertNew === true && this.passInsertNewConfirm === true) {
            this.modelPropertyPage.setProperty("/confirmChange", true);
        } else {
            this.modelPropertyPage.setProperty("/confirmChange", false);
        };
    },

    liveChange3: function (evt) {
        this.editPsw.setProperty("/passNewConfirm", evt.getParameters().value)
        if (evt.getParameters().value !== "") {
            this.passInsertNewConfirm = true;
            evt.getSource().removeStyleClass("inputValidateError");
        } else {
            this.passInsertNewConfirm = false;
            evt.getSource().addStyleClass("inputValidateError");
        };
        if (this.passInsertOld === true && this.passInsertNew === true && this.passInsertNewConfirm === true) {
            this.modelPropertyPage.setProperty("/confirmChange", true);
        } else {
            this.modelPropertyPage.setProperty("/confirmChange", false);
        };
    },

    onPressChangePassword: function () {
        var passOld = this.editPsw.getProperty("/passOld")
        var passNew = this.editPsw.getProperty("/passNew")
        var passNewConfirm = this.editPsw.getProperty("/passNewConfirm")

        if (passNew !== passNewConfirm) {
            sap.m.MessageBox.error("Le password nuove inserite sono diverse", {
                title: this._getLocaleText("Password diverse")
            });
            return;
        }

        this.busyPage.setBusy(true);
        var entity = {};
        entity.IUname = this.userModel.getProperty("/userLogged").userName;
        entity.IPasswordOld = encodeURIComponent(jQuery.base64.encode(passOld));
        entity.IPasswordNew = encodeURIComponent(jQuery.base64.encode(passNew));

        model.UserModel.changeUserPassword(entity)
            .then(function () {
                this.busyPage.setBusy(false);
                sap.m.MessageBox.show("Cambio password eseguito correttamente. Ripetere la login", {
                    title: this._getLocaleText("Cambio password eseguito con successo"),
                    onClose: _.bind(function () {
                        this.onLogoutPress();
                    }, this),
                });
            }.bind(this), function (error) {
                this.busyPage.setBusy(false);
                sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
                    title: this._getLocaleText("errorMessageBoxTitleChangePsw"),
                    onClose: _.bind(function () {
                        this.editPsw.setProperty("/passOld", "");
                        this.editPsw.setProperty("/passNew", "");
                        this.editPsw.setProperty("/passNewConfirm", "");
                        this.modelPropertyPage.setProperty("/modPass", false);
                        this.modelPropertyPage.setProperty("/confirmChange", false);
                    }, this),
                });
            }.bind(this));
    },

});