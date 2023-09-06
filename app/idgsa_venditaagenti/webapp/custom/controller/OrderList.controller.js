jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.OrderModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("model.service.LocalStorageService");
jQuery.sap.require("model.BlockingOrderReasonModel");
jQuery.sap.require("model.filters.Filter");
jQuery.sap.require("sap.m.MessageBox");

controller.AbstractController.extend("controller.OrderList", {
    /**
     * @memberOf controller.OrderList
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.orderListModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.orderListModel, "orderListModel");
        this.blockOrderReasonModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.blockOrderReasonModel, "blockOrderReason");
        this.uiModel.setProperty("/searchProperty", ["orderId", "customerName"]);
    },

    handleRouteMatched: function (evt) {
        if (!this._checkRoute(evt, "orderList"))
            return;

        this.userLogged = model.service.LocalStorageService.session.get("userLogged");

        var fSuccess = function (result) {
            // guardo se in session storage ci sono degli ordini appena aggiunti che quindi vanno mostrati
            //** solo per i dati mock
            var orders = model.service.LocalStorageService.session.get("orders");
            if (orders) {
                for (var i = 0; i < orders.length; i++) {
                    orders[i].orderStatus = "Da confermare";
                    orders[i].blockCode = "99";
                    orders[i].selected = false;

                    // essendo finta la cosa, assegno la stessa
                    if (orders[i].requestedDate && (orders[i].requestedDate).indexOf("T") > 0) {
                        orders[i].requestedDate = new Date(orders[i].requestedDate);
                    }
                    var customer = model.service.LocalStorageService.session.get("currentCustomer");
                    if (customer) {
                        orders[i].customerId = customer.registry.customerId;
                        orders[i].customerName = customer.registry.customerName;
                    }
                    orders[i].shippmentDate = orders[i].requestedDate;
                    orders[i].validDateList = orders[i].requestedDate;
                    result.push(orders[i]);
                }
            }

            for (var i = 0; i < result.length; i++) {
                result[i].shippmentDate = new Date(result[i].shippmentDate);
                result[i].validDateList = new Date(result[i].validDateList);
                result[i].selected = false;
                if (!!result[i].orderStatus && result[i].orderStatus === "Bloccato") {
                    result[i].orderBlockButtonVisible = true;
                } else {
                    result[i].orderBlockButtonVisible = false;
                }
                if (!!result[i].trackingNr && result[i].trackingNr.trim().length > 0) {
                    result[i].shippmentAvailableButtonVisible = true;
                } else {
                    result[i].shippmentAvailableButtonVisible = false;
                }
            }
            //**


            this.unfilteredOrderList = result;
            this.orderListModel.setProperty("/results", result);
            this.getView().setBusy(false);
        };

        var fError = function (error) {
            this.getView().setBusy(false);
            sap.m.MessageBox.error(error, {
                title: this._getLocaleText("errorOrderListMessageBoxTitle")
            });
        };
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);

        if (this.userLogged) {
            controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
            this.getView().setBusy(true);
            //**
            var currentCustomer = this._getCurrentCustomer();
            var req = this._getOrgData();
            req.BukrsVf = req.Bukrs;
            delete req.Bukrs;
            if (!!currentCustomer) {
                req.Kunnr = currentCustomer.registry.customerId ? currentCustomer.registry.customerId : "";
            } else {
                req.Kunnr = "";
            }

            //**
            model.OrderModel.getOrderList(req)
                .then(fSuccess, fError);
        } else {
            this.router.navTo("login");
        }
    },

    onOrderPress: function (evt) {
        var src = evt.getSource();
        var selectedContext = src.getParent().getBindingContext("orderListModel").getObject();
        var orderStatus = selectedContext.orderStatus;
        var selectedOrderId = selectedContext.orderId;
        if (orderStatus === "Modificabile") {
            sap.m.MessageBox.confirm(
                this._getLocaleText("EditOrderMessage"), {
                    title: this._getLocaleText("EditOrderTitle"),
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === "YES") {
                            model.service.LocalStorageService.session.save("orderFromOrderList", selectedContext);
                            this.router.navTo("orderCreate");
                        } else {
                            this.router.navTo("orderDetail", {
                                'orderId': selectedOrderId
                            });
                        }
                    }.bind(this)
                });
        } else {
            this.router.navTo("orderDetail", {
                'orderId': selectedOrderId
            });


        }

    },

    onFilterOrderList: function () {
        this.orderListModel.setProperty("/results", this.unfilteredOrderList);
        var orderList = _.filter(this.orderListModel.getProperty("/results"), function (o) {
            return ((o.orderId.toString().indexOf(this.uiModel.getProperty("/searchValue")) > -1) || (o.customerName.toUpperCase().indexOf(this.uiModel.getProperty("/searchValue").toUpperCase()) > -1));
        }.bind(this));
        this.orderListModel.setProperty("/results", orderList);
        this.orderListModel.refresh();
    },

 handleLiveChange: function (oEvt) {
                var sQuery = oEvt.getParameter("query"),
                    aFilter = [new Filter("assistito", FilterOperator.Contains, sQuery),
                    new Filter("referente", FilterOperator.Contains, sQuery),
                    new Filter("eta", FilterOperator.Contains, sQuery),
                    new Filter("genere", FilterOperator.Contains, sQuery),
                    new Filter("indirizzo", FilterOperator.Contains, sQuery),
                    new Filter("cellulare", FilterOperator.Contains, sQuery),
                    new Filter("cap", FilterOperator.Contains, sQuery),
                    new Filter("città", FilterOperator.Contains, sQuery),
                    new Filter("provincia", FilterOperator.Contains, sQuery),
                    new Filter("email", FilterOperator.Contains, sQuery),
                    ],
                    oTable = this.byId("table1"),
                    oBinding = oTable.getBinding("rows"),
                    oFilter = null;
                if (sQuery.length != 0) {
                    oFilter = new Filter({
                        filters: aFilter,
                        and: false
                    });
                }
                oBinding.filter(oFilter);
            },

    //  onTrackingPress: function(evt){
    //      sap.m.URLHelper.redirect("http://as777.brt.it/vas/sped_numspe_par.htm?lang=it", true);
    //  },

    onLinkToPdfPress: function (evt) {
        sap.m.URLHelper.redirect("https://drive.google.com/file/d/0Bx1Hy4k97vZPWHNQbkxVMmNqUVE/view", true);
    },


    showOrderBlockReasons: function (evt) {
        var src = evt.getSource();
        var selectedItem = src.getBindingContext("orderListModel").getObject();
        var idOrder = selectedItem.orderId;
        if (!this.blockingReasonsDialog)
            this.blockingReasonsDialog = sap.ui.xmlfragment("view.fragment.dialog.ShowBlockReasons", this);
        var page = this.getView().byId("orderListModelPageId");
        page.addDependent(this.blockingReasonsDialog);
        this.getView().setBusy(true);
        model.BlockingOrderReasonModel
            .loadBlockingOrderReasons(idOrder)
            .then(_.bind(
                function (res) {
                    // console.log(res);
                    this.blockOrderReasonModel.setData(res);
                    this.getView().setBusy(false);
                    this.blockingReasonsDialog.open();
                }, this));

        $(document).keyup(_.bind(this.keyUpFunc, this));
    },


    keyUpFunc: function (e) {
        if (e.keyCode == 27) {
            // codice per il pulsante escape per evitare che lo
            // user chiuda il dialog via ESC

            if (this.blockingReasonsDialog) {
                this.blockingReasonsDialog.close();
            }
            $(document).off("keyup");
            // this.router.navTo("launchpad");
        }
    },

    onBlockReasonsDialogOk: function (evt) {
        if (this.blockingReasonsDialog) {
            this.blockingReasonsDialog.close();
        }

    },

    /***************handle complex Filter*******************/

    onFilterPress: function () {
        this.filterModel = model.filters.Filter.getModel(
            this.orderListModel.getData().results,
            "orders");
        this.getView().setModel(this.filterModel, "filter");
        var page = this.getView().byId("orderListModelPageId");
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
            .getSelectedItems("orders");
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
        var table = this.getView().byId("orderListModelTable");
        var binding = table.getBinding("items");
        binding.filter(filters);
    },
    onResetFilterPress: function () {
        this.uiModel.setProperty("/rangeVisible", false);
        model.filters.Filter.resetFilter("orders");
        if (this.elementListFragment) {
            this.elementListFragment.destroy();
        }
        if (this.filterDialog) {
            this.filterDialog.close();
            this.filterDialog.destroy();
        }
        var table = this.getView().byId("orderListModelTable");
        var binding = table.getBinding("items");
        binding.filter();

    },

    /***************handle complex Filter*******************/

    onNavBackPress: function () {
        this.router.navTo("launchpad");
    }
});