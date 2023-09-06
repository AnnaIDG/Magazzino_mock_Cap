jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.TilesModel");
jQuery.sap.require("model.CurrentModel");
jQuery.sap.require("model.service.LocalStorageService");
jQuery.sap.require("sap.m.MessageBox");
controller.AbstractController.extend("controller.Launchpad", {
    /**
     * @memberOf controller.Launchpad
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.tileModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.tileModel, "tiles");
        this.getView().addStyleClass("launchPadBackground");
        this.orgData = [];
    },
    handleRouteMatched: function (evt) {
        if (!this._checkRoute(evt, "launchpad")) return;
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);

        /*Rerender necessary for the tile bug of the new core version*/
        this.getView().rerender();
        this.uiModel.setProperty("/backButtonVisible", false);
        this.userLogged = model.service.LocalStorageService.session.get("userLogged");

        //        if (this.tileModel) {
        //            this.tileModel.setData({});
        //        }
        if (this.userLogged && this.userLogged.length === 1) {
            if (this.userLogged[0].roleId === "KU") {
                var requestData = {
                    customerId: this.userLogged[0].customerId,
                    salesOrg: this.userLogged[0].orgData.salesOrgId,
                    distributionChannel: this.userLogged[0].orgData.distributionChannelId,
                    division: this.userLogged[0].orgData.divisionId,
                    society: this.userLogged[0].orgData.societyId,
                    agentCode: this.userLogged[0].agentCode
                };
                this.getView().setBusy(true);
                model.CustomerModel.getCustomerDetail(requestData).then(function (result) {
                    this.getView().setBusy(false);
                    model.service.LocalStorageService.session.save("userType", this.userLogged[0].roleId);
                    model.service.LocalStorageService.session.save("currentCustomer", result);

                    model.service.LocalStorageService.session.save("isSession", true);
                    this.tileModel.setData(model.TilesModel.getTiles(this.userLogged[0].roleId, this._checkCustomerSession()));
                    this.tileModel.refresh();
//                    this.getRequestsNumber();
                }.bind(this), function (error) {
                    this.tileModel.setData({});
                    this.getView().setBusy(false);
                    sap.m.MessageBox.error(error, {
                        title: this._getLocaleText("errorLoadingCustomerTitle")
                    });
                }.bind(this));
            } else {
                model.service.LocalStorageService.session.save("selectedOrganization", this.userLogged[0].orgData);
                this.tileModel.setData(model.TilesModel.getTiles(this.userLogged[0].roleId, this._checkCustomerSession()));
                this.tileModel.refresh();
//                this.getRequestsNumber();
            }
        } else {
            model.service.LocalStorageService.session.save("selectedOrganization", this.userLogged[0].orgData);
            this.tileModel.setData(model.TilesModel.getTiles(this.userLogged[0].roleId, this._checkCustomerSession()));
        }
        if (!!(this.uiModel.getProperty("/isFromOrderList"))) this.uiModel.setProperty("/isFromOrderList", false);
        if (model.service.LocalStorageService.session.get("orderFromOrderList")) model.service.LocalStorageService.session.remove("orderFromOrderList");
    },

    onTilePress: function (evt) {
        var tile = evt.getSource();
        var route = tile.data().tileUrl;
        if (tile.getProperty("title") === this._getLocaleText("closeCustomerSessionTitle")) {
            model.service.LocalStorageService.session.remove("currentCustomer");
            this.userModel.setProperty("/selectedCustomer", null);
            if (this.userLogged && this.userLogged.length > 1) {
                this.uiModel.setProperty("/changeOrganization", true);
            }

            model.service.LocalStorageService.session.remove("isSession");
            this.tileModel.setData(model.TilesModel.getTiles(this.userLogged[0].roleId, this._checkCustomerSession()));
            this.tileModel.refresh();
        } else if (tile.getProperty("title") === this._getLocaleText("orderCreateTitle")) {
            if (!!(this.uiModel.getProperty("/isFromOrderList"))) this.uiModel.setProperty("/isFromOrderList", false);
            model.service.LocalStorageService.session.remove("orderFromOrderList");
            // cerco di recuperare l'ordine per quel cliente dal local storage e
            // proporlo
            // **
            var currentCustomer = model.service.LocalStorageService.session.get("currentCustomer");
            var currentUser = model.service.LocalStorageService.session.get("userLogged") ? model.service.LocalStorageService.session.get("userLogged")[0] : "";


            var customerId = currentCustomer ? currentCustomer.registry.customerId : "";
            var agentCode = currentUser ? currentUser.agentCode : "";

            var tempOrder = model.CurrentModel.getOrder();//model.service.LocalStorageService.session.get("order_" + customerId + "_" + agentCode);
            if (tempOrder) {

                tile.data().tileUrl;
                var that = this;
                sap.m.MessageBox.confirm(this._getLocaleText("restoreOrder"), {
                    title: this._getLocaleText("restoreOrderTitle"),
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (oAction) {
                        //                	  model.service.LocalStorageService.session.remove("order_"+customerId+"_"+agentCode);
                        if (oAction === "YES") {
                            //model.OrderModel.order = model.OrderModel.create(oldOrder);
                            //model.service.LocalStorageService.session.save("currentOrder", tempOrder);

                            that.router.navTo(route);
                        } else {
//                            model.service.LocalStorageService.session.remove("order_" + customerId + "_" + agentCode);
                            model.CurrentModel.removeOrder();
                            that.router.navTo(route);
                        }
                    }
                });
            } else {
                this.router.navTo(route);
            }
        } else if (tile.getProperty("title") === this._getLocaleText("customerManagementDetail")) {
            var selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer");
            this.router.navTo(route, {
                customerId: selectedCustomer.registry.customerId
            });
        } else {
            model.service.LocalStorageService.session.remove("viewCatalogFromOrder");
            this.router.navTo(route);
        }
    },

    getRequestsNumber: function () {

        this.userLogged = model.service.LocalStorageService.session.get("userLogged");
        this.selectedOrganization = model.service.LocalStorageService.session.get("selectedOrganization");
        var requestData = {
            username: this.userLogged[0].userId,
            alias: this.userLogged[0].alias,
            salesOrg: this.selectedOrganization.salesOrgId,
            distributionChannel: this.selectedOrganization.distributionChannelId,
            division: this.selectedOrganization.divisionId,
            society: this.selectedOrganization.societyId,
            salesOffice: this.selectedOrganization.salesOffice,
            salesGroup: this.selectedOrganization.salesGroup,
            agentCode: this.userLogged[0].agentCode
        };
        model.SubscriptionModel.getSubscriptionRequests(requestData).then(function (result) {
            var tile = _.find(this.tileModel.getData(), {
                url: "subscriptionRequests"
            });
            tile.number = result.length;
            this.tileModel.refresh();

            /*******************************************************************************************************************/
        }.bind(this), function (error) {
            this.requestMasterModel.setData([]);
            this.getView().setBusy(false);

        }.bind(this));

    }

});
// /////////////////////////////////////////////////////////////////////
