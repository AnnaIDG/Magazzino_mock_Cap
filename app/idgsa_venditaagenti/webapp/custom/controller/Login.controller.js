jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.UserModel");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("model.service.LocalStorageService");

controller.AbstractController.extend("controller.Login", {

    /**
     * @memberOf controller.Login
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        //
        this.appModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.appModel, "appModel");
        this.getView().addStyleClass("loginPageBackground");
        //
        this.versionModel = new sap.ui.model.json.JSONModel();
        this.versionModel.getData().version = icms.Component.getMetadata().getManifestEntry("sap.app").applicationVersion.version;
        this.getView().setModel(this.versionModel, "versionModel");
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
            sap.m.MessageToast.show(this._getLocaleText(msg), {
                duration: 4000
            });
        } else if (_.isEmpty(passwordInput)) {
            this.getView().byId("passwordInput").addStyleClass("inputValidateError");
            sap.m.MessageToast.show(this._getLocaleText("passwordRequired"), {
                duration: 4000
            });
        } else {
            this.getView().setBusy(true);
            this._doLogin(usernameInput, passwordInput);
            // model.UserModel.login(usernameInput, passwordInput).then(function (result) {
            //     this.getView().setBusy(false);
            //     /*
            //      * if(result.length>1){ //l'utente è abilitato a più
            //      * organizzazioni commerciali
            //      * model.service.LocalStorageService.session.save("userLogged",
            //      * result); } else if(result.length===1){ //l'utente è abilitato
            //      * ad una sola organizzazione
            //      * model.service.LocalStorageService.session.save("currentUser",
            //      * result); }
            //      */
            //     model.service.LocalStorageService.session.save("userLogged", result);
            //     this.router.navTo("launchpad");
            // }.bind(this), function (error) {
            //     this.getView().setBusy(false);
            //     sap.m.MessageBox.error(error, {
            //         title: this._getLocaleText("errorLoginMessageBoxTitle")
            //     });
            // }.bind(this));
        }
    },

    _doLogin: function (username, password) {
        model.UserModel.login(username, password).then(function (result) {
            this.getView().setBusy(false);
            /*
             * if(result.length>1){ //l'utente è abilitato a più
             * organizzazioni commerciali
             * model.service.LocalStorageService.session.save("userLogged",
             * result); } else if(result.length===1){ //l'utente è abilitato
             * ad una sola organizzazione
             * model.service.LocalStorageService.session.save("currentUser",
             * result); }
             */
            model.service.LocalStorageService.session.save("userLogged", result);
            this.router.navTo("launchpad");
        }.bind(this), function (error) {
            this.getView().setBusy(false);
            sap.m.MessageBox.error(error, {
                title: this._getLocaleText("errorLoginMessageBoxTitle")
            });
        }.bind(this));
    },

    onLiveChange: function (evt) {
        if (_.isEmpty(evt.getSource().getValue())) {
            evt.getSource().addStyleClass("inputValidateError");
        } else {
            evt.getSource().removeStyleClass("inputValidateError");
        }
    },

    onSwitchLanguage: function (oEvent) {
        var control = oEvent.getSource();
        var state = control.getState();
        var i18nModel;
        if (state) {
            sap.ui.getCore().getConfiguration().setLanguage("EN");

        } else {
            sap.ui.getCore().getConfiguration().setLanguage("IT");

        }
        sap.m.MessageToast.show(this._getLocaleText("languageChanged"), {
            at: "center bottom"
        });
        //        location.reload();
    },

    setAuthAndLogin: function (token) {
        sessionStorage.setItem("useAuth", true);
        var data = atob(token).split(":");
        /* this.appModel.setProperty("/username", data[0]);
        this.appModel.setProperty("/password", data[1]); */
        this._doLogin(data[0], data[1]);
    }
});