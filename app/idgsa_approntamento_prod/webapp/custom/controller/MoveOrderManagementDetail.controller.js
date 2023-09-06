jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.MoveOrderModel");
controller.AbstractController.extend("controller.MoveOrderManagementDetail", {
    /**
     * @memberOf controller.MoveOrderManagementDetail
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.moveOrderDetailModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.moveOrderDetailModel, "moveOrderDetailModel");

        this.moveOrderDetailModelSelect = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.moveOrderDetailModelSelect, "moveOrderDetailModelSelect");
        this.boxListModel = new sap.ui.model.json.JSONModel();
        this.boxListModel.setData(model.MoveOrderModel.getBoxList());
        this.getView().setModel(this.boxListModel, "boxListModel");

    },
    handleRouteMatched: function (evt) {
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        this.resetView();
        if (!this._checkRoute(evt, "moveOrderManagementDetailFromLaunchpad")) {
            if (!this._checkRoute(evt, "moveOrderManagementDetail")) return;
        }
        this.moveOrderId = evt.getParameter("arguments").moveOrderId;
        if (this.moveOrderId) {

//            this.adaptUiModel();
            this.populateSelect();

            this.org = model.service.LocalStorageService.session.get("selectedOrganization");
            this.user = model.service.LocalStorageService.session.get("userLogged");
            this.getView().setBusy(true);
            model.MoveOrderModel.getMoveOrderDetail(this.moveOrderId).then(function (result) {
                if (result) {
                    this.moveOrderDetailModel.setData(result);
                    this.checkChangeStautsEnable(this.moveOrderDetailModel.getData());
                    this.getView().setBusy(false);
                    
                    
                    
                    /* in via provvisoria perche non ho capito come funziona */
                    if (!result.worksCenter) {
                        this.getView().byId("idComboBoxWorksCenter").setForceSelection(false);
                        this.getView().byId("idComboBoxWorksCenter").setSelectedKey();
                    }

                } else {
                    this.moveOrderDetailModel.setProperty("/moveOrder", {});
                }
                
                
                /* funzione spostata perche chiamata in due controller;
                    se continua a non funzionare consiglio di farla partire con un po di ritardo */
                this.adaptUiModel();
            }.bind(this), function () {
                this.getView().setBusy(false);
                var that = this;
                this.moveOrderDetailModel.setData({});
                sap.m.MessageBox.alert(this._getLocaleText("moveOrderDefultErr"), {
                    onClose: _.bind(function () {
                        this.onNavBackPress()
                    }, that)
                });
            }.bind(this));
        }
    },

    onNavBackPress: function () {
        this.router.navTo("launchpad");
    },



    populateOdataSelect: function () {
        var pToSelArr = [

            {
                "type": "OrderReason",
                "params": {},
                "orderProperty": "orderReason"
		    },
            {
                "type": "Plant",
                "params": {
                    "Vkorg": this._getOrgData().Vkorg
                },
                "orderProperty": "plant"
            }
		];
        _.map(pToSelArr, _.bind(function (item) {
            utils.Collections.getOdataSelect(item.type, item.params).then(_.bind(function (result) {
                var blankItem = {
                    id: "",
                    name: ""
                };
                var propertyName = item.type.substring(0, 1).toLowerCase() + item.type.substring(1);

                this.moveOrderDetailModelSelect.setProperty("/" + propertyName, result.results);
                this.initializeComboBoxToFirstValue(propertyName);

            }, this));
        }, this));
        utils.Busy.hide();
    },

    populateSelect: function () {
        this.getPlants();
    },

    getPlants: function () {
        var fSuccess = function (res) {
            this.moveOrderDetailModelSelect.setProperty("/sites", res.items)
        }
        var fError = function (err) {
            sap.m.MessageToast.show("Errore caricamento Ubicazioni ");
        }
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.MoveOrderModel.getPlants().then(fSuccess, fError);
    },

    getWorksCenter: function (plant) {
        var fSuccess = function (res) {
            this.moveOrderDetailModelSelect.setProperty("/worksCenter", res)
        }
        var fError = function (err) {
            sap.m.MessageToast.show("Errore caricamento Ubicazioni ");
        }
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.MoveOrderModel.getWorksCenter(plant).then(fSuccess, fError);
    },

    onPlantChange: function (evt) {
        this.uiModel.setProperty("/plantsSelected", true);
        var plant = this.moveOrderDetailModel.getProperty("/site");
        this.checkChangeStautsEnable(this.moveOrderDetailModel.getData());
        this.getWorksCenter(plant);
        
        
        /* in via provvisoria perche non ho capito come funziona */
        this.getView().byId("idComboBoxWorksCenter").setForceSelection(true);

    },

    resetView: function () {
        this.uiModel.setProperty("/backButtonVisible", false);
        this.uiModel.setProperty("/panelExpanded", false);
        this.uiModel.setProperty("/plantsSelected", false);
        this.mymodel.setProperty("/moveOrderManagementDetailVisible", false);
    },
    adaptUiModel: function () {
        this.mymodel.setProperty("/moveOrderManagementDetailVisible", true);
        this.uiModel.setProperty("/moveOrderLists", true);
        this.uiModel.setProperty("/panelExpanded", true);
    },

    // gestione dialog vari
    onPrintLabelPress: function () {
        var page = this.getView().byId("moveOrderManagementDetailPageId");
        if (!this.printLabelDialog) {
            this.printLabelDialog = sap.ui.xmlfragment("view.fragment.dialog.PrintLabelDialog", this);

        }
        page.addDependent(this.printLabelDialog);
        this.printLabelDialog.open();

    },

    onConfirmPrintLabelPress: function () {
        if (this.printLabelDialog && this.printLabelDialog.isOpen()) {
            this.printLabelDialog.close();
        }
        //model.service.LocalStorageService.session.save("labelPrinted", true);
        model.CurrentModel.setPrinted(this.moveOrderDetailModel.getData().moveOrderId, "label");
        this.checkChangeStautsEnable(this.moveOrderDetailModel.getData());
        utils.Busy.show("Stampa in corso..");
        setTimeout(_.bind(this.printedMessage, this), 2000);
    },

    printedMessage: function () {
        utils.Busy.hide();
        this._showSuccess(undefined, "Stampa effettuata!");
    },

    onCancelPrintLabelPress: function () {
        if (this.printLabelDialog && this.printLabelDialog.isOpen()) {
            this.printLabelDialog.close();
        }
    },


    onPrintListPress: function () {
        var page = this.getView().byId("moveOrderManagementDetailPageId");
        if (!this.printListDialog) {
            this.printListDialog = sap.ui.xmlfragment("view.fragment.dialog.PrintListDialog", this);

        }
        page.addDependent(this.printListDialog);
        this.printListDialog.open();

    },

    onConfirmPrintListPress: function () {
        if (this.printListDialog && this.printListDialog.isOpen()) {
            this.printListDialog.close();
        }
        //        model.service.LocalStorageService.session.save("labelPrinted", true);
        model.CurrentModel.setPrinted(this.moveOrderDetailModel.getData().moveOrderId, "list");
        this.checkChangeStautsEnable(this.moveOrderDetailModel.getData());
        utils.Busy.show("Stampa in corso..");
        setTimeout(_.bind(this.printedMessage, this), 2000);
    },



    onCancelPrintListPress: function () {
        if (this.printListDialog && this.printListDialog.isOpen()) {
            this.printListDialog.close();
        }
    },


    onAddBoxPress: function () {
        var page = this.getView().byId("moveOrderManagementDetailPageId");

        if (!this.addBoxDialog) {
            this.addBoxDialog = sap.ui.xmlfragment("view.fragment.dialog.AddBoxDialog", this);

        }
        page.addDependent(this.addBoxDialog);
        this.addBoxDialog.open();

    },

    onConfirmAddBoxPress: function (evt) {
        if (this.addBoxDialog && this.addBoxDialog.isOpen()) {
            this.addBoxDialog.close();
        }
        var selectedBox = _.find(this.getView().getModel("boxListModel").getData().results, {
            selected: true
        });
        selectedBox = evt.getSource().getParent().getContent()[0].getSelectedItem().getBindingContext("boxListModel").getObject();
        this.moveOrderDetailModel.setProperty("/boxSelected", selectedBox.name);
        model.service.LocalStorageService.session.save("selectedBox", selectedBox);


    },



    onCancelAddBoxPress: function () {
        if (this.addBoxDialog && this.addBoxDialog.isOpen()) {
            this.addBoxDialog.close();
        }
    },

    onIconPress: function (evt) {
        var item = evt.getSource().getBindingContext("moveOrderDetailModel").getObject();
        if (item.picked === "false") {
            item.picked = "true"

        } else {
            item.picked = "false"

        }
        this.moveOrderDetailModel.refresh();
    },

    checkChangeStautsEnable: function (order) {
        if (order.plant && order.worksCenter) {
            var labelPrinted = model.CurrentModel.getPrinted(order.moveOrderId, "label");
            var listPrinted = model.CurrentModel.getPrinted(order.moveOrderId, "list");
            if (labelPrinted && listPrinted) {
                this.uiModel.setProperty("/changeStatusEnabled", true);
                return true;
            }
        }
        this.uiModel.setProperty("/changeStatusEnabled", false);
        return false;
    },

    onChangeStatus: function () {
        this._showSuccess(this.getView().byId("orderManagementFooter").getId(), this._getLocaleText("orderInWork"));
    },

    onsavePress: function () {
        var order = this.moveOrderDetailModel.getData();
        model.CurrentModel.removePrinted(order.moveOrderId, "label");
        model.CurrentModel.removePrinted(order.moveOrderId, "list");
        utils.Busy.show(this._getLocaleText("savingOrder"));

        setTimeout(utils.Busy.hide, 500);
        this._showSuccess(undefined, this._getLocaleText("orderSaved"));
        setTimeout(_.bind(this.successNavTo, this), 1000);



    },

    successNavTo: function () {

        this.router.navTo("moveOrderManagement");
    }

});
