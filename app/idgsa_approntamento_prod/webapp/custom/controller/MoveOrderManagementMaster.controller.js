jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.MoveOrderModel");
jQuery.sap.require("model.filters.Filter");
controller.AbstractController.extend("controller.MoveOrderManagementMaster", {
    /**
     * @memberOf controller.MoveOrderManagementMaster
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        //
        this.moveOrderMasterModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.moveOrderMasterModel, "moveOrderMasterModel");
        this.uiModel.setProperty("/searchValue", "");
        this.filterODataModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.filterODataModel, "filterOData");
        this.unfilteredMoveOrder = [];
    },
    handleRouteMatched: function (evt) {
        // !this._checkRoute(evt, "moveOrderManagementDetail") &&
        this._removeStyleClassOfilter();
        if (!this._checkRoute(evt, "moveOrderManagement")) return;
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        var route = evt.getParameter("name");
        if (route !== "moveOrderManagementDetail") {
            this.userLogged = model.service.LocalStorageService.session.get("userLogged");
            this.selectedOrganization = model.service.LocalStorageService.session.get("selectedOrganization");

            this.getView().setBusy(true);

            this.refreshList();
        }
    },
    onMoveOrderPress: function (evt) {
        var selectedMoveOrder = evt.getSource().getBindingContext("moveOrderMasterModel").getObject();
        this.selectedMoveOrder = selectedMoveOrder;
        model.service.LocalStorageService.session.save("currentMoveOrder", selectedMoveOrder);
        this.router.navTo("moveOrderManagementDetail", {
            moveOrderId: selectedMoveOrder.moveOrderId
        });
    },
    /**
     * Filtra i clienti caricati localmente
     */
    onFilterMoveOrderList: function () {
        this.moveOrderMasterModel.setData(this.unfilteredMoveOrder);
        var moveOrders = _.filter(this.moveOrderMasterModel.getData(), function (o) {
            return o.moveOrderName.toUpperCase().indexOf(this.uiModel.getProperty("/searchValue").toUpperCase()) > -1;
        }.bind(this));
        this.moveOrderMasterModel.setData(moveOrders);
        this.moveOrderMasterModel.refresh();
    },
//    onSearchMoveOrderList: function (evt) {
//        var moveOrderName = evt.getSource().getValue();
//        var requestData = {
//            username: this.userLogged[0].userId,
//            alias: this.userLogged[0].alias,
//            salesOrg: this.selectedOrganization.salesOrgId,
//            distributionChannel: this.selectedOrganization.distributionChannelId,
//            division: this.selectedOrganization.divisionId,
//            society: this.selectedOrganization.societyId,
//            salesOffice: this.selectedOrganization.salesOffice,
//            salesGroup: this.selectedOrganization.salesGroup,
//            agentCode: this.userLogged[0].agentCode
//        };
//
//        this._loadMoveOrdersByName(moveOrderName.toUpperCase());
//        model.MoveOrderModel.getMoveOrders(requestData).then(fSuccess, fError);
//    },
    onNavButtonBackPress: function () {
        model.service.LocalStorageService.session.remove("currentMoveOrder");
        model.service.LocalStorageService.session.remove("isSession");
        this.uiModel.setProperty("/searchValue", "");
        this.selectedMoveOrder = undefined;
        this.router.navTo("launchpad");
    },
    /***************handle complex Filter*******************/
    onFilterPress: function () {
        this.filterModel = model.filters.Filter.getModel(this.moveOrderMasterModel.getData(), "moveOrders");
        this.getView().setModel(this.filterModel, "filter");
        var page = this.getView().byId("moveOrderManagementMasterId");
        this.filterDialog = sap.ui.xmlfragment("view.fragment.dialog.FilterDialog", this);
        page.addDependent(this.filterDialog);
        this.filterDialog.open();
    },
    onFilterPropertyPress: function (evt) {
        var parentPage = sap.ui.getCore().byId("parent");
        var elementPage = sap.ui.getCore().byId("children");
        // console.log(this.getView().getModel("filter").getData().toString());
        var navCon = sap.ui.getCore().byId("navCon");
        var selectedProp = evt.getSource().getBindingContext("filter").getObject();
        this.getView().getModel("filter").setProperty("/selected", selectedProp);
        this.elementListFragment = sap.ui.xmlfragment("view.fragment.filterList", this);
        elementPage.addContent(this.elementListFragment);
        navCon.to(elementPage, "slide");
        this.getView().getModel("filter").refresh();
    },
    onBackFilterPress: function (evt) {
        // this.addSelectedFilterItem();
        this.navConBack();
        this.getView().getModel("filter").setProperty("/selected", "");
        this.elementListFragment.destroy();
    },
    navConBack: function () {
        var navCon = sap.ui.getCore().byId("navCon");
        navCon.to(sap.ui.getCore().byId("parent"), "slide");
        this.elementListFragment.destroy();
    },
    afterOpenFilter: function (evt) {
        var navCon = sap.ui.getCore().byId("navCon");
        if (navCon.getCurrentPage().getId() == "children") navCon.to(sap.ui.getCore().byId("parent"), "slide");
        this.getView().getModel("filter").setProperty("/selected", "");
    },
    onSearchFilter: function (oEvt) {
        var aFilters = [];
        var sQuery = oEvt.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
            aFilters.push(this.createFilter(sQuery, "value"));
        }
        var list = sap.ui.getCore().byId("filterList");
        var binding = list.getBinding("items");
        binding.filter(aFilters);
    },
    createFilter: function (query, property) {
        var filter = new sap.ui.model.Filter({
            path: property,
            test: function (val) {
                var prop = val.toString().toUpperCase();
                return (prop.indexOf(query.toString().toUpperCase()) >= 0)
            }
        });
        return filter;
    },
    onFilterDialogClose: function (evt) {
        if (this.elementListFragment) {
            this.elementListFragment.destroy();
        }
        if (this.filterDialog) {
            this.filterDialog.close();
            this.filterDialog.destroy();
        }
    },
    onFilterDialogOK: function (evt) {
        var filterItems = model.filters.Filter.getSelectedItems("moveOrders");
        if (this.elementListFragment) this.elementListFragment.destroy();
        this.filterDialog.close();
        this.getView().getModel("filter").setProperty("/selected", "");
        this.handleFilterConfirm(filterItems);
        this.filterDialog.destroy();
        delete(this.filterDialog);
        this.uiModel.setProperty("/filtersApplied", true);
        if (filterItems.length > 0) {
            this.getView().byId("filterButton").addStyleClass("filterButton");
        }
    },
    handleFilterConfirm: function (selectedItems) {
        var filters = [];
        _.forEach(selectedItems, _.bind(function (item) {
            filters.push(this.createFilter(item.value, item.property));
        }, this));
        var list = this.getView().byId("moveOrderListId");
        var binding = list.getBinding("items");
        binding.filter(filters);
    },
    onResetFilterPress: function () {
        this._removeStyleClassOfilter();
        this.uiModel.setProperty("/rangeVisible", false);
        model.filters.Filter.resetFilter("moveOrders");
        if (this.elementListFragment) {
            this.elementListFragment.destroy();
        }
        if (this.filterDialog) {
            if (this.filterDialog.isOpen()) {
                this.filterDialog.close();
            }
            this.filterDialog.destroy();
        }
        var list = this.getView().byId("moveOrderListId");
        var binding = list.getBinding("items");
        binding.filter();
    },
    refreshList: function (kunnr) {
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
        this.filterApplied = false;
        if (kunnr && typeof (kunnr) === "string") {
            requestData.Kunnr = kunnr;
            this.filterApplied = true;
        }

        this.getView().setBusy(true);
        model.MoveOrderModel.getMoveOrders(requestData).then(function (result) {
            this.uiModel.setProperty("/filtersApplied", this.filterApplied);
            this.moveOrderMasterModel.setData(result);
            this.unfilteredMoveOrder = result;
            this.onResetFilterPress();
            this.getView().setBusy(false);
            this.onFilterMoveOrderList();
            /* il codice che segue sarebbe per tenere l'elemento selezionato, ma il setSelectedItem non funziona --> da capire */
            if (this.selectedMoveOrder) {
                var moveOrdersList = this.getView().byId("moveOrderListId");
                for (var j = 0; j < moveOrdersList.getItems().length; j++) {
                    if (moveOrdersList.getItems()[j].getTitle() === this.selectedMoveOrder.moveOrderName) {
                        var moveOrder = moveOrdersList.getItems()[j];
                        moveOrdersList.setSelectedItem(moveOrder);
                        break;
                    }
                }
            }
            /*******************************************************************************************************************/
        }.bind(this), function (error) {
            this.moveOrderMasterModel.setData([]);
            this.getView().setBusy(false);
            sap.m.MessageBox.error(error, {
                title: this._getLocaleText("errorLoadingMoveOrderTitle")
            });
        }.bind(this));
    },



    //// complex filter on MoveOrderList

    _initializeODataFilter: function (evt) {
        this.filterODataModel.setData({
            "selectedKey": "code",
            "items": [{
                    "id": "code",
                    "name": this._getLocaleText("moveOrderId"),
                    "value": ""
    		},
                {
                    "id": "description",
                    "name": this._getLocaleText("moveOrderName"),
                    "value": ""
    		}
                    ]
        });

    },




    onOdataFilterInput: function (evt) {
        var src = evt.getSource();
        var value = src.setValue(src.getValue().toUpperCase());
    },
    onOdataDirectSearch: function (evt) {

//        var page = this.getView().byId("moveOrderManagementMasterId");
        if (!this.odataFilterForIdDialog)
            this.odataFilterForIdDialog = sap.ui.xmlfragment("view.fragment.FilterOdataByProductId", this);

        this.getView().addDependent(this.odataFilterForIdDialog);
        this._initializeODataFilter();
        this.odataFilterForIdDialog.openBy(evt.getSource());
    },

    handleCancelButtonOnOdataFilter: function (oEvent) {
        this._initializeODataFilter();
        this.odataFilterForIdDialog.close();
    },
    _loadMoveOrdersByName: function (description) {
        var req = {
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
        req.moveOrderName = description;
        _.remove(this.applyedFilters, function (item) {
            return item.type == "odata";
        });

        var fSuccess = function (result) {
            this.moveOrderMasterModel.setData(result);

        }
        fSuccess = _.bind(fSuccess, this);

        var fError = function (err) {
            sap.m.MessageToast.show(err);
        }
        fError = _.bind(fError, this);

        model.MoveOrderModel.getMoveOrdersByName(req)
            .then(fSuccess, fError);
    },


    handleOkButtonOnOdataFilter: function (oEvent) {

        var filter = this.filterODataModel.getData();
        switch (filter.selectedKey) {

            case "code":
                var filterCodeItem = _.find(filter.items, {
                    id: "code"
                });
                var moveOrderId = filterCodeItem.value;
                if (!moveOrderId) {
                    sap.m.MessageToast.show(this._getLocaleText("insertValue"));
                    return;
                }

                //    	        	this.router.navTo("moveOrderManagementDetail", {
                //    	                moveOrderId: moveOrderId
                //    	            });
                this.refreshList(moveOrderId);
                this.uiModel.refresh();
                break;
            case "description":

                var filterDescriptionItem = _.find(filter.items, {
                    id: "description"
                });
                var nameDescr = filterDescriptionItem.value;
                if (!nameDescr) {
                    sap.m.MessageToast.show(this._getLocaleText("insertValue"));
                    return;
                }
                this.uiModel.setProperty("/filtersApplied", true);

                this._loadMoveOrdersByName(nameDescr);
                break;

        }
        this._initializeODataFilter();
        this.odataFilterForIdDialog.close();
        //
    },


});
