jQuery.sap.declare("controller.AbstractController");
jQuery.sap.require("model.service.LocalStorageService");
jQuery.sap.require("model.UserModel");

sap.ui.core.mvc.Controller.extend("controller.AbstractController", {

    /**
     * @memberOf controller.AbstractController
     */

    onInit: function () {
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
        // JSONModel per la gestione di proprietà dell'interfaccia
        this.cssReload();
        this.uiModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.uiModel, "ui");
        // JSONModel per la gestione dell'utente lato UI
        this.userModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.userModel, "user");

        if (!Array.isArray) {
            Array.isArray = function (arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
    },

    handleRouteMatched: function (evt) {
        this.userModel.setProperty("/userLogged", model.service.LocalStorageService.session.get("userLogged")[0]);
        var customer = model.service.LocalStorageService.session.get("currentCustomer");
        if (customer && customer.registry) {
            this.userModel.setProperty("/selectedCustomer", customer.registry);
        } else {
            this.userModel.setProperty("/selectedCustomer", customer);
        }
        if (!!(model.service.LocalStorageService.session.get("userLogged")[0].roleId)) {
            if (model.service.LocalStorageService.session.get("userLogged")[0].roleId === "BO") {
                this.uiModel.setProperty("/isBackofficeUser", true);
            } else {
                this.uiModel.setProperty("/isBackofficeUser", false);
            }
        }
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
                this.cssReload();
            }
        }.bind(this), function (error) {
            this.getView().setBusy(false);
            sap.m.MessageBox.error(error, {
                title: this._getLocaleText("errorLogoutMessageBoxTitle")
            });
        }.bind(this));
    },

    getFiltersOnList: function (evt) {
        var list = this.getView().byId("catalogListId");
        if (!list || !list.getBinding("items"))
            return null;

        return list.getBinding("items").aFilters;
    },

    /**
     * Checks the route pattern
     * 
     * @param evt
     *            the route event
     * @param pattern
     *            the expected pattern
     */
    _checkRoute: function (evt, pattern) {
        if (evt.getParameter("name") !== pattern) {
            return false;
        }
        return true;
    },

    /**
     * Checks
     */
    _checkCustomerSession: function () {
        if (model.service.LocalStorageService.session.get("isSession")) {
            return true;
        }
        return false;
    },

    /**
     * Returns the localized text for a key
     * 
     * @param key
     */
    _getLocaleText: function (key) {
        return this.getView().getModel("i18n").getProperty(key);
    },

    /*
      get the select organization for oData call
    */
    _getOrgData: function () {
        if (model.service.LocalStorageService.session.get("selectedOrganization")) {
            var o = model.service.LocalStorageService.session.get("selectedOrganization");
            var orgData = {
                "Bukrs": o.societyId,
                "Vkorg": o.salesOrgId,
                "Vtweg": o.distributionChannelId,
                "Spart": o.divisionId
            };
            return orgData;
        }
    },

    _getCurrentCustomer: function () {
        if (model.service.LocalStorageService.session.get("currentCustomer")) {
            return model.service.LocalStorageService.session.get("currentCustomer");
        }
        return false;
    },

    _getCurrentSalesOrg: function () {
        if (model.service.LocalStorageService.session.get("selectedOrganization")) {
            var currentOrg = model.service.LocalStorageService.session.get("selectedOrganization");
            if (!!currentOrg.salesOrgId && currentOrg.salesOrgId.trim().length > 0) {
                switch (currentOrg.salesOrgId) {
                    case "3000":
                        return "RCF";
                        break;
                    case "2000":
                        return "AEB";
                        break;
                    default:
                        return "RCF";
                }
            }
        }
        return false;
    },

    onUserInfoPress: function () {
        this.router.navTo("userInfo");
    },

    loadBusyIndicatorBeforeCart: function () {
        /*Temp Code just for the demo*/
        sap.m.MessageToast.show(this._getLocaleText("orderSimulationOngoing"), { duration: 1500 });
        setTimeout(function () {
            sap.ui.core.BusyIndicator.show();
        }, 1000)
        setTimeout(function () {
            sap.ui.core.BusyIndicator.hide();
        }, 3000)
    },

    cssReload: function () {
        //** risetto il css
        var salesOrg = this._getCurrentSalesOrg();
        if (salesOrg) {
            //var division = workingUserFromSession.organizationData.results[0].division;
            jQuery.sap.includeStyleSheet("custom/css/custom" + salesOrg + ".css", "custom_style");
        } else {
            jQuery.sap.includeStyleSheet("custom/css/blank.css", "custom_style");
        }
        //**
    }

});