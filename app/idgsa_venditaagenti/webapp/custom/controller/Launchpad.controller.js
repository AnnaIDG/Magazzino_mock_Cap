jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.TilesModel");
jQuery.sap.require("model.CurrentModel");
jQuery.sap.require("model.CustomerModel");
jQuery.sap.require("model.service.LocalStorageService");

controller.AbstractController.extend("controller.Launchpad", {
    /**
     * @memberOf controller.Launchpad
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.tileModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.tileModel, "tiles");
        this.getView().addStyleClass("launchPadBackground");
    },
    
//    onAfterRendering: function(){
//        this.getView().rerender();
//    },

    handleRouteMatched: function (evt) {
        if (!this._checkRoute(evt, "launchpad"))
            return;

        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        this.getView().rerender();
        this.uiModel.setProperty("/backButtonVisible", false);

        this.userLogged = model.service.LocalStorageService.session.get("userLogged");
        this.uiModel.setProperty("/changeOrganization", false);
        
        // se l'utente ha più organizzazioni commerciali mostro la dialog per la
        // scelta di una di esse
        if (this.userLogged && this.userLogged.length > 1) {
            var orgData = [];
            for (var i = 0; i < this.userLogged.length; i++) {
                orgData.push(this.userLogged[i].orgData);
            }

            this.dataOrgModel = new sap.ui.model.json.JSONModel();
            this.dataOrgModel.setProperty("/orgData", orgData);
            this.getView().setModel(this.dataOrgModel, "dataOrg");

            var selectedOrganization = model.service.LocalStorageService.session.get("selectedOrganization");
            this.tileModel.setData({});
            if (!selectedOrganization) {
                this._innerDataOrgDialogOpen();
            } else {
                this.tileModel.setData(model.TilesModel.getTiles(this.userLogged[0].roleId, this._checkCustomerSession()));
                this.tileModel.refresh();
            }
            if (this._checkCustomerSession()) {
                if (this.userLogged[0].roleId === "KU") {
                    this.uiModel.setProperty("/changeOrganization", true);
                } else {
                    this.uiModel.setProperty("/changeOrganization", false);
                }

            } else {
                this.uiModel.setProperty("/changeOrganization", true);
            }

        } else {
            model.service.LocalStorageService.session.save("selectedOrganization", this.userLogged[0].orgData);
            this.tileModel.setData(model.TilesModel.getTiles(this.userLogged[0].roleId, this._checkCustomerSession()));
            this.tileModel.refresh();
            this.cssReload();
        }
        if (!!(this.uiModel.getProperty("/isFromOrderList")))
            this.uiModel.setProperty("/isFromOrderList", false);
        if (model.service.LocalStorageService.session.get("orderFromOrderList"))
            model.service.LocalStorageService.session.remove("orderFromOrderList");
    },

    _innerDataOrgDialogOpen: function () {
        var currentCustomer = model.service.LocalStorageService.session.get("currentCustomer");

        if (!this.dataOrgDialog)
            this.dataOrgDialog = sap.ui.xmlfragment("view.fragment.dialog.SelectOrganizationData", this);

        var page = this.getView().byId("launchpadPageId");
        page.addDependent(this.dataOrgDialog);
        // if (!model.service.LocalStorageService.session.get("isSession")) {
        this.dataOrgDialog.open();
        if (!!currentCustomer) {
            model.service.LocalStorageService.session.remove("currentCustomer");
        }
        // }

        this.dataOrgSelectList = sap.ui.getCore().byId("dataOrgSelectListId");
        if (!this.dataOrgSelectList.getSelectedItem()) {
            this.dataOrgSelectList.setSelectedItem(this.dataOrgSelectList.getItems()[0]);
        }
        this.tileModel.setData(model.TilesModel.getTiles(this.userLogged[0].roleId, this._checkCustomerSession()));
        this.tileModel.refresh();
    },

    onDataOrgDialogOpen: function () {
        this._innerDataOrgDialogOpen();
    },

    onDataOrgDialogConfirm: function (evt) {
        var itemSelected = evt.getSource().getParent().getContent()[0].getSelectedItem().getBindingContext("dataOrg").getObject();
        model.service.LocalStorageService.session.save("selectedOrganization", itemSelected);
        /**
         * Controllo se lo user e un cliente semplice
         */
        if (this.userLogged[0].roleId === "KU") {
            var requestData = {
                customerId: this.userLogged[0].customerId,
                salesOrg: itemSelected.salesOrgId,
                distributionChannel: itemSelected.distributionChannelId,
                division: itemSelected.divisionId,
                society: itemSelected.societyId,
                agentCode: this.userLogged[0].agentCode
            };

            this.getView().setBusy(true);
            model.CustomerModel.getCustomerDetail(requestData).then(function (result) {
                this.getView().setBusy(false);
                model.service.LocalStorageService.session.save("currentCustomer", result);
                model.service.LocalStorageService.session.save("isSession", true);
            }.bind(this), function (error) {
                this.getView().setBusy(false);
                sap.m.MessageBox.error(error, {
                    title: this._getLocaleText("errorLoadingCustomerTitle")
                });
            }.bind(this));
        }
        this.cssReload();
        this.dataOrgDialog.close();
    },

    onDataOrgDialogBeforeClose: function (evt) {
        var itemSelected = evt.getSource().getContent()[0].getSelectedItem().getBindingContext("dataOrg").getObject();
        model.service.LocalStorageService.session.save("selectedOrganization", itemSelected);
        /**
         * Controllo se lo user e un cliente semplice
         */
        if (this.userLogged[0].roleId === "KU") {
            var requestData = {
                customerId: this.userLogged[0].customerId,
                salesOrg: itemSelected.salesOrgId,
                distributionChannel: itemSelected.distributionChannelId,
                division: itemSelected.divisionId,
                society: itemSelected.societyId,
                agentCode: this.userLogged[0].agentCode
            };

            this.getView().setBusy(true);
            model.CustomerModel.getCustomerDetail(requestData).then(function (result) {
                this.getView().setBusy(false);
                model.service.LocalStorageService.session.save("currentCustomer", result);
                model.service.LocalStorageService.session.save("isSession", true);
                this.tileModel.setData(model.TilesModel.getTiles(this.userLogged[0].roleId, this._checkCustomerSession()));
                this.tileModel.refresh();
            }.bind(this), function (error) {
                this.getView().setBusy(false);
                sap.m.MessageBox.error(error, {
                    title: this._getLocaleText("errorLoadingCustomerTitle")
                });
            }.bind(this));
        } else {
            this.tileModel.setData(model.TilesModel.getTiles(this.userLogged[0].roleId, this._checkCustomerSession()));
            this.tileModel.refresh();
        }
    },

    onDataOrgDialogAfterClose: function () {},

    onTilePress: function (evt) {
        var tile = evt.getSource();
        var route = tile.data().tileUrl;
        if (tile.getProperty("title") === this._getLocaleText("closeCustomerSessionTitle")) {
            model.service.LocalStorageService.session.remove("currentCustomer");
            this.userModel.setProperty("/selectedCustomer", null);
            if (this.userLogged && this.userLogged.length > 1) {
                this.uiModel.setProperty("/changeOrganization", true);
            }
            var oldCustomerOrder = model.service.LocalStorageService.session.get("currentOrder");
            model.service.LocalStorageService.local.save("oldCustomerOrder", oldCustomerOrder);
            model.service.LocalStorageService.session.remove("currentOrder");

            model.service.LocalStorageService.session.remove("isSession");
            this.tileModel.setData(model.TilesModel.getTiles(this.userLogged[0].roleId, this._checkCustomerSession()));
            this.tileModel.refresh();
        } else if (tile.getProperty("title") === this._getLocaleText("orderCreateTitle")) {
            if (!!(this.uiModel.getProperty("/isFromOrderList")))
                this.uiModel.setProperty("/isFromOrderList", false);
            if (model.service.LocalStorageService.session.get("orderFromOrderList"))
                model.service.LocalStorageService.session.remove("orderFromOrderList");
            // cerco di recuperare l'ordine per quel cliente dal local storage e
            // proporlo
            // **
            var oldOrder = model.service.LocalStorageService.local.get("oldCustomerOrder");
            model.service.LocalStorageService.session.remove("currentOrder");
            
            var currentCustomer = model.service.LocalStorageService.session.get("currentCustomer");
            if (oldOrder && currentCustomer && (oldOrder.customerId === currentCustomer.registry.customerId)) {
                tile.data().tileUrl;
                var that = this;
                sap.m.MessageBox.confirm(this._getLocaleText("restoreOrder"), {
                    title: this._getLocaleText("restoreOrderTitle"),
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === "YES") {
                            //model.OrderModel.order = model.OrderModel.create(oldOrder);
                            model.service.LocalStorageService.session.save("currentOrder", oldOrder);
                            that.router.navTo(route);
                        } else {
                            that.router.navTo(route);
                        }
                    }
                });
            } else {
                model.service.LocalStorageService.local.remove("oldCustomerOrder");
                this.router.navTo(route);
            }
            /* Modifiche Gabio da JIRA -> METASF-7 punto 3 */
        } else if (tile.getProperty("title") === this._getLocaleText("customerManagementDetail")) {
            var selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer");
            //            model.service.LocalStorageService.session.save("fromLaunchpadToCustomerManagmentDetail", true);
            this.router.navTo(route, {
                customerId: selectedCustomer.registry.customerId
            });
            /* FINE Modifiche Gabio da JIRA -> METASF-7 punto 3 */
        } else {
            model.service.LocalStorageService.session.remove("viewCatalogFromOrder");
            this.router.navTo(route);
        }
    }
});

// /////////////////////////////////////////////////////////////////////