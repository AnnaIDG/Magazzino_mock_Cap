sap.ui.define([
    'sap/ui/core/message/ControlMessageProcessor',
    'sap/ui/core/message/Message',
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/library',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessagePopover',
    'sap/m/MessagePopoverItem',
    'sap/m/MessageToast',
    "sap/ui/core/Core",
    "./Utils",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Sorter",
    "sap/ui/model/odata/v4/ODataModel",
    "../model/formatter"
], function (ControlMessageProcessor, Message, Controller, coreLibrary, JSONModel, MessagePopover, MessagePopoverItem, MessageToast, oCore, Utils, Filter, FilterOperator, FilterType, UIComponent, Sorter, ODataModel, formatter) {
    "use strict";

    var MessageType = coreLibrary / MessageType;

    var PageController = Controller.extend("tileproject.tileproject.controller.tile", {
        formatter: formatter,
        onInit: function (oItem) {





            var data = {
                blocked: false
            }

            var oModel = new JSONModel(data);
            this.getView().setModel(oModel, "UIModel");

            var searchField = {
                nome: "NOME_UTENTE",
                cognome: "COGNOME_UTENTE"
            }

            var oModel = new JSONModel(searchField);
            this.getView().setModel(oModel, "searchField");



            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteAnagUtenti").attachMatched(this._onObjectMatched, this);

            var oMessageProcessor = new ControlMessageProcessor();
            var oMessageManager = oCore.getMessageManager();

            oMessageManager.registerMessageProcessor(oMessageProcessor);

            oMessageManager.addMessages(
                new Message({
                    message: "Something wrong happened",
                    type: MessageType.Error,
                    processor: oMessageProcessor
                })
            );

            var list = {
                id: "ID_UTENTE"
            }

            var oModel = new JSONModel(list);
            this.getView().setModel(oModel, "listModel");

            // let oList = this.getView().byId("list").getBinding("items"); //esce undefined
            // let aList = [];

            // for (var i = 0; i < oList.length; i++) {
            //     var id = this.getView().getModel("listModel").getProperty("/id");
            //     aList.push(id);
            // }

            // idMax = Math.max(aList);

            //this.getView().byId("detail").bindElement({ path: "/Anagrafica_Utenti/" + 20 });//questa riga funziona

        },

        onPress: function (oEvent) {

            MessageToast.show("Pressed custom button " + oEvent.getSource().getId());
        },
        onSemanticButtonPress: function (oEvent) {

            var sAction = oEvent.getSource().getMetadata().getName();
            sAction = sAction.replace(oEvent.getSource().getMetadata().getLibraryName() + ".", "");

            MessageToast.show("Pressed: " + sAction);
        },
        onSemanticSelectChange: function (oEvent, oData) {
            var sAction = oEvent.getSource().getMetadata().getName();
            sAction = sAction.replace(oEvent.getSource().getMetadata().getLibraryName() + ".", "");

            var sStatusText = sAction + " by " + oEvent.getSource().getSelectedItem().getText();
            MessageToast.show("Selected: " + sStatusText);
        },
        onPositionChange: function (oEvent) {
            MessageToast.show("Positioned changed to " + oEvent.getParameter("newPosition"));
        },
        onMessagesButtonPress: function (oEvent) {

            var oMessagesButton = oEvent.getSource();
            if (!this._messagePopover) {
                this._messagePopover = new MessagePopover({
                    items: {
                        path: "message>/",
                        template: new MessagePopoverItem({
                            description: "{message>description}",
                            type: "{message>type}",
                            title: "{message>message}"
                        })
                    }
                });
                oMessagesButton.addDependent(this._messagePopover);
            }
            this._messagePopover.toggle(oMessagesButton);
        },
        onMultiSelectPress: function (oEvent) {
            if (oEvent.getSource().getPressed()) {
                MessageToast.show("MultiSelect Pressed");
            } else {
                MessageToast.show("MultiSelect Unpressed");
            }
        },
        getRouter: function () {
            return UIComponent.getRouterFor(this);

        },
        add: function () {
            this.byId("SimpleFormDisplay354wideAdd").setVisible(true);
            this.byId("SimpleFormDisplay354wide").setVisible(false);

            this.byId("editBtn").setVisible(false);
            this.byId("refreshAddBtn").setVisible(true);
            this.byId("saveAddAddBtn").setVisible(true);
            this.byId("saveAddQuitBtn").setVisible(true);
            this.byId("exitAddBtn").setProperty("visible", true);

            this.getView().getModel("UIModel").setProperty("/blocked", true);



            //  var itemsLista=this.getView().byId("list").getItems();
            //  var arrayItemsLista = [];
            //  for (var i = 0; i < itemsLista.length; i++) {
            //  var oTableUtentiFlussi = this.getView().byId("tableUtentiFlussi");
            //  var nvalueUtentiFlussi = oTableUtentiFlussi.getItem()[i].setProperty("blocked",true);
            //  }


        },


        // var itemsUtentiFlussi = this.getView().byId("tableUtentiFlussi").getItems();
        // var arrayUtentiFlussi = [];

        // for (var i = 0; i < itemsUtentiFlussi.length; i++) {

        //     var oTableUtentiFlussi = this.getView().byId("tableUtentiFlussi");
        //     var nvalueUtentiFlussi = oTableUtentiFlussi.getItems()[i];

        //     for (var y = 0; y < 4; y++) {
        //         var celleUtentiFlussi = nvalueUtentiFlussi.getCells()[y];
        //         if (y == 0) {
        //             var idUtentiFlussi = celleUtentiFlussi.getText();

        //         }
        //     }

        //     arrayUtentiFlussi.push(idUtentiFlussi);

        // }


        refreshAdd: function () {

            this.byId("cognomeAdd").setValue(""),
                this.byId("nomeAdd").setValue(""),
                this.byId("ruoloAdd").setValue(""),
                this.byId("emailAdd").setValue(""),
                this.byId("telefonoAdd").setValue("")
        },

        exit: function () {

            this.byId("editBtn").setVisible(true);
            this.byId("refreshBtn").setVisible(false);
            this.byId("deleteBtn").setVisible(false);
            this.byId("saveBtn").setVisible(false);
            this.byId("exitBtn").setProperty("visible", false);
            this.byId("selectRuolo").setProperty("visible", false);
            this.byId("ruolo").setProperty("visible", true);
            this.byId("cognome").setProperty("editable", false);
            this.byId("nome").setProperty("editable", false);
            this.byId("email").setProperty("editable", false);
            this.byId("telefono").setProperty("editable", false);

            this.getView().getModel("UIModel").setProperty("/blocked", false);

        },

        //la funzione saveAddAdd serve per salvare il nuovo utente e poi rimanere sul form di aggiunta utente per aggiungerne uno ulteriore

        saveAddAdd: function (oEvent) {

            var cognome = this.getView().byId("cognomeAdd").getValue();
            var nome = this.getView().byId("nomeAdd").getValue();
            var ruolo = this.getView().byId("selectRuoloAdd").getSelectedKey();
            var email = this.getView().byId("emailAdd").getValue();
            var telefono = this.getView().byId("telefonoAdd").getValue();


            if (nome != "") {
                this.getView().byId("nomeAdd").setValueState("None");
            }
            if (cognome != "") {
                this.getView().byId("cognomeAdd").setValueState("None");
            }
            if (email != "") {
                this.getView().byId("emailAdd").setValueState("None");
            }
            if (telefono != "") {
                this.getView().byId("telefonoAdd").setValueState("None");
            }

            var arrayValidation = [];

            if (nome.length > 30 || nome == "") {
                this.getView().byId("nomeAdd").setValueState("Error");
                MessageToast.show("La lunghezza del nome non può essere maggiore a 30 caratteri  o essere vuoto")
            } else {
                arrayValidation.push(true);
            }
            if (cognome.length > 40 || cognome == "") {
                this.getView().byId("cognomeAdd").setValueState("Error");
                MessageToast.show("La lunghezza del cognome non può essere maggiore a 40 caratteri  o essere vuoto")
            } else {
                arrayValidation.push(true);
            }
            if (email.length > 30 || email == "") {
                this.getView().byId("emailAdd").setValueState("Error");
                MessageToast.show("La lunghezza dell'email non può essere maggiore a 30 caratteri  o essere vuoto")
            } else {
                arrayValidation.push(true);
            }
            if (telefono.length > 30 || telefono == "") {
                this.getView().byId("telefonoAdd").setValueState("Error");
                MessageToast.show("La lunghezza del numero telefono non può essere maggiore a 30 caratteri o essere vuoto")
            } else {
                arrayValidation.push(true);
            }
            if (arrayValidation.length === 4) {
                var oContext = this.getView().byId("list").getBinding("items")
                    .create({

                        COGNOME_UTENTE: cognome,
                        NOME_UTENTE: nome,
                        EMAIL_UTENTE: email,
                        ID_RUOLO_ID_RUOLO: ruolo,
                        TELEFONO_UTENTE: telefono
                    });

                // Note: This promise fails only if the transient entity is deleted
                oContext.created().then(function () {
                    MessageToast.show("Creazione avvenuta con successo")
                }, function (oError) {
                    MessageToast.show("Creazione fallita")
                });
                this.getView().byId("cognomeAdd").setValueState("None");
                this.getView().byId("nomeAdd").setValueState("None");
                this.getView().byId("emailAdd").setValueState("None");
                this.getView().byId("telefonoAdd").setValueState("None");


            }


            var oView = this.getView();

            function resetBusy() {
                oView.setBusy(false);
            }

            if (ruolo == "Admin") {

                oContext.setProperty("ID_RUOLO_ID_RUOLO", 1);

            } else if (ruolo == "Technical") {

                oContext.setProperty("ID_RUOLO_ID_RUOLO", 2);

            } else if (ruolo == "Consumer") {

                oContext.setProperty("ID_RUOLO_ID_RUOLO", 3);

            } else {

            }

            // lock UI until submitBatch is resolved, to prevent errors caused by updates while submitBatch is pending
            oView.setBusy(true);

            oView.getModel().submitBatch(oView.getModel().getUpdateGroupId()).then(resetBusy, resetBusy);


            this.byId("cognomeAdd").setValue(""),
                this.byId("nomeAdd").setValue(""),
                this.byId("selectRuoloAdd").setSelectedKey(1),
                this.byId("emailAdd").setValue(""),
                this.byId("telefonoAdd").setValue("")

            this.getView().getModel("UIModel").setProperty("/blocked", false);


        },

        //la funzione saveAddQuit serve per salvare il nuovo utente e poi ritornare alla visualizzazione di master e detail

        saveAddQuit: function (params) {

            var cognome = this.getView().byId("cognomeAdd").getValue();
            var nome = this.getView().byId("nomeAdd").getValue();
            var ruolo = this.getView().byId("selectRuoloAdd").getSelectedKey();
            var email = this.getView().byId("emailAdd").getValue();
            var telefono = this.getView().byId("telefonoAdd").getValue();


            if (nome != "") {
                this.getView().byId("nomeAdd").setValueState("None");
            }
            if (cognome != "") {
                this.getView().byId("cognomeAdd").setValueState("None");
            }

            if (email != "") {
                this.getView().byId("emailAdd").setValueState("None");
            }
            if (telefono != "") {
                this.getView().byId("telefonoAdd").setValueState("None");
            }

            var arrayValidation = [];

            if (nome.length > 30 || nome == "") {

                this.getView().byId("nomeAdd").setValueState("Error");
                MessageToast.show("La lunghezza del nome non può essere maggiore a 30 caratteri  o essere vuoto")

            } else {
                arrayValidation.push(true);
            }
            if (cognome.length > 40 || cognome == "") {

                this.getView().byId("cognomeAdd").setValueState("Error");
                MessageToast.show("La lunghezza del cognome non può essere maggiore a 40 caratteri  o essere vuoto")

            } else {
                arrayValidation.push(true);
            }

            if (email.length > 30 || email == "") {

                this.getView().byId("emailAdd").setValueState("Error");
                MessageToast.show("La lunghezza dell'email non può essere maggiore a 30 caratteri  o essere vuoto")

            } else {
                arrayValidation.push(true);
            }
            if (telefono.length > 30 || telefono == "") {

                this.getView().byId("telefonoAdd").setValueState("Error");
                MessageToast.show("La lunghezza del numero telefono non può essere maggiore a 30 caratteri o essere vuoto")

            } else {
                arrayValidation.push(true);
            }

            if (arrayValidation.length === 4) {
                var oContext = this.getView().byId("list").getBinding("items")
                    .create({

                        COGNOME_UTENTE: cognome,
                        NOME_UTENTE: nome,
                        EMAIL_UTENTE: email,
                        ID_RUOLO_ID_RUOLO: ruolo,
                        TELEFONO_UTENTE: telefono
                    });

                // Note: This promise fails only if the transient entity is deleted
                oContext.created().then(function () {
                    alert("ok")
                }, function (oError) {
                    alert("fail")
                });
                this.getView().byId("cognomeAdd").setValueState("None");
                this.getView().byId("nomeAdd").setValueState("None");
                this.getView().byId("emailAdd").setValueState("None");
                this.getView().byId("telefonoAdd").setValueState("None");
            }

            var oView = this.getView();

            function resetBusy() {
                oView.setBusy(false);
            }

            if (ruolo == "Admin") {

                oContext.setProperty("ID_RUOLO_ID_RUOLO", 1);

            } else if (ruolo == "Technical") {

                oContext.setProperty("ID_RUOLO_ID_RUOLO", 2);

            } else if (ruolo == "Consumer") {

                oContext.setProperty("ID_RUOLO_ID_RUOLO", 3);

            } else {

            }

            // lock UI until submitBatch is resolved, to prevent errors caused by updates while submitBatch is pending
            oView.setBusy(true);

            oView.getModel().submitBatch(oView.getModel().getUpdateGroupId()).then(resetBusy, resetBusy);

            this.byId("SimpleFormDisplay354wideAdd").setVisible(false);
            this.byId("SimpleFormDisplay354wide").setVisible(true);
            this.byId("editBtn").setVisible(true);
            this.byId("refreshAddBtn").setVisible(false);
            this.byId("saveAddAddBtn").setVisible(false);
            this.byId("saveAddQuitBtn").setVisible(false);

            this.byId("exitAddBtn").setProperty("visible", false);
            this.byId("cognomeAdd").setValue(""),
                this.byId("nomeAdd").setValue(""),
                this.byId("selectRuoloAdd").setSelectedKey(1),
                this.byId("emailAdd").setValue(""),
                this.byId("telefonoAdd").setValue("")

            this.getView().getModel("UIModel").setProperty("/blocked", false);

        },
        exitAdd: function () {
            this.byId("SimpleFormDisplay354wideAdd").setVisible(false);
            this.byId("SimpleFormDisplay354wide").setVisible(true);
            this.byId("editBtn").setVisible(true);
            this.byId("refreshAddBtn").setVisible(false);
            this.byId("saveAddAddBtn").setVisible(false);
            this.byId("saveAddQuitBtn").setVisible(false);
            this.byId("exitAddBtn").setProperty("visible", false);

            this.getView().getModel("UIModel").setProperty("/blocked", false);

        },

        edit: function () {

            this.byId("cognome").setProperty("editable", true);
            this.byId("nome").setProperty("editable", true);
            this.byId("ruolo").setProperty("visible", false);
            this.byId("selectRuolo").setProperty("visible", true);
            this.byId("email").setProperty("editable", true);
            this.byId("telefono").setProperty("editable", true);
            this.byId("refreshBtn").setProperty("visible", true);
            this.byId("saveBtn").setProperty("visible", true);
            this.byId("deleteBtn").setProperty("visible", true);
            this.byId("exitBtn").setProperty("visible", true);
            this.byId("editBtn").setProperty("visible", false);

            this.getView().getModel("UIModel").setProperty("/blocked", true);
        },
        refresh: function () {

            this.byId("cognome").setValue(""),
                this.byId("nome").setValue(""),
                this.byId("ruolo").setValue(""),
                this.byId("email").setValue(""),
                this.byId("telefono").setValue("")
        },

        save: function () {

            var cognome = this.getView().byId("cognome").getValue();
            var nome = this.getView().byId("nome").getValue();
            var ruolo = this.getView().byId("selectRuolo").getSelectedKey();
            var email = this.getView().byId("email").getValue();
            var telefono = this.getView().byId("telefono").getValue();

            var arrayValidation = [];

            var oContext = this.getView().byId("detail").getBindingContext();

            if (cognome.length > 40 || cognome == "") {
                this.getView().byId("cognome").setValueState("Error");
                MessageToast.show("La lunghezza del cognome non può essere maggiore a 40 caratteri  o essere vuoto")
            } else {
                arrayValidation.push(true);
                this.byId("cognome").setProperty("editable", false);
            }
            if (nome.length > 30 || nome == "") {
                this.getView().byId("nome").setValueState("Error");
                MessageToast.show("La lunghezza del nome non può essere maggiore a 30 caratteri  o essere vuoto")
            } else {
                arrayValidation.push(true);
                this.byId("nome").setProperty("editable", false);
            }

            if (email.length > 30 || email == "") {

                this.getView().byId("email").setValueState("Error");
                MessageToast.show("La lunghezza dell'email non può essere maggiore a 30 caratteri  o essere vuoto")

            } else {

                arrayValidation.push(true);
                this.byId("email").setProperty("editable", false);
            }
            if (telefono.length > 30 || telefono == "") {

                this.getView().byId("telefono").setValueState("Error");
                MessageToast.show("La lunghezza del numero telefono non può essere maggiore a 30 caratteri o essere vuoto")

            } else {

                arrayValidation.push(true);
                this.byId("telefono").setProperty("editable", false);
            }
            oContext.setProperty("ID_RUOLO_ID_RUOLO", ruolo);

            if (ruolo == "Admin") {

                oContext.setProperty("ID_RUOLO_ID_RUOLO", 1);

            } else if (ruolo == "Technical") {

                oContext.setProperty("ID_RUOLO_ID_RUOLO", 2);

            } else if (ruolo == "Consumer") {

                oContext.setProperty("ID_RUOLO_ID_RUOLO", 3);

            } else {

            }

            if (arrayValidation.length === 4) {
                //setto le property dagli input sul modello
                oContext.setProperty("COGNOME_UTENTE", cognome);
                oContext.setProperty("NOME_UTENTE", nome);
                oContext.setProperty("EMAIL_UTENTE", email);
                oContext.setProperty("TELEFONO_UTENTE", telefono);

                this.getView().byId("cognome").setValueState("None");
                this.getView().byId("nome").setValueState("None");
                this.getView().byId("email").setValueState("None");
                this.getView().byId("telefono").setValueState("None");
                this.byId("refreshBtn").setProperty("visible", false);
                this.byId("saveBtn").setProperty("visible", false);
                this.byId("deleteBtn").setProperty("visible", false);
                this.byId("exitBtn").setProperty("visible", false);
                this.byId("editBtn").setProperty("visible", true);
                this.byId("ruolo").setProperty("visible", true);
                this.byId("selectRuolo").setProperty("visible", false);
                this.byId("ruolo").setProperty("visible", true);

                this.getView().getModel("UIModel").setProperty("/blocked", false);

                //refresh della lista
                var list = this.getView().byId("list");
                list.getModel().refresh();
                //scrittura sull'odata
                this.getView().getModel().submitBatch();

            }
        },


        delete: function (oEvent) {

            // var oDetailId = this.getView().byId("id").getValue();
            // console.log(oDetailId);

            var oSalesOrderContext = this.getView().byId("detail").getBindingContext();

            oSalesOrderContext.delete("$auto").then(function () {
                alert("OK")
            }, function (oError) {
                alert("FAIL")
            });

            var oView = this.getView();

            function resetBusy() {
                oView.setBusy(false);
            }

            // lock UI until submitBatch is resolved, to prevent errors caused by updates while submitBatch is pending
            oView.setBusy(true);

            oView.getModel().submitBatch(oView.getModel().getUpdateGroupId()).then(resetBusy, resetBusy);

            this.byId("refreshBtn").setProperty("visible", false);
            this.byId("saveBtn").setProperty("visible", false);
            this.byId("deleteBtn").setProperty("visible", false);
            this.byId("exitBtn").setProperty("visible", false);
            this.byId("editBtn").setProperty("visible", true);
            this.byId("ruolo").setProperty("visible", true);
            this.byId("selectRuolo").setProperty("visible", false);
            this.byId("cognome").setProperty("editable", false);
            this.byId("nome").setProperty("editable", false);
            this.byId("ruolo").setProperty("editable", false);
            this.byId("email").setProperty("editable", false);
            this.byId("telefono").setProperty("editable", false);

            this.getView().getModel("UIModel").setProperty("/blocked", false);

            var list = this.getView().byId("list");
            list.getModel().refresh();
        },


        onSelectionChange: function (oEvent) {
            var oList = oEvent.getSource(),
                bSelected = oEvent.getParameter("selected");
            // skip navigation when deselecting an item in multi selection mode
            if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
                // get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
                this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());

            }

        },
        // _onObjectMatched: function (oEvent) {
        //     var sObjectId = oEvent.getParameter("arguments").objectId;
        //     this._bindView("/Anagrafica_Utenti" + sObjectId);
        // },
        // _bindView: function (sObjectPath) {
        //     var oViewModel = this.getModel("objectView");

        //     this.getView().bindElement({
        //         path: sObjectPath,
        //         events: {
        //             change: this._onBindingChange.bind(this),
        //             dataRequested: function () {
        //                 oViewModel.setProperty("/busy", true);
        //             },
        //             dataReceived: function () {
        //                 oViewModel.setProperty("/busy", false);
        //             }
        //         }
        //     });
        // },
        // onPress: function (oEvent) {
        //     // The source is the list item that got pressed
        //     this._showObject(oEvent.getSource());

        // },

        _showObject: function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/Anagrafica_Utenti".length)
            });

        },

        _showDetail: function (oItem) {
            var id = oItem.getBindingContext().getProperty("ID_UTENTE"); //prendo l'elemento da selezionare tramite id nella master page
            var ruoloNumerico = oItem.getBindingContext().getProperty("ID_RUOLO");
            // console.log(ruoloNumerico);
            this.getView().byId("detail").bindElement({ path: "/Anagrafica_Utenti/" + id });

        },

        onUpdateFinished: function (oEvent) {
            var oList = oEvent.getSource();
            var aItems = oList.getItems();
            //oList.setSelectedItem(aItems[0], true);
            aItems[0].setSelected(true);
            aItems[0].firePress();
        },

        // onSearch: function (oEvt) {
        //     var sQuery = oEvt.getParameter("query"),
        //         aFilter = [new Filter("COGNOME_UTENTE", FilterOperator.Contains, sQuery),
        //         new Filter("NOME_UTENTE", FilterOperator.Contains, sQuery),
        //         new Filter("ID_UTENTE", FilterOperator.EQ, sQuery),
        //         ],
        //         oTable = this.byId("list"),
        //         oBinding = oTable.getBinding("items"),
        //         oFilter = null;
        //     if (sQuery.length != 0) {
        //         oFilter = new Filter({
        //             filters: aFilter,
        //             and: false
        //         });
        //     }
        //     oBinding.filter(oFilter);
        // },

        onSearch2: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();

            console.log(sQuery);

            if (sQuery && sQuery.length > 0) {
                var filter = new Filter(
                    "NOME_UTENTE",
                    FilterOperator.Contains,
                    sQuery
                );
                aFilters.push(filter);
            }
            // update list binding
            var oList = this.byId("list");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },
        onSearch1: function (oEvent) {
            // add filter for search
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();


            if (sQuery && sQuery.length > 0) {
                var filter = new Filter("NOME_UTENTE", FilterOperator.Contains, sQuery);
                var filter = new Filter("COGNOME_UTENTE", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }

            // update list binding
            var oList = this.byId("list");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },

        onSearch: function (oEvent) {
            // add filter for search
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            let check=true;
           

            try{
                if(sQuery!=''){
                    if(/\d/.test(sQuery)){
                        var input=parseInt(sQuery);
                        check=false;
                        aFilters = new Filter({
                            filters: [
                                new Filter({ path: "ID_UTENTE", operator: sap.ui.model.FilterOperator.EQ, value1: input}),
                                new Filter({ path: "TELEFONO_UTENTE", operator: sap.ui.model.FilterOperator.EQ, value1: input}),
                            ],
                            and: false,
                        
                        });
                    }else{
                        throw Error;
                    }
                    }
            }catch(error){
                aFilters = new Filter({
                    filters: [
                        new Filter({ path: "COGNOME_UTENTE", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "NOME_UTENTE", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "EMAIL_UTENTE", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        // new Filter({ path: "TELEFONO_UTENTE", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                    ],
                    and: false,
                });
            }
            
            
            // update list binding
            var oList = this.byId("list");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },

        onSort: function (oEvent) {
            var oList = this.byId("list"),
                oBinding = oList.getBinding("items");

            var sSortKey = "ID_UTENTE";
            this.bDescending = !this.bDescending; //switches the boolean back and forth from ascending to descending
            var bGroup = false;
            var aSorter = [];

            aSorter.push(
                new sap.ui.model.Sorter(sSortKey, this.bDescending, bGroup)
            );
            oBinding.sort(aSorter);
        },

    });


    return PageController;

});