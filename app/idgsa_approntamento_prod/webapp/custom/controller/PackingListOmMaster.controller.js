jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.PackingModel");
jQuery.sap.require("model.filters.Filter");
controller.AbstractController.extend("controller.PackingListOmMaster", {
    /**
     * @memberOf controller.PackingItemManagementMaster
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        //
        this.packingListOmMasterModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.packingListOmMasterModel, "packingListOmMasterModel");
        this.uiModel.setProperty("/searchValue", "");
        this.filterODataModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.filterODataModel, "filterOData");
        this.unfilteredPackingItem = [];
    },
    handleRouteMatched: function (evt) {
        // !this._checkRoute(evt, "packingItemManagementDetail") &&
        this._removeStyleClassOfilter();
        if (!this._checkRoute(evt, "packingListOm")) return;
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        var route = evt.getParameter("name");
        if (route !== "packingListOmDetail") {
            this.userLogged = model.service.LocalStorageService.session.get("userLogged");
            this.selectedOrganization = model.service.LocalStorageService.session.get("selectedOrganization");

            this.getView().setBusy(true);

            this.refreshList();
        }
    },
    onPackingItemPress: function (evt) {
        var selectedPackingItem = evt.getSource().getBindingContext("packingListOmMasterModel").getObject();
        this.selectedPackingItem = selectedPackingItem;
        model.service.LocalStorageService.session.save("currentPackingItem", selectedPackingItem);
        this.router.navTo("packingListOmDetail", {
            packingListId: selectedPackingItem.packingId
        });
    },
    /**
     * Filtra i clienti caricati localmente
     */
    onFilterPackingItemList: function () {
        this.packingListOmMasterModel.setData(this.unfilteredPackingItem);
        var packingList = _.filter(this.packingListOmMasterModel.getData(), function (o) {
            return o.moveOrderName.toUpperCase().indexOf(this.uiModel.getProperty("/searchValue").toUpperCase()) > -1;
        }.bind(this));
        this.packingListOmMasterModel.setData(packingList);
        this.packingListOmMasterModel.refresh();
    },
//    onSearchPackingItemList: function (evt) {
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
//        this._loadPackingItemsByName(moveOrderName.toUpperCase());
//        model.PackingModel.getPackingItems(requestData).then(fSuccess, fError);
//    },
    onNavButtonBackPress: function () {
        model.service.LocalStorageService.session.remove("currentPackingItem");
        model.service.LocalStorageService.session.remove("isSession");
        this.uiModel.setProperty("/searchValue", "");
        this.selectedPackingItem = undefined;
        this.router.navTo("launchpad");
    },
    /***************handle complex Filter*******************/
    onFilterPress: function () {
        this.filterModel = model.filters.Filter.getModel(this.packingListOmMasterModel.getData(), "packingList");
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
        var filterItems = model.filters.Filter.getSelectedItems("packingList");
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
        var list = this.getView().byId("packingListId");
        var binding = list.getBinding("items");
        binding.filter(filters);
    },
    onResetFilterPress: function () {
        this._removeStyleClassOfilter();
        this.uiModel.setProperty("/rangeVisible", false);
        model.filters.Filter.resetFilter("packingList");
        if (this.elementListFragment) {
            this.elementListFragment.destroy();
        }
        if (this.filterDialog) {
            if (this.filterDialog.isOpen()) {
                this.filterDialog.close();
            }
            this.filterDialog.destroy();
        }
        var list = this.getView().byId("packingListId");
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
        model.PackingModel.getPackingList(requestData).then(function (result) {
            this.uiModel.setProperty("/filtersApplied", this.filterApplied);
            this.packingListOmMasterModel.setData(result);
            this.unfilteredPackingItem = result;
            this.onResetFilterPress();
            this.getView().setBusy(false);
            this.onFilterPackingItemList();
            /* il codice che segue sarebbe per tenere l'elemento selezionato, ma il setSelectedItem non funziona --> da capire */
            if (this.selectedPackingItem) {
                var packingsList = this.getView().byId("packingListId");
                for (var j = 0; j < packingsList.getItems().length; j++) {
                    if (packingsList.getItems()[j].getTitle() === this.selectedPackingItem.packingItemName) {
                        var packingItem = packingsList.getItems()[j];
                        packingsList.setSelectedItem(packingItem);
                        break;
                    }
                }
            }
            /*******************************************************************************************************************/
        }.bind(this), function (error) {
            this.packingListOmMasterModel.setData([]);
            this.getView().setBusy(false);
            sap.m.MessageBox.error(error, {
                title: this._getLocaleText("errorLoadingPackingItemTitle")
            });
        }.bind(this));
    },



    //// complex filter on PackingItemList

    _initializeODataFilter: function (evt) {
        this.filterODataModel.setData({
            "selectedKey": "code",
            "items": [{
                    "id": "code",
                    "name": this._getLocaleText("packingItemId"),
                    "value": ""
    		},
                {
                    "id": "description",
                    "name": this._getLocaleText("packingItemName"),
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

//        var page = this.getView().byId("packingItemManagementMasterId");
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
    _loadPackingItemsByName: function (description) {
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
            this.packingListOmMasterModel.setData(result);

        }
        fSuccess = _.bind(fSuccess, this);

        var fError = function (err) {
            sap.m.MessageToast.show(err);
        }
        fError = _.bind(fError, this);

        model.PackingModel.getPackingByName(req)
            .then(fSuccess, fError);
    },


    handleOkButtonOnOdataFilter: function (oEvent) {

        var filter = this.filterODataModel.getData();
        switch (filter.selectedKey) {

            case "code":
                var filterCodeItem = _.find(filter.items, {
                    id: "code"
                });
                var packingItemId = filterCodeItem.value;
                if (!packingItemId) {
                    sap.m.MessageToast.show(this._getLocaleText("insertValue"));
                    return;
                }

                //    	        	this.router.navTo("packingItemManagementDetail", {
                //    	                packingItemId: packingItemId
                //    	            });
                this.refreshList(packingItemId);
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

                this._loadPackingItemsByName(nameDescr);
                break;

        }
        this._initializeODataFilter();
        this.odataFilterForIdDialog.close();
        //
    },


});
