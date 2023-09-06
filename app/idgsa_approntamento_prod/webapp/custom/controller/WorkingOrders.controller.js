jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.WorkingOrdersModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("model.service.LocalStorageService");
jQuery.sap.require("model.filters.Filter");
jQuery.sap.require("sap.m.MessageBox");

/*MakeListSortable*/
jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-droppable');
jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
sap.ui.localResources("sapui5draganddrop");
/*MakeListSortable*/


controller.AbstractController.extend("controller.WorkingOrders", {
    /**
     * @memberOf controller.WorkingOrders
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
        this.workingOrdersModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.workingOrdersModel, "workingOrdersModel");
        this.statusModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.statusModel, "statusModel");
        this.uiModel.setProperty("/searchProperty", ["orderId"]);
    },

    handleRouteMatched: function (evt) {
        if (!this._checkRoute(evt, "workingOrders"))
            return;

        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);

        // this.userLogged = this._getUserLogged();
        this.workingOrdersModel.setData({results: []});
        this.setInitialPage();

        if(this._getLoggedUserType()){
            if(this._getLoggedUserType() === 'OP'){
                this.uiModel.setProperty("/loggedUserType", "OP");
            }else if(this._getLoggedUserType() === 'PM'){
                this.loadStates();
                this.uiModel.setProperty("/loggedUserType", "PM");
            }
        }
        
        if(this._getLoggedUserType()){
            if(this._getLoggedUserType() === 'PM'){
                /*MakeListSortable*/
                var oSortableList = this.getView().byId("workingOrdersTable");
                oSortableList.onAfterRendering = function () {
                    this.getView().$().find(".sapMList.sortableTable tbody").sortable();
                    this.getView().$().find(".sapMList.sortableTable tbody").droppable({
                        drop: function (event, ui) {
                            try {
                                var listElementId = ui.draggable.context.id;
                                var draggedElement = sap.ui.getCore().byId(listElementId);
                                var oPath = draggedElement.getBindingContext("workingOrdersModel").getPath();
                                var split = oPath.split("/");
                                console.log("splitPath after drop : " + split);
                                this.reassignPriority();
                            }catch(err){
                                console.log(err);
                            }
                        }.bind(this)
                    });
                }.bind(this);
                /*MakeListSortable*/
            } else {
                var oSortableList = this.getView().byId("workingOrdersTable");
                oSortableList.onAfterRendering = function () {
                    this.getView().$().find(".sapMList.sortableTable tbody").droppable({
                        disabled: true
                    });
                }.bind(this);
            }
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
            this.workingOrdersModel.setSizeLimit(results.length);
            this.workingOrdersModel.setProperty("/results", results);
            sap.ui.core.BusyIndicator.hide();
        }.bind(this);
        var fError = function (err) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageBox.error(err, {
                title: this._getLocaleText("errorLoadingWorkingOrdersTitle")
            });
        }.bind(this);
        var req = null;
        if(this._getLoggedUserType() === 'OP'){
            // req.isOP = true;
        }
        sap.ui.core.BusyIndicator.show(0);
        model.WorkingOrdersModel.getWorkingOrdersList(req, fSuccess, fError);

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
        model.WorkingOrdersModel.getAllStatuses(fSuccess, fError);
    },

    onChangeStatus: function(evt){
        var src = evt.getSource();
        var context = src.getBindingContext("workingOrdersModel");
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
            var cloneRow = _.clone(this.workingOrdersModel.getProperty("/results")[this.currentRowOnEdit]);
            if (cloneRow){
                cloneRow.orderStatus= selectedStateObj.id;
                cloneRow.orderStatusDescription= selectedStateObj.status;
                this.workingOrdersModel.getProperty("/results")[this.currentRowOnEdit] = cloneRow;
                this.workingOrdersModel.refresh();
            }
        }
    },

    onWorkingOrderDetailPress: function (evt) {
        var src = evt.getSource();
        var selectedItem = src.getBindingContext("workingOrdersModel").getObject();
        model.service.LocalStorageService.session.save("selectedWorkingOrder", selectedItem);
        if(selectedItem && selectedItem.hasOwnProperty("orderStatus")){
            this.router.navTo("workingOrdersDetail", {
                'orderId': selectedItem.orderId
            });
            // if(selectedItem.orderStatus === "04"){
            //     this.router.navTo("workingOrdersSurvey", {
            //         'orderId': selectedItem.orderId
            //     });
            // }else{
            //     this.router.navTo("workingOrdersDetail", {
            //         'orderId': selectedItem.orderId
            //     });
            // }
        }
    },

    reassignPriority: function(){
        var table = this.getView().byId("workingOrdersTable");
        var rows = table.getItems();
        if(rows && rows.length > 0){
            rows.forEach(
                function(row){
                    var context = row.getBindingContext("workingOrdersModel");
                    var obj = context.getObject();
                    console.log(obj);
                    row.updateBindings();
                }
            );
        }
    },

    onFilterInvoiceList: function () {
        if (this.unfilteredInvoiceList && this.unfilteredInvoiceList.length > 0) {
            this.workingOrdersModel.setProperty("/results", this.unfilteredInvoiceList);
            var invoiceList = _.filter(this.workingOrdersModel.getProperty("/results"), function (o) {
                return ((o.listaFatture[0].numeroDocumentoFatturaz.toString().indexOf(this.uiModel.getProperty("/searchValue")) > -1) || (o.listaFatture[0].codiceClienteFornitore.toUpperCase().indexOf(this.uiModel.getProperty("/searchValue").toUpperCase()) > -1));
            }.bind(this));
            this.workingOrdersModel.setProperty("/results", invoiceList);
            this.workingOrdersModel.refresh();
        } else {
            return;
        }
    },

    onPackagePress: function(evt){
        var src = evt.getSource();
        if(src.getColor() !== 'lightgrey'){
            //sap.m.URLHelper.redirect(this._getVal(evt), true);
            sap.m.URLHelper.redirect("https://drive.google.com/file/d/0B67DM2TKDJrBaXhzZTBrNlVWUlk/view", true);
        }
    },

    onNavBackPress: function () {
        this.router.navTo("launchpad");
    },
});