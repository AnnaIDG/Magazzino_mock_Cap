jQuery.sap.declare("controller.AbstractController");
jQuery.sap.require("model.service.LocalStorageService");
jQuery.sap.require("model.UserModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("model.CurrentModel");
jQuery.sap.require("model.MoveOrderModel");
jQuery.sap.require("utils.Message");
jQuery.sap.require("utils.Busy");
sap.ui.core.mvc.Controller.extend("controller.AbstractController", {
    /**
     * @memberOf controller.AbstractController
     */
    onInit: function () {
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
        // JSONModel per la gestione di proprietà dell'interfaccia
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
        Date.prototype.ddmmyyyy = function () {
            var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = this.getDate().toString();
            return [(dd.length === 2 ? '' : '0') + dd, (mm.length === 2 ? '' : '0') + mm, this.getFullYear()].join('/');
        };
        Array.prototype.move = function (old_index, new_index) {
            if (new_index >= this.length) {
                var k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            return this;
        };
    },
    handleRouteMatched: function (evt) {
        var userLogged = model.service.LocalStorageService.session.get("userLogged")[0];
        this.userModel.setProperty("/userLogged", userLogged);
        this.mymodel = this.getView().getModel("mymodel");
        if (!this.mymodel) {
            this.mymodel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(this.mymodel, "mymodel");
        }
    },
    onLogoutPress: function () {
        this.getView().setBusy(true);
        var useAuth = sessionStorage.getItem("useAuth");
        sessionStorage.clear();
        localStorage.clear();
        model.UserModel.logout().then(function (result) {
            this.getView().setBusy(false);
            if (useAuth) {
                document.location.href = "../backoffice/index.html";
            } else {
                this.router.navTo("login");
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
        if (!list || !list.getBinding("items")) return null;
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
        this.checkLanguage();
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
        if (model.CurrentModel.getCustomer()) {
            return model.CurrentModel.getCustomer();
        }
        return false;
    },
    loadBusyIndicatorBeforeCart: function () {
        sap.m.MessageToast.show(this._getLocaleText("orderSimulationOngoing"));
        setTimeout(function () {
            sap.ui.core.BusyIndicator.show();
        }, 2000)
        setTimeout(function () {
            sap.ui.core.BusyIndicator.hide();
        }, 4000)
    },
    _selectFirstIconTab: function (iconTabBarId) {
        var iconTabBar = this.getView().byId(iconTabBarId);
        var selectedIconTabKey = iconTabBar.getSelectedKey();
        var firstTab = iconTabBar.getItems()[0];
        if (selectedIconTabKey !== firstTab.getId()) {
            iconTabBar.setSelectedItem(firstTab);
        }
    },
    goToOrderList: function () {
        this.router.navTo("orderList");
    },
    _sendOrderToSap: function (o) {
        var defer = Q.defer();
        var that = this;
        var fSuccess = function (res) {
            utils.Busy.hide();
            model.CurrentModel.removeOrder();
            sap.m.MessageBox.success(that._getLocaleText("orderSaved") + ": " + utils.Formatter.removeLeadingZeroes(res.Vbeln), {
                icon: sap.m.MessageBox.Icon.SUCCESS,
                title: that._getLocaleText("orderSaved"),
                actions: [sap.m.MessageBox.Action.OK],
            });
        };
        var fError = function (err) {
            utils.Busy.hide();
            defer.reject(err);
            var msg = utils.Message.getError(err);
            $.notify(
                msg, {
                position: 'bottom center',
                autoHideDelay: 5000,
                className: 'error'
            }
            );
        };
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.OrderModel.saveOrder(o).then(fSuccess, fError);
        return defer.promise;
    },

    _showBusy: function (simulate) {
        var msg = "orderCreateBusy";
        if (simulate) {
            msg = "orderSimulate"
        }
        utils.Busy.show(this._getLocaleText(msg));
    },

    _saveOrderInLocal: function (activeOrder) {
        model.CurrentModel.setOrder(activeOrder);
    },
    _getUserLogged: function () {
        if (model.service.LocalStorageService.session.get("userLogged")) {
            return model.service.LocalStorageService.session.get("userLogged");
        }
        return false;
    },

    _showError: function (msg, id) {
        if (!id) {
            $.notify(
                msg, {
                position: 'top center',
                autoHideDelay: 5000,
                className: 'error'
            }
            );
        } else {
            id = "#" + id;
            $(id).notify(
                msg, {
                position: 'top center',
                autoHideDelay: 5000,
                className: 'error'
            }
            );
        }
    },

    _showSuccess: function (id, msg) {
        if (!id) {
            $.notify(
                msg, {
                position: 'top center',
                autoHideDelay: 5000,
                className: 'success'
            }
            );
        } else {
            id = "#" + id;
            $(id).notify(
                msg, {
                position: 'top center',
                autoHideDelay: 5000,
                className: 'success'
            }
            );
        }
    },

    checkLanguage: function () {
        if (sessionStorage.getItem("language")) {
            sap.ui.getCore().getConfiguration().setLanguage(sessionStorage.getItem("language"));
        } else {
            sap.ui.getCore().getConfiguration().setLanguage("IT");
        }
    },

    _removeStyleClassOfilter: function () {
        this.getView().byId("filterButton").removeStyleClass("filterButton");
    },

    _calculateNumberOfItemsInCart: function (o) {
        var number = 0;
        if (o && o.productsList && o.productsList.length > 0) {
            number = o.productsList.length;
        }
        if (this.getView().getModel("mymodel")) {
            if (number > 0) {
                this.getView().getModel("mymodel").setProperty("/iconCart", "sap-icon://cart-full");
            } else {
                this.getView().getModel("mymodel").setProperty("/iconCart", "sap-icon://cart");
            }
            this.getView().getModel("mymodel").setProperty("/cartItems", number);
        }
        return number;
    },

    _getOrderFromLocal: function () {
        return model.CurrentModel.getOrder();
    },

    _getUserType: function () {
        return model.service.LocalStorageService.session.get("userType");
    },

    _getLoggedUserType: function () {
        var userLogged = this._getUserLogged();
        if (userLogged) {
            if (userLogged[0] && userLogged[0].hasOwnProperty("roleId"))
                return userLogged[0].roleId;
        }
        return false;
    },



});
