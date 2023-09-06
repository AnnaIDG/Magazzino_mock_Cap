jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.PackingModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("model.service.LocalStorageService");
jQuery.sap.require("model.filters.Filter");
jQuery.sap.require("sap.m.MessageBox");
controller.AbstractController.extend("controller.PackingList", {
    /**
     * @memberOf controller.PackingList
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.packingListModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.packingListModel, "packingListModel");
        this.blockOrderReasonModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.blockOrderReasonModel, "blockOrderReason");
        this.uiModel.setProperty("/searchProperty", ["packingId", "customerName"]);
        this.billsModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.billsModel, "bills");
    },
    handleRouteMatched: function (evt) {
        if (!this._checkRoute(evt, "packingList")) return;
        this._removeStyleClassOfilter();
        this.userLogged = model.service.LocalStorageService.session.get("userLogged");
        this.uiModel.setProperty("/rangeVisible", false);
        this.uiModel.setProperty("/searchValue", "");
        model.CurrentModel.removeOrder();
        this.packingListModel.setProperty("/results", []);
        var fSuccess = function (result) {
            
            this.unfilteredPackingList = result;
            this.packingListModel.setProperty("/results", result);
            this.onResetFilterPress();
            this.getView().setBusy(false);
        };
        var fError = function () {
            this.getView().setBusy(false);
            var that = this;
            sap.m.MessageBox.alert(this._getLocaleText("packingListErr"), {
                onClose: _.bind(function () {
                    this.onNavBackPress()
                }, that)
            });
        }
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
            if (this.userLogged[0].agentCode) {
                req.Cdage = this.userLogged[0].agentCode;
            } else {
                req.Cdage = "";
            }
            if (!!currentCustomer) {
                if (currentCustomer.registry) {
                    req.Kunnr = currentCustomer.registry.customerId ? currentCustomer.registry.customerId : "";
                } else {
                    req.Kunnr = currentCustomer.customerId ? currentCustomer.customerId : "";
                }
            } else {
                req.Kunnr = "";
            }
            //**
            model.PackingModel.getPackingList(req).then(fSuccess, fError);
        } else {
            this.router.navTo("login");
        }
    },
    onOrderPress: function (evt) {
        var src = evt.getSource();
        var selectedContext = src.getParent().getBindingContext("packingListModel").getObject();
        this.router.navTo("orderDetail", {
                'packingId': selectedContext.packingId
            });
    },
    onFilterPackingList: function () {
        this.packingListModel.setProperty("/results", this.unfilteredPackingList);
        var packingList = _.filter(this.packingListModel.getProperty("/results"), function (o) {
            return ((o.packingId.toString().indexOf(this.uiModel.getProperty("/searchValue")) > -1) || (o.customerName.toUpperCase().indexOf(this.uiModel.getProperty("/searchValue").toUpperCase()) > -1));
        }.bind(this));
        this.packingListModel.setProperty("/results", packingList);
        this.packingListModel.refresh();
    },
    onTrackingPress: function (evt) {
        var src = evt.getSource();
        var selectedItem = src.getBindingContext("packingListModel").getObject();
        var idOrder = selectedItem.packingId;
        if (!this.DeliveryPopover) this.DeliveryPopover = sap.ui.xmlfragment("view.fragment.dialog.DeliveryPopover", this);
        var page = this.getView().byId("packingListModelPageId");
        page.addDependent(this.DeliveryPopover);
        //***********************************************************************************   
        var openDialog = function () {
            this.DeliveryPopover.openBy(src);
        };
        openDialog = _.bind(openDialog, this);
        this.loadDelivery(idOrder, "J").then(openDialog);
    }, //    onLinkToPdfPress: function (evt) {
    //        sap.m.URLHelper.redirect("https://drive.google.com/file/d/0Bx1Hy4k97vZPWHNQbkxVMmNqUVE/view", true);
    //    },
    showOrderBlockReasons: function (evt) {
        var src = evt.getSource();
        var selectedItem = src.getBindingContext("packingListModel").getObject();
        var idOrder = selectedItem.packingId;
        if (!this.blockingReasonsDialog) this.blockingReasonsDialog = sap.ui.xmlfragment("view.fragment.dialog.ShowBlockReasons", this);
        var page = this.getView().byId("packingListModelPageId");
        page.addDependent(this.blockingReasonsDialog);
        this.getView().setBusy(true);
        model.BlockingOrderReasonModel.loadBlockingOrderReasons(idOrder).then(_.bind(function (res) {
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
                if (this.blockingReasonsDialog.isOpen()) {
                    this.blockingReasonsDialog.close();
                }
            }
            $(document).off("keyup");
            // this.router.navTo("launchpad");
        }
    },
    onBlockReasonsDialogOk: function (evt) {
        if (this.blockingReasonsDialog) {
            if (this.blockingReasonsDialog.isOpen()) {
                this.blockingReasonsDialog.close();
            }
        }
    }, //},
      
    /***************handle complex Filter*******************/
    onFilterPress: function () {
        if (this._checkCustomerSession()) {
            this.filterModel = model.filters.Filter.getModel(this.packingListModel.getData().results, "packingListInSession");
        } else {
            this.filterModel = model.filters.Filter.getModel(this.packingListModel.getData().results, "packingList");
        }
        this.getView().setModel(this.filterModel, "filter");
        var page = this.getView().byId("packingListModelPageId");
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
            if (this.filterDialog.isOpen()) {
                this.filterDialog.close();
            }
            this.filterDialog.destroy();
        }
    },
    onFilterDialogOK: function (evt) {
        if (this._checkCustomerSession()) {
            var filterItems = model.filters.Filter.getSelectedItems("packingListInSession");
        } else {
            var filterItems = model.filters.Filter.getSelectedItems("packingList");
        }
        if (this.elementListFragment) this.elementListFragment.destroy();
        this.filterDialog.close();
        this.getView().getModel("filter").setProperty("/selected", "");
        this.handleFilterConfirm(filterItems);
        this.filterDialog.destroy();
        delete(this.filterDialog);
        if (filterItems.length > 0) {
            this.getView().byId("filterButton").addStyleClass("filterButton");
        }else {
            this.getView().byId("filterButton").removeStyleClass("filterButton");
        }
        
       
    },
    handleFilterConfirm: function (selectedItems) {
        var filters = [];
        _.forEach(selectedItems, _.bind(function (item) {
            filters.push(this.createFilter(item.value, item.property));
        }, this));
        var table = this.getView().byId("packingListModelTable");
        var binding = table.getBinding("items");
        binding.filter(filters);
    },
    onResetFilterPress: function () {
        this._removeStyleClassOfilter();
        this.uiModel.setProperty("/rangeVisible", false);
        if (this._checkCustomerSession()) {
            model.filters.Filter.resetFilter("packingListInSession");
        } else {
            model.filters.Filter.resetFilter("packingList");
        }
        if (this.elementListFragment) {
            this.elementListFragment.destroy();
        }
        if (this.filterDialog) {
            if (this.filterDialog.isOpen()) {
                this.filterDialog.close();
            }
            this.filterDialog.destroy();
        }
        var table = this.getView().byId("packingListModelTable");
        var binding = table.getBinding("items");
        binding.filter();
    },
    /***************handle complex Filter*******************/
    onNavBackPress: function () {
        this.router.navTo("launchpad");
    },
    onLinkToPdfPress: function (evt) {
        var packingId = evt.getSource().getBindingContext("packingListModel").getObject().packingId;
        var elementId = "#" + evt.getSource().getId();
        utils.Busy.show(this._getLocaleText("disablePopupBlocker"));
        var f = function () {
            model.PackingModel.printOdV(packingId, false)
                .then(_.bind(function (res) {
                        utils.Busy.hide();
                        window.open(res)
                    }, this),
                    _.bind(function (err) {
                        utils.Busy.hide();
                        $(elementId).notify(
                            err, {
                                position: 'left bottom',
                                autoHideDelay: 5000,
                                className: 'error'
                            }
                        );
                    }, this))
        };
        setTimeout(_.bind(f, this), 500);
    },


    loadDelivery: function (id, type) {
        var defer = Q.defer();
        this.getView().setBusy(true);
        var fSuccess = function (result) {
            this.getView().setBusy(false);
            this.billsModel.setData(result);
            defer.resolve();
        };
        var fError = function (err) {
            this.getView().setBusy(false);
            this.errorMessage = this.errorMessage + "\n" + err;
            this.orderDetailModel.setProperty("/bills", {});
            defer.reject(err);
            console.log(err);
        };
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.PackingModel.getDelivery(id, type).then(fSuccess, fError);
        return defer.promise;
    },
    onFilterOnDatePress: function (evt) {
        if (!this.odataFilterDialog) {
            this.odataFilterDialog = sap.ui.xmlfragment("view.fragment.dialog.OdataOrderListFilterDialog", this);
        }
        var page = this.getView().byId("packingListModelPageId");
        page.addDependent(this.odataFilterDialog);
        if (!this.filterODataModel) {
            this.resetODataFilter();
        }
        this.odataFilterDialog.open();
    },
    onRemoveODataFilter: function (evt) {
        this.uiModel.setProperty("/rangeVisible", false);
        this.odataFilterDialog.close();
        this.filterData = {
            "fromDate": new Date(),
            "toDate": new Date()
        };
        this.getView().getModel("fo").setData(this.filterData);
        //**
        this.uiModel.setProperty("/toDate", "");
        this.uiModel.setProperty("/fromDate", "");
        //**
        this.odataFilterDialog.close();
        var reqData = this._getOrgData();
        delete reqData.IAudat1;
        delete reqData.IAudat2;
        //utils.Busy.show();
        var userLogged = this._getUserLogged();
            if (userLogged) {
                var agentCode = userLogged[0].agentCode;
                if (agentCode !== "") {
                    reqData.Cdage = agentCode;
                }
            }
            var currentCustomer = this._getCurrentCustomer();
            if (currentCustomer) {
                reqData.Kunnr = currentCustomer.registry.customerId ? currentCustomer.registry.customerId : undefined;
            }
        
        
        this.getView().setBusy(true);
        model.PackingModel.getPackingList(reqData) // forceReload
            .then(_.bind(function (res) {
                // console.log(res);
                this.getView().setBusy(false);
                //this.setButtonVisible(res);
                this.packingListModel.setProperty("/results", res);
                this.packingListModel.refresh(true);
            }, this), _.bind(function (e) {
                this.getView().setBusy(false);
            }, this));
    },
    onODataFilterCancelPress: function (evt) {
        this.odataFilterDialog.close();
    },
    resetODataFilter: function (evt) {
        if (!this.filterODataModel) {
            this.filterODataModel = new sap.ui.model.json.JSONModel();
        }
        this.filterData = {
            "fromDate": new Date(),
            "toDate": new Date()
        };
        this.filterODataModel.setData(this.filterData);
        this.getView().setModel(this.filterODataModel, "fo");
        this.filterODataModel.refresh();
    },
    onODataFilterOKPress: function (evt) {
        this.odataFilterDialog.close();
        //utils.Busy.show();
        // delete(this.filterData.items);
        var reqData = this._getOrgData();
        reqData.BukrsVf = _.clone(reqData.Bukrs);
        delete reqData.Bukrs;
        this.obblData = reqData;
        //var reqData = {};
        for (var prop in this.filterData) {
            if (this.filterData[prop]) {
                reqData[prop] = this.filterData[prop]
            }
        }
        if(reqData.fromDate)
        {
            reqData.fromDate.setHours((new Date(Date.now())).getHours());
            reqData.toDate.setHours((new Date(Date.now())).getHours());
        }
        if (_.isEmpty(reqData)) {
            reqData = this.reqData;
        } else {
            for (var prop in this.obblData) {
                reqData[prop] = this.obblData[prop];
            }
        }
        
        var userLogged = this._getUserLogged();
            if (userLogged) {
                var agentCode = userLogged[0].agentCode;
                if (agentCode !== "") {
                    reqData.Cdage = agentCode;
                }
            }
            var currentCustomer = this._getCurrentCustomer();
            if (currentCustomer) {
                reqData.Kunnr = currentCustomer.registry.customerId ? currentCustomer.registry.customerId : undefined;
            }
        
        
        
        this.getView().setBusy(true);
        model.PackingModel.getPackingList(reqData) // forceReload
            .then(_.bind(function (res) {
                this.packingListModel.setProperty("/results", res);
                this.packingListModel.refresh(true);
                this.uiModel.setProperty("/fromDate", (new Date(reqData.IAudat1)).toLocaleDateString());
                this.uiModel.setProperty("/toDate", (new Date(reqData.IAudat2)).toLocaleDateString());
                this.uiModel.setProperty("/rangeVisible", true);
                this.getView().setBusy(false);
            }, this), _.bind(function (e) {
                sap.m.MessageToast.show(utils.Message.getError(e));
                this.getView().setBusy(false);
            }, this));
    },
    onAfterCloseDialogDataFilter: function () {
        if (this.uiModel.getProperty("/toDate") && this.uiModel.getProperty("/toDate") !== "") {
            this.uiModel.setProperty("/rangeVisible", true);
        } else {
            this.uiModel.setProperty("/rangeVisible", false);
        }
    },
    onSearchOrderByVbeln: function (evt) {
        var packingId = evt.getSource().getValue();
        var req = this._getOrgData();
        if (req) {
            req.BukrsVf = req.Bukrs;
            delete req.Bukrs;
            var userLogged = this._getUserLogged();
            if (userLogged) {
                var agentCode = userLogged[0].agentCode;
                if (agentCode !== "") {
                    req.Cdage = agentCode;
                }
            }
            var currentCustomer = this._getCurrentCustomer();
            if (currentCustomer) {
                req.Kunnr = currentCustomer.registry.customerId ? currentCustomer.registry.customerId : undefined;
            }
            req.Vbeln = this.uiModel.getProperty("/searchValue");
        }
        else {
            //se req è undefined, siamo nel caso di agente che visualizza i suoi ordini, senza selezionare un cliente e quindi una orgs
            req = {
                "Cdage": this._getUserLogged()[0].agentCode
            };
        }

        var fSuccess = function (result) {
            this.getView().setBusy(false);
            //this.setButtonVisible(result);
            this.packingListModel.setProperty("/results", result);
            this.packingListModel.refresh(true);
        }
        var fError = function (err) {
            this.getView().setBusy(false);
            sap.m.MessageBox.err(utils.Message.getError(err));
        }
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        this.getView().setBusy(true);
        model.PackingModel.getOrderByVbeln(req).then(fSuccess, fError);
    },
    
});