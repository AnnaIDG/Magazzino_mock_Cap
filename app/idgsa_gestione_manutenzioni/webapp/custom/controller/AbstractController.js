jQuery.sap.declare("controller.AbstractController");
jQuery.sap.require("model.service.LocalStorageService");
jQuery.sap.require("model.UserModel");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("utils.SAPMessageUtil");
jQuery.sap.require("utils.Asynchronous");
jQuery.sap.require("model.NoticeStateModel");

sap.ui.core.mvc.Controller.extend("controller.AbstractController", {
    /**
     * @memberOf controller.AbstractController
     */
    onInit: function () {
        this.SAPMessageUtil = utils.SAPMessageUtil;
        //
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
        // JSONModel per la gestione di proprietà
        // dell'interfaccia
        this.uiModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.uiModel, "ui");
        // JSONModel per la gestione dell'utente lato UI
        this.userModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.userModel, "user");
        // JSONModel per la gestione dei popover per mostrare
        // tutto il testo
        this.fullTextModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.fullTextModel, "fullTextModel");
        this.getView().addStyleClass("logoBackground");
        if (!Array.isArray) {
            Array.isArray = function (arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
        Date.prototype.ddmmyyyy = function () {
            var mm = (this.getMonth() + 1).toString(); // getMonth()
            // is
            // zero-based
            var dd = this.getDate().toString();
            return [(dd.length === 2 ? '' : '0') + dd, (mm.length === 2 ? '' : '0') + mm,
            this.getFullYear()].join('/');
        };
    },
    handleRouteMatched: function (evt) {
        this.userModel.setProperty("/userLogged", model.service.LocalStorageService.session.get("userLogged"));
        this.uiModel.setProperty("/dateFormat", "dd-mm-yyyy");
        this.uiModel.setProperty("/linkToUserDetail", false);
    },
    onLogoutPress: function () {
        this.getView().setBusy(true);
        var useAuth = sessionStorage.getItem("useAuth");
        sessionStorage.clear();
        model.UserModel.logout().then(function (result) {
            this.getView().setBusy(false);
            if (useAuth) {
                document.location.href = "../backoffice/index.html";
            } else {
                this.router.navTo("login");
            }
        }.bind(this), function (error) {
            this.getView().setBusy(false);
            sap.m.MessageBox.error(this.SAPMessageUtil.getErrorMessage(error), {
                title: this._getLocaleText("errorLogoutMessageBoxTitle")
            });
        }.bind(this));
    },
    /**
     * Checks the route pattern
     * 
     * @param evt the route event
     * @param pattern the expected pattern
     */
    _checkRoute: function (evt, pattern) {
        if (pattern === "launchpad") {
            this.uiModel.setProperty("/linkToUserDetail", true);
        }
        if (evt.getParameter("name") !== pattern) {
            return false;
        }
        return true;
    },
    /**
     * Returns the localized text for a key
     * 
     * @param key
     */
    _getLocaleText: function (key) {
        return this.getView().getModel("i18n").getProperty(key);
    },
    /**
     * @returns the current user
     */
    _getUserLogged: function () {
        if (model.service.LocalStorageService.session.get("userLogged")) {
            return model.service.LocalStorageService.session.get("userLogged");
        }
        return false;
    },
    /**
     * @returns the current user's role
     */
    _getUserLoggedRole: function () {
        var user = model.service.LocalStorageService.session.get("userLogged");
        //			if (model.service.LocalStorageService.session.get("userLogged")
        //				/* && model.service.LocalStorageService.session.get("userLogged").roleId) {
        // TODO verificare come gestire i ruoli utente
        // return model.service.LocalStorageService.session.get("userLogged").roleId;
        //				return "1";
        //			}

        //notifCreate
        //notifUpdate
        //rfidEquiUpdate
        //rfidFnclocUpdate

        if (user) {
            if (user.notifCreate === "X" && user.notifUpdate === "X" && (user.rfidEquiUpdate === "X" || user.rfidFnclocUpdate === "X")) {
                return "1";
            } else if (user.notifCreate === "X" && user.notifUpdate === "" && (user.rfidEquiUpdate === "X" || user.rfidFnclocUpdate === "X")) {
                return "4";
            } else if (user.notifCreate === "" && user.notifUpdate === "X" && (user.rfidEquiUpdate === "X" || user.rfidFnclocUpdate === "X")) {
                return "5";
            } else if (user.notifCreate === "X" && user.notifUpdate === "X" && (user.rfidEquiUpdate === "" || user.rfidFnclocUpdate === "")) {
                return "2";
            } else if (user.notifCreate === "" && user.notifUpdate === "X" && (user.rfidEquiUpdate === "" || user.rfidFnclocUpdate === "")) {
                return "3";
            }
        }
        return "";
    },
    /**
     * @returns the current user's id
     */
    _getUserLoggedId: function () {
        if (model.service.LocalStorageService.session.get("userLogged") && model.service.LocalStorageService.session.get("userLogged").userId) {
            return model.service.LocalStorageService.session.get("userLogged").userId;
        }
        return "";
    },
    /**
     * seleziona il primo tab di un IconTabBar
     * 
     * @param iconTabBarId
     */
    _selectFirstIconTab: function (iconTabBarId) {
        var iconTabBar = this.getView().byId(iconTabBarId);
        if (iconTabBarId !== "iconTabBarNoticeDetailId") {
            var selectedIconTabKey = iconTabBar.getSelectedKey();
            var firstTab = iconTabBar.getItems()[0];
            if (selectedIconTabKey !== firstTab.getId()) {
                iconTabBar.setSelectedItem(firstTab);
            }
        } else {
            iconTabBar.setSelectedKey("headNotice");
        }
    },
    populateSelect: function (models, callback) {
        // models is an array of object {"namespace",
        // "odata/mock_to_call"},
        // callback is an optional function called when all the
        // select
        // are loaded
        if (!models || models.length == 0) {
            console.log("No Select to Load");
            return;
        }
        var that = this;
        var callbackFunc = callback ? _.bind(callback, that) : _.bind(function () {
            console.log("Loading Select Complete");
        }, that);
        utils.Asynchronous.asyncLoop({
            length: models.length,
            functionToLoop: function (loop, i) {
                var fSuccess = function (res) {
                    var model = new sap.ui.model.json.JSONModel();
                    model.setData({
                        results: res
                    });
                    that.getView().setModel(model, models[i].namespace);
                    loop();
                };
                var fError = function (res) {
                    var model = new sap.ui.model.json.JSONModel();
                    console.log("Error Loading model" + models[i].namespace);
                    that.getView().setModel(model, models[i].namespace);
                    loop();
                };
                fSuccess = _.bind(fSuccess, this);
                fError = _.bind(fError, this);
                $.getJSON("custom/model/mockData/" + models[i].url + ".json").then(fSuccess, fError);
            },
            callback: callbackFunc
        });
    },
    _showFullTextPopover: function (evt, modelName, prop) {
        var binding = evt.getSource().getBindingContext(modelName);
        var item = binding ? binding.getObject() : this.getView().getModel(modelName).getData();
        if (!this._fullTextPopover) {
            this._fullTextPopover = sap.ui.xmlfragment("view.fragment.FullTextPopover", this);
        }
        this.getView().addDependent(this._fullTextPopover);
        this.fullTextModel.setProperty("/property", item[prop]);
        this.fullTextModel.refresh();
        this._fullTextPopover.openBy(evt.getSource());
        // delay because addDependent will do a async
        // rerendering and the actionSheet will immediately
        // close without it.
        // jQuery.sap.delayedCall(0, this, function() {
        // this._fullTextPopover.openBy(evt.getSource());
        // });
    },
    _loadNetworkStatusSet: function () {
        model.NoticeStateModel._loadNoticeStates();
    }
});