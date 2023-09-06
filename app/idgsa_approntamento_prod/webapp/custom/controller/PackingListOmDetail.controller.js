jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.MoveOrderModel");
controller.AbstractController.extend("controller.PackingListOmDetail", {
    /**
     * @memberOf controller.PackingListOmDetail
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.packingListOmDetailModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.packingListOmDetailModel, "packingListOmDetailModel");

        this.packingListOmDetailModelSelect = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.packingListOmDetailModelSelect, "packingListOmDetailModelSelect");
        this.boxListModel = new sap.ui.model.json.JSONModel();
        this.boxListModel.setData(model.MoveOrderModel.getBoxList());
        this.getView().setModel(this.boxListModel, "boxListModel");

    },
    handleRouteMatched: function (evt) {
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        this.resetView();

        if (!this._checkRoute(evt, "packingListOmDetail")) return;

        this.moveOrderId = evt.getParameter("arguments").packingListId;
        if (this.moveOrderId) {

//            this.adaptUiModel();
            this.populateSelect();

            this.org = model.service.LocalStorageService.session.get("selectedOrganization");
            this.user = model.service.LocalStorageService.session.get("userLogged");
            this.getView().setBusy(true);
            model.PackingModel.getPackingDetail(this.moveOrderId).then(function (result) {
                if (result) {
                    this.packingListOmDetailModel.setData(result);
                    this.checkCreateEnable(result);
                    this.getView().setBusy(false);

                } else {
                    this.packingListOmDetailModel.setProperty("/moveOrder", {});
                }
                
                /* funzione spostata perche chiamata in due controller;
                    se continua a non funzionare consiglio di farla partire con un po di ritardo */
                this.adaptUiModel();
            }.bind(this), function () {
                this.getView().setBusy(false);
                var that = this;
                this.packingListOmDetailModel.setData({});
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
                "type": "Sites",
                "params": {
                    "Vkorg": this._getOrgData().Vkorg
                },
                "orderProperty": "site"
            }
		];
        _.map(pToSelArr, _.bind(function (item) {
            utils.Collections.getOdataSelect(item.type, item.params).then(_.bind(function (result) {
                var blankItem = {
                    id: "",
                    name: ""
                };
                var propertyName = item.type.substring(0, 1).toLowerCase() + item.type.substring(1);

                this.packingListOmDetailModelSelect.setProperty("/" + propertyName, result.results);
                this.initializeComboBoxToFirstValue(propertyName);

            }, this));
        }, this));
        utils.Busy.hide();
    },

    populateSelect: function () {
        this.getSites();
    },

    getSites: function () {
        var fSuccess = function (res) {
            this.packingListOmDetailModelSelect.setProperty("/plants", res.items)
        }
        var fError = function (err) {
            sap.m.MessageToast.show("Errore caricamento Ubicazioni ");
        }
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.MoveOrderModel.getSites().then(fSuccess, fError);
    },



    onPlantChange: function (evt) {
        this.uiModel.setProperty("/plantsSelected", true);
        var plant = this.packingListOmDetailModel.getProperty("/plant");
        var s = evt.getSource();
        var item = s.getParent().getBindingContext("packingListOmDetailModel").getObject();
        item.savePressed = "";
        this.packingListOmDetailModel.refresh();
        //        this.checkChangeStautsEnable(this.packingListOmDetailModel.getData());

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




    successNavTo: function () {

        this.router.navTo("moveOrderManagement");
    },

    onSaveListPress: function (evt) {

        var s = evt.getSource();
        this._showSuccess(s.getId(), this._getLocaleText("saved"));
        var item = s.getParent().getBindingContext("packingListOmDetailModel").getObject();
        item.savePressed = "X";
        this.packingListOmDetailModel.refresh();
        this.checkCreateEnable(this.packingListOmDetailModel.getData());

    },

    onCreateOrder: function () {
        var order = this.packingListOmDetailModel.getData();

        utils.Busy.show(this._getLocaleText("savingOrder"));

        setTimeout(utils.Busy.hide, 500);
        this._showSuccess(undefined, this._getLocaleText("orderCreated"));
        setTimeout(_.bind(this.successNavTo, this), 1000);



    },

    successNavTo: function () {
        this.router.navTo("packingListOm");
    },

    checkCreateEnable: function (order) {
        if (order.hasBox) {
            var list = order.packingList.results;
            var res = _.filter(list, {
                savePressed: ''
            });
            var resPlant = _.filter(list, {
                plant: ''
            });
            if ((res && res.length > 0) || (resPlant && resPlant.length>0)) {
                this.uiModel.setProperty("/checkCreateEnable", false);
                return false;
            } else {
                this.uiModel.setProperty("/checkCreateEnable", true);
                return true;
            }

        }

        this.uiModel.setProperty("/checkCreateEnable", false);
        return false;
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
        this.packingListOmDetailModel.setProperty("/boxSelected", selectedBox.name);
        model.service.LocalStorageService.session.save("selectedBox", selectedBox);
    },
    
    onCancelAddBoxPress: function () {
        if (this.addBoxDialog && this.addBoxDialog.isOpen()) {
            this.addBoxDialog.close();
        }
    },
});
