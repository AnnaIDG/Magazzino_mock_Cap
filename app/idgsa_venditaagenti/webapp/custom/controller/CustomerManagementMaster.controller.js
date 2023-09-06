jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.CustomerModel");
jQuery.sap.require("model.filters.Filter");

controller.AbstractController.extend("controller.CustomerManagementMaster", {
    /**
     * @memberOf controller.CustomerManagementMaster
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        //
        this.customerMasterModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.customerMasterModel, "customerMasterModel");
        this.unfilteredCustomer = [];
    },

    handleRouteMatched: function (evt) {

        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);

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
        this.getView().setBusy(true);
        model.CustomerModel.getCustomers(requestData).then(function (result) {
            this.customerMasterModel.setData(result);
            this.unfilteredCustomer = result;
            this.getView().setBusy(false);
            this.onFilterCustomerList();
            /* il codice che segue sarebbe per tenere l'elemento selezionato, ma il setSelectedItem non funziona --> da capire */
            if (this.selectedCustomer) {
                var customersList = this.getView().byId("customerListId");
                for (var j = 0; j < customersList.getItems().length; j++) {
                    if (customersList.getItems()[j].getTitle() === this.selectedCustomer.customerName) {
                        var customer = customersList.getItems()[j];
                        customersList.setSelectedItem(customer);
                        break;
                    }
                }
            }
            /*******************************************************************************************************************/
        }.bind(this), function (error) {
            this.getView().setBusy(true);
            sap.m.MessageBox.error(error, {
                title: this._getLocaleText("errorLoadingCustomerTitle")
            });
        }.bind(this));
    },

    onCustomerPress: function (evt) {
        var selectedCustomer = evt.getSource().getBindingContext("customerMasterModel").getObject();
        /*  per non perdere tempo inutilmente salvo nello sessionStorage il nome e il cod fiscale del cliente cliccato perché
            i dati mock non sono fatti benissimo. poi bisognerà togliere questa cosa che dall'odata i dati arriveranno sicuramente meglio */
        this.selectedCustomer = selectedCustomer;
        model.service.LocalStorageService.session.save("currentCustomer", selectedCustomer);

        /**********************************************************************************************************************************/
        this.router.navTo("customerManagementDetail", {
            customerId: selectedCustomer.customerId
        });
    },

    /**
     * Filtra i clienti caricati localmente
     */
    onFilterCustomerList: function () {
        this.customerMasterModel.setData(this.unfilteredCustomer);
        var customers = _.filter(this.customerMasterModel.getData(), function (o) {
            return o.customerName.toUpperCase().indexOf(this.uiModel.getProperty("/searchValue").toUpperCase()) > -1;
        }.bind(this));
        this.customerMasterModel.setData(customers);
        this.customerMasterModel.refresh();
    },

    /**
     * Effettua una ricerca clienti chiamando l'odata
     */
    onSearchCustomerList: function (evt) {
        // TODO
        console.log("onSearchCustomerList" + this.uiModel.getProperty("/searchValue"));
    },

    onNavButtonBackPress: function () {
        model.service.LocalStorageService.session.remove("currentCustomer");
        model.service.LocalStorageService.session.remove("isSession");
        this.uiModel.setProperty("/searchValue", "");
        this.selectedCustomer = undefined;
        this.router.navTo("launchpad");
    },

    /***************handle complex Filter*******************/

    onFilterPress: function () {
        this.filterModel = model.filters.Filter.getModel(
            this.customerMasterModel.getData(),
            "customers");
        this.getView().setModel(this.filterModel, "filter");
        var page = this.getView().byId("customerManagementMasterId");
        this.filterDialog = sap.ui.xmlfragment(
            "view.fragment.dialog.FilterDialog", this);
        page.addDependent(this.filterDialog);
        this.filterDialog.open();

    },

    onFilterPropertyPress: function (evt) {

        var parentPage = sap.ui.getCore().byId("parent");
        var elementPage = sap.ui.getCore().byId("children");
        // console.log(this.getView().getModel("filter").getData().toString());
        var navCon = sap.ui.getCore().byId("navCon");
        var selectedProp = evt.getSource().getBindingContext(
            "filter").getObject();
        this.getView().getModel("filter").setProperty(
            "/selected", selectedProp);
        this.elementListFragment = sap.ui.xmlfragment(
            "view.fragment.filterList", this);
        elementPage.addContent(this.elementListFragment);

        navCon.to(elementPage, "slide");
        this.getView().getModel("filter").refresh();
    },

    onBackFilterPress: function (evt) {
        // this.addSelectedFilterItem();
        this.navConBack();
        this.getView().getModel("filter").setProperty(
            "/selected", "");
        this.elementListFragment.destroy();
    },
    navConBack: function () {
        var navCon = sap.ui.getCore().byId("navCon");
        navCon.to(sap.ui.getCore().byId("parent"), "slide");
        this.elementListFragment.destroy();
    },
    afterOpenFilter: function (evt) {
        var navCon = sap.ui.getCore().byId("navCon");
        if (navCon.getCurrentPage().getId() == "children")
            navCon.to(sap.ui.getCore().byId("parent"), "slide");
        this.getView().getModel("filter").setProperty(
            "/selected", "");
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
                return (prop.indexOf(query.toString()
                    .toUpperCase()) >= 0)
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
        var filterItems = model.filters.Filter
            .getSelectedItems("customers");
        if (this.elementListFragment)
            this.elementListFragment.destroy();
        this.filterDialog.close();
        this.getView().getModel("filter").setProperty(
            "/selected", "");
        this.handleFilterConfirm(filterItems);
        this.filterDialog.destroy();
        delete(this.filterDialog);
    },
    handleFilterConfirm: function (selectedItems) {
        var filters = [];
        _.forEach(selectedItems, _.bind(function (item) {
            filters.push(this.createFilter(item.value,
                item.property));
        }, this));
        var list = this.getView().byId("customerListId");
        var binding = list.getBinding("items");
        binding.filter(filters);
    },
    onResetFilterPress: function () {
        this.uiModel.setProperty("/rangeVisible", false);
        model.filters.Filter.resetFilter("customers");
        if (this.elementListFragment) {
            this.elementListFragment.destroy();
        }
        if (this.filterDialog) {
            this.filterDialog.close();
            this.filterDialog.destroy();
        }
        var list = this.getView().byId("customerListId");
        var binding = list.getBinding("items");
        binding.filter();

    },

    /***************handle complex Filter*******************/
});