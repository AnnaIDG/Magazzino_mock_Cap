jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.WorkingOrdersModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("model.service.LocalStorageService");
jQuery.sap.require("model.filters.Filter");
jQuery.sap.require("sap.m.MessageBox");

controller.AbstractController.extend("controller.WorkingOrdersDetail", {
    /**
     * @memberOf controller.WorkingOrdersDetail
     */

    // onAfterRendering: function(){
    //     var oSortableList = this.getView().byId("workingOrdersTable");
    //     oSortableList.addEventDelegate({
    //         onAfterRendering: function () {
    //             console.log("custom handler called");
    //
    //         }.bind(this)
    //     }, this);
    // },

    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.workingOrderDetailModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.workingOrderDetailModel, "workingOrderDetailModel");
        this.statusModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.statusModel, "statusModel");
        this.uiModel.setProperty("/searchProperty", ["siteName"]);
    },

    handleRouteMatched: function (evt) {
        if (!this._checkRoute(evt, "workingOrdersDetail"))
            return;

        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);

        // this.userLogged = this._getUserLogged();
        this.workingOrderDetailModel.setData({results: []});
        this.selectedWorkingOrder = model.service.LocalStorageService.session.get("selectedWorkingOrder");
        this.setInitialPage();

        // this.loadStates();
        if(this._getLoggedUserType()){
            if(this._getLoggedUserType() === 'OP'){
                this.uiModel.setProperty("/loggedUserType", "OP");
            }else if(this._getLoggedUserType() === 'PM'){
                this.uiModel.setProperty("/loggedUserType", "PM");
            }
        }
        this.setPageMode();
    },

    setPageMode: function(){
        this.uiModel.setProperty("/currentWorkingOrderState", this._getLocaleText("currentState")+" : Allestimento");
        this.uiModel.setProperty("/controlledMode", false);
        var currentStateText = this.getView().byId("currentStateText");
        var button = this.getView().byId("changeStateButton");
        try{
            currentStateText.removeStyleClass("currentWorkingOrderStateReadyToClose");
            currentStateText.removeStyleClass("currentWorkingOrderStateControlled");
            currentStateText.removeStyleClass("currentWorkingOrderStateUnderControl");
            currentStateText.addStyleClass("currentWorkingOrderStatePicking");
            button.setEnabled(true);

            if(this.selectedWorkingOrder)
            if(this.selectedWorkingOrder.orderStatus === "04"){
                this.uiModel.setProperty("/currentWorkingOrderState", this._getLocaleText("currentState")+" : Verificato");
                this.uiModel.setProperty("/controlledMode", true);
                currentStateText.removeStyleClass("currentWorkingOrderStatePicking");
                currentStateText.addStyleClass("currentWorkingOrderStateControlled");
            }
        }catch(err){
            console.log(err);
        }

    },

    setInitialPage: function () {
        var fSuccess = function (res) {
            var results = [];
            if (Array.isArray(res) && res.length > 0) {
                results = res;
            } else if (res.hasOwnProperty("results") && res.results) {
                results = res.results;
            }
            if(results.length > 0) {
                if (this.selectedWorkingOrder && this.selectedWorkingOrder.orderStatus === "04") {
                    results.forEach(function(obj){
                        obj.checked = true;
                    });
                }
            }
            this.workingOrderDetailModel.setSizeLimit(results.length);
            this.workingOrderDetailModel.setProperty("/results", results);
            sap.ui.core.BusyIndicator.hide();
        }.bind(this);
        var fError = function (err) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageBox.error(err, {
                title: this._getLocaleText("errorLoadingWorkingOrderDetailTitle")
            });
        }.bind(this);
        sap.ui.core.BusyIndicator.show(0);
        model.WorkingOrdersModel.getWorkingOrderDetail(null, fSuccess, fError);

    },

    changeState: function(evt){
        var currentStateText = this.getView().byId("currentStateText");
        if (currentStateText) {
            if (this.selectedWorkingOrder && this.selectedWorkingOrder.orderStatus) {
                switch (this.selectedWorkingOrder.orderStatus) {
                    case "04":
                        this.uiModel.setProperty("/currentWorkingOrderState", this._getLocaleText("currentState") + " : Pronto alla spedizione");
                        try {
                            currentStateText.removeStyleClass("currentWorkingOrderStateControlled");
                            currentStateText.addStyleClass("currentWorkingOrderStateReadyToClose");
                        } catch (err) {
                            console.log(err);
                        }
                        break;
                    default:
                        this.uiModel.setProperty("/currentWorkingOrderState", this._getLocaleText("currentState") + " : In verifica");
                        try {
                            currentStateText.removeStyleClass("currentWorkingOrderStatePicking");
                            currentStateText.addStyleClass("currentWorkingOrderStateUnderControl");
                        } catch (err) {
                            console.log(err);
                        }
                }
                evt.getSource().setEnabled(false);
            }
        }
    },

    openSurveyDialog: function(oEvent){
        if (!this._oSurveyDialog) {
            this._oSurveyDialog = sap.ui.xmlfragment("view.fragment.dialog.SurveyDialog", this);
            this.getView().addDependent(this._oSurveyDialog);
        }
        // toggle compact style
        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oSurveyDialog);
        this._oSurveyDialog.open();
        if (!(sap.ui.getCore().byId("surveyWizard"))) {
            return;
        } else {
            sap.ui.getCore().byId("surveyWizard").discardProgress(sap.ui.getCore().byId("surveyStep1"));
        }
    },

    surveyCompletedHandler: function (evt) {
        if (this._oSurveyDialog) {
            this._oSurveyDialog.close();
        }
        if (sap.ui.getCore().byId("surveyWizard")) {
            sap.ui.getCore().byId("surveyWizard").discardProgress(sap.ui.getCore().byId("surveyStep1"));
        }

    },

    initializeSurvey: function (evt) {
        if (sap.ui.getCore().byId("surveyWizard")) {
            sap.ui.getCore().byId("surveyWizard").discardProgress(sap.ui.getCore().byId("surveyStep1"));
        }
    },

    loadStates: function(){
        var fSuccess = function (res) {
            var results = [];
            if (Array.isArray(res) && res.length > 0) {
                results = res;
            } else if (res.hasOwnProperty("results") && res.results) {
                results = res.results;
            }
            this.statusModel.setProperty("/results", results);
            sap.ui.core.BusyIndicator.hide();
        }.bind(this);
        var fError = function (err) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageBox.error(err, {
                title: this._getLocaleText("errorLoadingStatesTitle")
            });
        }.bind(this);
        sap.ui.core.BusyIndicator.show(0);
        model.workingOrderDetailModel.getAllStatuses(fSuccess, fError);
    },

    onChangeStatus: function(evt){
        var src = evt.getSource();
        var context = src.getBindingContext("workingOrderDetailModel");
        // var modelObj = context.getObject();
        var modelObjPath = context.getPath();
        if(modelObjPath){
            this.currentRowOnEdit = modelObjPath.split("/")[modelObjPath.split("/").length -1];
            this.openActionSheetToChangeStatus(evt);
        }
    },

    openActionSheetToChangeStatus: function (oEvent) {
        var oButton = oEvent.getSource();
        if (!this._actionSheet) {
            this._actionSheet = sap.ui
                .xmlfragment("view.fragment.ChooseStatePopover", this);
            this.getView().addDependent(this._actionSheet);
        }
        if (this._actionSheet.getButtons().length > 0)
            this._actionSheet.removeAllButtons();
        for (var i = 0; i < this.statusModel.getProperty("/results").length; i++) {
            var button = this._createActionSheetButton(this.statusModel.getProperty("/results")[i]);
            this._actionSheet.addButton(button);
        }
        jQuery.sap.delayedCall(0, this, function () {
            this._actionSheet.openBy(oButton);
        });

    },

    _createActionSheetButton: function (status) {
        var button =  new sap.m.Button({
            text: status.status,
            press: [this._assignNewStateButton, this]
        });
        var statusClass;
        switch(status.id){
            case "01":
                statusClass="readyToPick";
                break;
            case "02":
                statusClass="picking";
                break;
            case "03":
                statusClass="underControll";
                break;
            case "04":
                statusClass="controlled";
                break;
        }
        button.addStyleClass(statusClass+"StatusButton");
        return button;
    },

    _assignNewStateButton: function(evt){
        var source = evt.getSource();
        var status = source.getText();
        var selectedStateObj = this.statusModel.getProperty("/results").find(function (obj) {
            return obj.status === status;
        });
        if(selectedStateObj && this.currentRowOnEdit !== undefined){
            var cloneRow = _.clone(this.workingOrderDetailModel.getProperty("/results")[this.currentRowOnEdit]);
            if (cloneRow){
                cloneRow.orderStatus= selectedStateObj.id;
                cloneRow.orderStatusDescription= selectedStateObj.status;
                this.workingOrderDetailModel.getProperty("/results")[this.currentRowOnEdit] = cloneRow;
                this.workingOrderDetailModel.refresh();
            }
        }
    },


    onShowDescrizioneArticoloPress: function (evt) {
        var oButton = evt.getSource();
        var obj = oButton.getBindingContext("workingOrderDetailModel").getObject();
        var descrizioneArticolo = {};
        if (obj.listaFatture[0] && obj.listaFatture[0].descrizioneArticolo && obj.listaFatture[0].descrizioneArticolo !== null) {
            descrizioneArticolo = {descrizioneArticolo: obj.listaFatture[0].descrizioneArticolo};
        }
        this.descrizioneArticoloModel.setData(descrizioneArticolo)


    },

    onInvoiceDetailPress: function (evt) {
        var src = evt.getSource();
        var selectedInvoice = src.getBindingContext("workingOrderDetailModel").getObject();
        model.service.LocalStorageService.session.save("selectedInvoice", selectedInvoice);
        this.router.navTo("invoiceDetail", {
            'numeroDocumentoFatturaz': selectedInvoice.numeroDocumentoFatturaz
        });

    },

    reassignPriority: function(){
        var table = this.getView().byId("workingOrdersTable");
        var rows = table.getItems();
        if(rows && rows.length > 0){
            rows.forEach(
                function(row){
                    var context = row.getBindingContext("workingOrderDetailModel");
                    var obj = context.getObject();
                    console.log(obj);
                    row.updateBindings();
                }
            );
        }
    },

    onFilterInvoiceList: function () {
        if (this.unfilteredInvoiceList && this.unfilteredInvoiceList.length > 0) {
            this.workingOrderDetailModel.setProperty("/results", this.unfilteredInvoiceList);
            var invoiceList = _.filter(this.workingOrderDetailModel.getProperty("/results"), function (o) {
                return ((o.listaFatture[0].numeroDocumentoFatturaz.toString().indexOf(this.uiModel.getProperty("/searchValue")) > -1) || (o.listaFatture[0].codiceClienteFornitore.toUpperCase().indexOf(this.uiModel.getProperty("/searchValue").toUpperCase()) > -1));
            }.bind(this));
            this.workingOrderDetailModel.setProperty("/results", invoiceList);
            this.workingOrderDetailModel.refresh();
        } else {
            return;
        }
    },

    onPackagePress: function(evt){
        var src = evt.getSource();
        if(src.getColor() !== 'lightgrey'){
            //sap.m.URLHelper.redirect(this._getVal(evt), true);
            sap.m.URLHelper.redirect("https://drive.google.com/file/d/0Bx1Hy4k97vZPWHNQbkxVMmNqUVE/view?usp=sharing", true);
        }
    },

    onNavBackPress: function () {
        this.router.navTo("workingOrders");
    },

    openPhotocamera: function(evt){
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    },
    
    openGreenSheet: function () {
        sap.m.URLHelper.redirect("https://drive.google.com/file/d/0B11RznDFRURAX1J2TmR6bzVBU2s/view", true);
    },

});