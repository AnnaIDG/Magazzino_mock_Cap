jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.UserModel");
jQuery.sap.require("sap.m.MessageBox");

controller.AbstractController.extend("controller.Login", {
    /**
     * @memberOf controller.Login
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        //
        this.appModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.appModel, "appModel");
        //
        this.versionModel = new sap.ui.model.json.JSONModel();
        this.versionModel.getData().version = icms.Component.getMetadata().getManifestEntry("sap.app").applicationVersion.version;
        this.getView().setModel(this.versionModel, "versionModel");

        this.getView().removeStyleClass("logoBackground");
        this.getView().addStyleClass("loginPageBackground");

        this.editPswModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.editPswModel, "editPswModel");
    },

    handleRouteMatched: function (evt) {
        if (this._checkRoute(evt, "loginAuth")) {
            this.setAuthAndLogin(evt.getParameter("arguments").token);
        } else if (this._checkRoute(evt, "login")) {
            document.onkeypress = _.bind(function (e) {
                //bindo l'enter solo sugli input username e password
                if (e.keyCode == 13 && (e.srcElement.id.indexOf("usernameInput") != -1 || e.srcElement.id.indexOf("passwordInput") != -1)) {
                    this.onLoginPress();
                }
            }, this);
            this.editPswModel.setProperty("/confirmChange", false);
            this.busyPage = this.getView().byId("idBusy");
        }
    },

    onLoginPress: function () {
        var usernameInput = this.getView().byId("usernameInput").getValue().toUpperCase();
        var passwordInput = this.getView().byId("passwordInput").getValue();
        if (_.isEmpty(usernameInput)) {
            this.getView().byId("usernameInput").addStyleClass("inputValidateError");
            var msg = "usernameRequired";
            if (_.isEmpty(passwordInput)) {
                this.getView().byId("passwordInput").addStyleClass("inputValidateError");
                msg = "usernamePasswordRequired";
            }
            sap.m.MessageToast.show(
                this._getLocaleText(msg), {
                duration: 4000
            }
            );
        } else if (_.isEmpty(passwordInput)) {
            this.getView().byId("passwordInput").addStyleClass("inputValidateError");
            sap.m.MessageToast.show(
                this._getLocaleText("passwordRequired"), {
                duration: 4000
            }
            );
        } else {
            this.getView().setBusy(true);
            this.userToLog = usernameInput;
            this._doLogin(usernameInput, passwordInput);
            // model.UserModel.login(usernameInput, passwordInput).then(
            //     function (result) {
            //         this.getView().setBusy(false);
            //         model.service.LocalStorageService.session.save("userLogged", result);
            //         this.router.navTo("launchpad");
            //     }.bind(this),
            //     function (error) {
            //         this.getView().setBusy(false);
            //         //    				sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
            //         //                        title: this._getLocaleText("errorLoginMessageBoxTitle")
            //         //                    });
            //         if (JSON.parse(error.response.body).error.code === "00/153") {
            //             sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
            //                 title: this._getLocaleText("errorLoginMessageBoxTitle"),
            //                 onClose: _.bind(function () {
            //                     this._changePasswordRequest();
            //                 }, this),
            //             });

            //         } else {
            //             sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
            //                 title: this._getLocaleText("errorLoginMessageBoxTitle")
            //             });
            //         }
            //     }.bind(this));
        }
    },

    _doLogin: function (username, password) {
        model.UserModel.login(username, password).then(
            function (result) {
                this.getView().setBusy(false);
                model.service.LocalStorageService.session.save("userLogged", result);
                this.router.navTo("launchpad");
            }.bind(this),
            function (error) {
                this.getView().setBusy(false);
                //    				sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
                //                        title: this._getLocaleText("errorLoginMessageBoxTitle")
                //                    });
                if (JSON.parse(error.response.body).error.code === "00/153") {
                    sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
                        title: this._getLocaleText("errorLoginMessageBoxTitle"),
                        onClose: _.bind(function () {
                            this._changePasswordRequest();
                        }, this),
                    });

                } else {
                    sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
                        title: this._getLocaleText("errorLoginMessageBoxTitle")
                    });
                }
            }.bind(this));
    },

    onLiveChange: function (evt) {
        if (_.isEmpty(evt.getSource().getValue())) {
            evt.getSource().addStyleClass("inputValidateError");
        } else {
            evt.getSource().removeStyleClass("inputValidateError");
        }
    },

    _changePasswordRequest: function () {
        this.passInsertOld = false;
        this.passInsertNew = false;
        this.passInsertNewConfirm = false;
        this.editPswModel.setProperty("/passOld", "");
        this.editPswModel.setProperty("/passNew", "");
        this.editPswModel.setProperty("/passNewConfirm", "");
        if (!this._passwordFragment) {
            this._passwordFragment = sap.ui.xmlfragment("view.fragment.changePassword", this);
            this.getView().addDependent(this._passwordFragment);
        }
        this._passwordFragment.open();
    },

    onPressAnnullaCambioPsw: function () {
        this._passwordFragment.close();
    },

    onPressChangePassword: function () {
        var passOld = this.editPswModel.getProperty("/passOld");
        var passNew = this.editPswModel.getProperty("/passNew");
        var passNewConfirm = this.editPswModel.getProperty("/passNewConfirm");

        if (passNew !== passNewConfirm) {
            sap.m.MessageBox.error("Le password nuove inserite sono diverse", {
                title: this._getLocaleText("Password diverse")
            });
            return;
        }

        var entity = {};
        entity.IUname = this.userToLog;

        entity.IPasswordOld = encodeURIComponent(jQuery.base64.encode(passOld));
        entity.IPasswordNew = encodeURIComponent(jQuery.base64.encode(passNew));

        this._passwordFragment.close();
        this.busyPage.setBusy(true);
        model.UserModel.changeUserPassword(entity)
            .then(function (result) {
                this.busyPage.setBusy(false);
                sap.m.MessageBox.consfirm("Cambio password eseguito correttamente. Ripetere la login", {
                    title: this._getLocaleText("Cambio password eseguito con successo"),
                    onClose: _.bind(function () {
                        // svuota campi login
                        this.getView().byId("usernameInput").setValue("");
                        this.getView().byId("passwordInput").setValue("");
                    }, this),
                });
            }.bind(this), function (error) {
                this.busyPage.setBusy(false);
                sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
                    title: this._getLocaleText("errorLoginMessageBoxTitle"),
                    onClose: _.bind(function () {
                        // svuota campi login
                        this.getView().byId("usernameInput").setValue("");
                        this.getView().byId("passwordInput").setValue("");
                    }, this),
                });
            }.bind(this));
    },

    liveChange1: function (evt) {
        this.editPswModel.setProperty("/passOld", evt.getParameters().value)
        if (evt.getParameters().value !== "") {
            this.passInsertOld = true;
            evt.getSource().removeStyleClass("inputValidateError");
        } else {
            this.passInsertOld = false;
            evt.getSource().addStyleClass("inputValidateError");
        }
        if (this.passInsertOld === true && this.passInsertNew === true) {
            this.editPswModel.setProperty("/confirmChange", true);
        } else {
            this.editPswModel.setProperty("/confirmChange", false);
        };
    },

    liveChange2: function (evt) {
        this.editPswModel.setProperty("/passNew", evt.getParameters().value)
        if (evt.getParameters().value !== "") {
            this.passInsertNew = true;
            evt.getSource().removeStyleClass("inputValidateError");
        } else {
            this.passInsertNew = false;
            evt.getSource().addStyleClass("inputValidateError");
        };
        if (this.passInsertOld === true && this.passInsertNew === true) {
            this.editPswModel.setProperty("/confirmChange", true);
        } else {
            this.editPswModel.setProperty("/confirmChange", false);
        };
    },

    setAuthAndLogin: function (token) {
        sessionStorage.setItem("useAuth", true);
        var data = atob(token).split(":");
        this._doLogin(data[0], data[1]);
    }

});