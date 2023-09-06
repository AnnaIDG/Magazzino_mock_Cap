jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.CatalogModel");
jQuery.sap.require("utils.ObjectUtils");


controller.AbstractController.extend("controller.CatalogHierarchy", {
    /**
     * @memberOf controller.CatalogHierarchy
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.catalogModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.catalogModel, "catalogModel");
        this.unfilteredCatalogHierarchy = [];
    },



    handleRouteMatched: function (evt) {
        /*
         * if (!this._checkRoute(evt, "launchpad")) return;
         */
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        this.currentCustomer = model.service.LocalStorageService.session.get("currentCustomer");
        var route = evt.getParameter("name");
        if (route !== "productDetail") {

            var orderFromOrderlist = model.service.LocalStorageService.session.get("orderFromOrderList");
            if(!!orderFromOrderlist){
                this.uiModel.setProperty("/isFromOrderList", true);
            }else{
                this.uiModel.setProperty("/isFromOrderList", false);
            }
            
            this.uiModel.setProperty("/filtersApplied", false);

            /*Advanced Filter Part*/
            this.filterOutModel = new sap.ui.model.json.JSONModel();
            var now = new Date();
            var past = new Date();
            past.setDate(past.getDate() - 30);
            var filterByDate = {
                "en": false,
                "results": {
                    "from": past,
                    "to": now
                }
            };

            this.filterOutModel.setData({});
            this.filterOutModel.setProperty("/lastBoughtDate", filterByDate);
            /*Advanced Filter Part*/

            this.getView().setModel(this.filterOutModel, "filterOut");
            //**
            var currentCustomer = this._getCurrentCustomer();
            var req = this._getOrgData();
            if (!!currentCustomer)
                if (!!currentCustomer.registry) {
                    req.Kunnr = currentCustomer.registry.customerId;
                } else {
                    req.Kunnr = currentCustomer.customerId;
                }
                //**
            model.CatalogModel.getHierarchy(req)
                .then(_.bind(this.refreshList, this));
        }
        if (route === "productCatalog") {
            this.uiModel.setProperty("/hierarchyButtonVisible", false);
        } else {
            this.uiModel.setProperty("/hierarchyButtonVisible", true);
        }
        if (model.service.LocalStorageService.session.get("viewCatalogFromOrder")) {
            this.uiModel.setProperty("/isFromOrder", true);
        } else {
            this.uiModel.setProperty("/isFromOrder", false);
        }
        
        
    },
    
    removeFiltersFromList: function(){
        var currentCustomer = this._getCurrentCustomer();
            var req = this._getOrgData();
            if (!!currentCustomer)
                if (!!currentCustomer.registry) {
                    req.Kunnr = currentCustomer.registry.customerId;
                } else {
                    req.Kunnr = currentCustomer.customerId;
                }
                //**
            model.CatalogModel.getHierarchy(req)
                .then(_.bind(this.refreshList, this));
        this.uiModel.setProperty("/filtersApplied", false);
    },

    refreshList: function (results) {
        this.unfilteredCatalogHierarchy = results;
        this.uiModel.setProperty("/searchValue", "");
        var filters = this.getFiltersOnList();

        if (filters.length > 0)
            this.getView().byId("catalogListId").getBinding("items").filter(filters);

        this.getView().getModel("catalogModel").setData(results);

    },

    onItemPress: function (item) {
        var selectedItem = item.getSource().getBindingContext("catalogModel").getObject();
        var selectedLevel = selectedItem.level;
        jQuery.sap.delayedCall(1000, this, function () {
            this.changeFavoriteTooltip();
        });
        if (selectedLevel) {
            this.setPath(selectedItem);
        }
        var req = this._getOrgData();
        req.productId = selectedItem.productId;
        this.uiModel.setProperty("/hierarchyButtonVisible", true);
        if (selectedItem && (selectedItem.ultimo) === "X") {
            this.router.navTo("productDetail", {
                productId: selectedItem.productId
            });
            this.uiModel.refresh();
        } else {
            if(!!selectedLevel && selectedLevel=== "2"){
                this.lastParent = selectedItem.parentId;
            }
            model.CatalogModel.getProducts(req)
                .then(_.bind(this.refreshList, this));
        }
    },

    changeFavoriteTooltip: function () {
        $('.hierarchyListItem').find("span.sapUiIcon[id$='favorite']").attr("title", this._getLocaleText("lastOrderedByClient"));
    },

    setPath: function (item) {
        var itemId = item.productId;
        var level = item.level;
        var crumbToolbar = this.getView().byId("crumbToolbar");
        var content = crumbToolbar.getContent();
        var lv2 = sap.ui.getCore().byId("lv2Node");
        var lv1 = sap.ui.getCore().byId("lv1Node");
        switch (level) {
        case 1:
            if (!!lv1)
                lv1.destroy();
            crumbToolbar.addContent(new sap.m.Link({
                text: itemId,
                id: "lv1Node",
                class: "hierachyLink",
                press: [this.handleLinkPress, this]
            }));
            break;
        case "2":
            if (!!lv2)
                lv2.destroy();
            crumbToolbar.addContent(new sap.m.Link({
                text: itemId,
                id: "lv2Node",
                class: "hierachyLink",
                press: [this.handleLinkPress, this]
            }));
            break;
        default:
            return;
        }

    },

    handleLinkPress: function (evt) {
        var req = this._getOrgData();
        var id = evt.getParameters().id;
        var itemId = evt.getSource().getText();
        var crumbToolbar = this.getView().byId("crumbToolbar");
        var content = crumbToolbar.getContent();
        var lv2 = sap.ui.getCore().byId("lv2Node");
        var lv1 = sap.ui.getCore().byId("lv1Node");
        switch (id) {
        case "lv1Node":
            model.CatalogModel.getHierarchy(req)
                .then(_.bind(this.refreshList, this));
            if (content.length >= 2) {

                if (content[3]) {
                    if (!!lv2)
                        lv2.destroy();
                    crumbToolbar.removeContent(content[3]);
                }
                if (!!lv1)
                    lv1.destroy();
                crumbToolbar.removeContent(content[2]);
            }
            break;
        case "lv2Node":
            this.onHierarchyButtonPress();
            lv2.destroy();
            crumbToolbar.removeContent(content[3]);
            break;
        }

    },
    
    onOdataDirectSearch: function (evt) {

        var page = this.getView().byId("catalogHierarchyId");
        if (!this.odataFilterForIdDialog)
            this.odataFilterForIdDialog = sap.ui.xmlfragment("view.fragment.dialog.FilterOdataByProductId", this);
        page.addDependent(this.odataFilterForIdDialog);
        if(!!sap.ui.getCore().byId("odataProductIdInput").getValue()){
            sap.ui.getCore().byId("odataProductIdInput").setValue("");
        }
        this.odataFilterForIdDialog.openBy(evt.getSource());
    },
 
		handleCancelButtonOnOdataFilter: function (oEvent) {
			this.odataFilterForIdDialog.close();
		},
    
    handleOkButtonOnOdataFilter: function (oEvent) {
        var productId = sap.ui.getCore().byId("odataProductIdInput").getValue().trim();
        this.loadFilteredProducts(productId);
        this.odataFilterForIdDialog.close();
        this.uiModel.setProperty("/filtersApplied", true);
        var crumbToolbar = this.getView().byId("crumbToolbar");
        var content = crumbToolbar.getContent();
        var lv2 = sap.ui.getCore().byId("lv2Node");
        var lv1 = sap.ui.getCore().byId("lv1Node");

        if (content.length >= 2) {

            if (content[3]) {
                if (!!lv2)
                    lv2.destroy();
                crumbToolbar.removeContent(content[3]);
            }
            if (!!lv1)
                lv1.destroy();
            crumbToolbar.removeContent(content[2]);
        }
		},

    /*Advanced Filter*/
    onAdvancedFilterPress: function (evt) {

        var page = this.getView().byId("catalogHierarchyId");
        if (!this.advancedFilterDialog)
            this.advancedFilterDialog = sap.ui.xmlfragment("view.fragment.dialog.AdvancedFilter", this);
        page.addDependent(this.advancedFilterDialog);
        this.advancedFilterDialog.open();
    },

    onConfirmAdvancedFilterPress: function (evt) {
        if (this.advancedFilterDialog) {
            this.advancedFilterDialog.close();
        }
        
        this.applyDialogFilter();
    },

    onAdvancedFilterCloseButton: function (evt) {
        if (this.advancedFilterDialog) {
            this.advancedFilterDialog.close();
        }
    },

    applyDialogFilter: function () {
        this.odataFilters = [];

        if (this.filterOutModel.getProperty("/lastBoughtDate/en")) {


            if (this.filterOutModel.getData().lastBoughtDate.results.from !== "" && this.filterOutModel.getData().lastBoughtDate.results.to !== "") {
                var newDateFilter = new sap.ui.model.Filter({
                    path: "lastBoughtDate",
                    operator: "BT",
                    value1: this.filterOutModel.getData().lastBoughtDate.results.from,
                    value2: this.filterOutModel.getData().lastBoughtDate.results.to
                });

            }

            this.odataFilters.push(newDateFilter);

        }


        //        var userFilter = new sap.ui.model.Filter({
        //                                    path: "Uname",
        //                                    operator: "EQ",
        //                                    value1: this.user.username
        //                                  });
        //        this.odataFilters.push(userFilter);



        //////////////////*********************************************************////////////////////
        ////////////TODO fare la chiamata all'odata inserendo questi filtri///////////////////////////

        this.loadFilteredProducts();
        var eventBus = sap.ui.getCore().getEventBus();
        eventBus.subscribe("loadFilteredMasterList", "fireloadFilteredMasterList", this.loadFilteredProducts, this);


    },

    loadFilteredProducts: function (productId) {
        var req = this._getOrgData();
        
        if(!!productId){
            model.CatalogModel.loadFilteredProducts(productId, req)
            .then(function(result){
                if(!!result.items)
                if(Array.isArray(result.items) && result.items.length === 0){
                    sap.m.MessageToast.show(this._getLocaleText("noResultsFromFilter"));
                    this.getView().getModel("catalogModel").setData(result);
                }else{
                    this.getView().getModel("catalogModel").setData(result);
                }
            }.bind(this));
        }else{
            model.CatalogModel.loadFilteredProducts(this.odataFilters, req)
            .then(_.bind(this.refreshList, this));
        }
        this.uiModel.setProperty("/filtersApplied", true);
        var crumbToolbar = this.getView().byId("crumbToolbar");
        var content = crumbToolbar.getContent();
        var lv2 = sap.ui.getCore().byId("lv2Node");
        var lv1 = sap.ui.getCore().byId("lv1Node");

        if (content.length >= 2) {

            if (content[3]) {
                if (!!lv2)
                    lv2.destroy();
                crumbToolbar.removeContent(content[3]);
            }
            if (!!lv1)
                lv1.destroy();
            crumbToolbar.removeContent(content[2]);
        }
        
    },

    activateEnable: function (evt) {
        var src = evt.getSource();
        if (src.getExpanded()) {
            var idPanel = src.getId();
            var parameters = ["lastBoughtDate"];
            for (var i = 0; i < parameters.length; i++) {
                if (idPanel.indexOf(parameters[i]) > -1) {
                    var property = "/" + parameters[i] + "/en";
                    this.filterOutModel.setProperty(property, true);
                    this.filterOutModel.refresh();
                    break;
                }
            }
        }


    },
    /*Advanced Filter*/


    /**
     * Filtra il catalogo caricato localmente
     */
    onFilterCatalog: function () {
        this.catalogModel.setData(this.unfilteredCatalogHierarchy);
        var catalog = [];
        catalog = _.filter(this.catalogModel.getData().items,
            function (o) {
                return o.description.toUpperCase().indexOf(
                    this.uiModel.getProperty("/searchValue").toUpperCase()) > -1;
            }.bind(this));
        var c = {};
        c.items = catalog;
        this.catalogModel.setData(c);
        this.catalogModel.refresh();

    },

    /**
     * Effettua una ricerca clienti chiamando l'odata
     */
//    onOdataDirectSearch: function (evt) {
//        var src = evt.getSource();
//        //      var value = src.getValue();
//        this.catalogModel.setData(this.unfilteredCatalogHierarchy);
//        var catalog = [];
//        catalog = _.filter(this.catalogModel.getData().items,
//            function (o) {
//                return o.id.toUpperCase().indexOf(
//                    this.uiModel.getProperty("/searchValue").toUpperCase()) > -1;
//            }.bind(this));
//        var c = {};
//        c.items = catalog;
//        this.catalogModel.setData(c);
//        this.catalogModel.refresh();
//        // TODO
//    },

    onHierarchyButtonPress: function () {
        var currentLevelAndRoot = this.getCurrentLevelAndRoot();
        if (typeof currentLevelAndRoot !== "undefined" && currentLevelAndRoot.level > 2) {
            var previousLevel = (currentLevelAndRoot.level - 1).toString();
            if(!!this.lastParent)
            var previousParent = this.lastParent;
            var req = this._getOrgData();
            var salesOrg = req.Vkorg;
            model.CatalogModel.getProductsByLevel(previousLevel, previousParent, salesOrg)
                .then(_.bind(this.refreshList, this));
        } else {
//            var req = this.currentCustomer;
            model.CatalogModel.getHierarchy(req)
                .then(_.bind(this.refreshList, this));
            this.uiModel.setProperty("/hierarchyButtonVisible", false);
        }

    },

    onNavButtonBackPress: function () {
        var crumbToolbar = this.getView().byId("crumbToolbar");
        var content = crumbToolbar.getContent();
        var lv2 = sap.ui.getCore().byId("lv2Node");
        var lv1 = sap.ui.getCore().byId("lv1Node");

        if (content.length >= 2) {

            if (content[3]) {
                if (!!lv2)
                    lv2.destroy();
                crumbToolbar.removeContent(content[3]);
            }
            if (!!lv1)
                lv1.destroy();
            crumbToolbar.removeContent(content[2]);
        }
        this.router.navTo("launchpad");
    },

    onCartPress: function () {
        var crumbToolbar = this.getView().byId("crumbToolbar");
        var content = crumbToolbar.getContent();
        var lv2 = sap.ui.getCore().byId("lv2Node");
        var lv1 = sap.ui.getCore().byId("lv1Node");

        if (content.length >= 2) {

            if (content[3]) {
                if (!!lv2)
                    lv2.destroy();
                crumbToolbar.removeContent(content[3]);
            }
            if (!!lv1)
                lv1.destroy();
            crumbToolbar.removeContent(content[2]);
        }
        this.loadBusyIndicatorBeforeCart();
        setTimeout(function () {
            this.router.navTo("cart");
        }.bind(this), 3000)

    },

    getCurrentLevelAndRoot: function () {
        var firstProduct = this.getView().getModel("catalogModel").getData().items[0];
        var obj = {};
        if (!!firstProduct && firstProduct.level && firstProduct.parentId) {
            var level = parseInt(firstProduct.level);
            var parent = firstProduct.parentId;
            obj.level = level;
            obj.parent = parent;
            return obj;
        } else {
            return undefined;
        }

    },

    toOrderCreate: function () {
        this.router.navTo("orderCreate");
    },

});