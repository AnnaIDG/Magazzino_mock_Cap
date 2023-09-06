
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
    "../model/formatter"

], function (ControlMessageProcessor, Message, Controller, coreLibrary, JSONModel, MessagePopover, MessagePopoverItem, MessageToast, oCore, Utils, Filter, FilterOperator, FilterType, UIComponent, formatter) {
    "use strict";

    var MessageType = coreLibrary.MessageType;

    var PageController = Controller.extend("tileproject.tileproject.controller.tile", {

        formatter: formatter,

        onInit: function () {
            // var oModel = new JSONModel(sap.ui.require.toUrl("tileproject/tileproject/model/Utenti.json"));
            // this.getView().setModel(oModel);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteAnagFlussi").attachMatched(this._onObjectMatched, this);


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

            var data = {
                blocked: false
            }

            var oModel = new JSONModel(data);
            this.getView().setModel(oModel, "UIModel");
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
            this.byId("saveAddBtn").setVisible(true);

            this.byId("exitAddBtn").setProperty("visible", true);

            this.getView().getModel("UIModel").setProperty("/blocked", true);



            //  var itemsLista=this.getView().byId("list").getItems();
            //  var arrayItemsLista = [];
            //  for (var i = 0; i < itemsLista.length; i++) {
            //  var oTableUtentiFlussi = this.getView().byId("tableUtentiFlussi");
            //  var nvalueUtentiFlussi = oTableUtentiFlussi.getItem()[i].setProperty("blocked",true);
            //  }


        },


        refresh: function () {

            this.byId("nome").setValue(""),
                this.byId("descrizione").setValue(""),
                this.byId("modulo").setValue("")
        },
        // edit: function () {


        //     this.byId("nome").setProperty("editable", true);
        //     this.byId("descrizione").setProperty("editable", true);
        //     this.byId("modulo").setProperty("editable", true);

        //     this.byId("refreshBtn").setProperty("visible", true),
        //         this.byId("saveBtn").setProperty("visible", true),
        //         this.byId("editBtn").setProperty("visible", false),
        //         this.getView().byId("eliminaUtenteDaFlussoBtn").setProperty("enabled", true)
        // },




        onSelectionChange: function (oEvent) {
            var oList = oEvent.getSource(),
                bSelected = oEvent.getParameter("selected");
            // skip navigation when deselecting an item in multi selection mode
            if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
                // get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
                this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());



            }
        },
        

        _showObject: function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/Anagrafica_Flussi".length)
            });
        },

        _showDetail: function (oItem) {
            var id = oItem.getBindingContext().getProperty("ID_FLUSSO"); //prendo l'elemento da selezionare tramite id nella master page

            var moduloNumerico = oItem.getBindingContext().getProperty("ID_MODULO");
            console.log(moduloNumerico);
            this.getView().byId("detail").bindElement({ path: "/Anagrafica_Flussi/" + id });
            // if (moduloNumerico === 1) {
            //     this.byId("modulo").setValue("SD")
            // } else if (moduloNumerico === 2) {
            //     this.byId("modulo").setValue("FI")
            // } else if (moduloNumerico === 3) {
            //     this.byId("modulo").setValue("MM")
            // } else if (moduloNumerico === 4) {
            //     this.byId("modulo").setValue("PM")
            // } else if (moduloNumerico === 5) {
            //     this.byId("modulo").setValue("FI-CA")
            // } else {

            //}
        },
        onSearch: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            let check = true;


            try {
                if (sQuery != '') {
                    if (/\d/.test(sQuery)) {
                        var input = parseInt(sQuery);
                        check = false;
                        aFilters = new Filter({
                            filters: [
                                new Filter({ path: "ID_FLUSSO", operator: sap.ui.model.FilterOperator.EQ, value1: input }),
                            ],
                            and: false,

                        });
                    } else {
                        throw Error;
                    }
                }
            } catch (error) {
                aFilters = new Filter({
                    filters: [
                        new Filter({ path: "NOME_FLUSSO", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "DESCRIZIONE_FLUSSO", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
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




        onSearchUtentiAssociati: function (oEvt) {

            var sQuery = oEvt.getParameter("query"),
                aFilter = [new Filter("id", FilterOperator.Contains, sQuery),
                new Filter("cognome", FilterOperator.Contains, sQuery),
                new Filter("nome", FilterOperator.Contains, sQuery),

                ],
                oTable = this.byId("tableUtentiFlussi"),
                oTable1 = this.byId("tableUtenti"),
                oBinding = oTable.getBinding("items"),
                oBinding1 = oTable1.getBinding("items"),
                oFilter = null;
            if (sQuery.length != 0) {
                oFilter = new Filter({
                    filters: aFilter,
                    and: false
                });




            }

            oBinding.filter(oFilter);
            oBinding1.filter(oFilter);



        },
        onUpdateFinished: function (oEvent) {
            var oList = oEvent.getSource();
            var aItems = oList.getItems();
            //oList.setSelectedItem(aItems[0], true);
            aItems[0].setSelected(true);
            aItems[0].firePress();
        },

        saveAdd: function () {



            var id = parseInt(this.getView().byId("idAdd").getValue());
            var nome = this.getView().byId("nomeAdd").getValue();
            var modulo = this.getView().byId("selectModuloAdd").getSelectedKey();
            var descrizione = this.getView().byId("descrizioneAdd").getValue();



            if (id != "") {
                this.getView().byId("idAdd").setValueState("None");
            }
            if (nome != "") {
                this.getView().byId("nomeAdd").setValueState("None");
            }

            if (descrizione != "") {
                this.getView().byId("descrizioneAdd").setValueState("None");
            }


            var arrayValidation = [];

            if (id == "") {

                this.getView().byId("idAdd").setValueState("Error");
                MessageToast.show("campo obbligatorio")

            } else {
                arrayValidation.push(true);
            }
            if (nome == "") {

                this.getView().byId("nomeAdd").setValueState("Error");
                MessageToast.show("campo obbligatorio")

            } else {
                arrayValidation.push(true);
            }

            if (descrizione == "") {

                this.getView().byId("descrizioneAdd").setValueState("Error");
                MessageToast.show("campo obbligatorio")

            } else {
                arrayValidation.push(true);
            }



            if (arrayValidation.length === 3) {
                var oContext = this.getView().byId("list").getBinding("items")
                    .create({

                        ID_FLUSSO: id,
                        NOME_FLUSSO: nome,
                        DESCRIZIONE_FLUSSO: descrizione,
                        ID_MODULO_ID_MODULO: modulo
                    });

                // Note: This promise fails only if the transient entity is deleted
                oContext.created().then(function () {
                    MessageToast.show("Creazione avvenuta con successo")
                }, function (oError) {
                    MessageToast.show("Creazione fallita")
                });
                this.getView().byId("idAdd").setValueState("None");
                this.getView().byId("nomeAdd").setValueState("None");
                this.getView().byId("descrizioneAdd").setValueState("None");

            }

            var oView = this.getView();

            function resetBusy() {
                oView.setBusy(false);
            }

            if (modulo == "SD") {

                oContext.setProperty("ID_MODULO_ID_MODULO", 1);

            } else if (modulo == "FI") {

                oContext.setProperty("ID_MODULO_ID_MODULO", 2);

            } else if (modulo == "MM") {

                oContext.setProperty("ID_MODULO_ID_MODULO", 3);

            } else if (modulo == "PM") {

                oContext.setProperty("ID_MODULO_ID_MODULO", 4);

            } else if (modulo == "FI-CO") {

                oContext.setProperty("ID_MODULO_ID_MODULO", 5);

            } else {

            }

            // lock UI until submitBatch is resolved, to prevent errors caused by updates while submitBatch is pending
            oView.setBusy(true);

            oView.getModel().submitBatch(oView.getModel().getUpdateGroupId()).then(resetBusy, resetBusy);

            this.byId("SimpleFormDisplay354wideAdd").setVisible(false);
            this.byId("SimpleFormDisplay354wide").setVisible(true);
            this.byId("editBtn").setVisible(true);
            this.byId("refreshAddBtn").setVisible(false);
            this.byId("saveAddBtn").setVisible(false);


            this.byId("exitAddBtn").setProperty("visible", false);
            this.byId("idAdd").setValue(""),
                this.byId("nomeAdd").setValue(""),
                this.byId("selectModuloAdd").setSelectedKey(1),
                this.byId("descrizioneAdd").setValue(""),



                this.getView().getModel("UIModel").setProperty("/blocked", false);

            this.byId("list").getBinding("items").refresh();
        },

        aggiungiUtenteAFlusso: function () {
            this.byId("tableUtenti").setProperty("visible", true)
        },


        // edit: function (oEvent) {
        //     var items = this.getView().byId("tableUtentiFlussi").getItems();

        //     for (var i = 0; i < items.length; i++) {

        //         var oTable = this.getView().byId("tableUtentiFlussi");
        //         var nvalue = oTable.getItems()[i];

        //         for (var y = 0; y < 4; y++) {
        //             var celle = nvalue.getCells()[y];
        //             if (y == 3) {
        //                 celle.setProperty("enabled", true)
        //             }
        //         }
        //     }
        // },


        onSort: function (oEvent) {
            var oList = this.byId("list"),
                oBinding = oList.getBinding("items");

            var sSortKey = "ID_FLUSSO";
            this.bDescending = !this.bDescending; //switches the boolean back and forth from ascending to descending
            var bGroup = false;
            var aSorter = [];

            aSorter.push(
                new sap.ui.model.Sorter(sSortKey, this.bDescending, bGroup)
            );
            oBinding.sort(aSorter);
        },
        save: function () {
            this.byId("id").setProperty("editable", false),
                this.byId("nome").setProperty("editable", false),
                this.byId("descrizione").setProperty("editable", false),
                this.byId("selectModuloAdd").setProperty("visible", false),
                this.byId("modulo").setProperty("visible", true),
                this.byId("modulo").setProperty("editable", false);
                this.byId("refreshBtn").setProperty("visible", false),
                this.byId("saveBtn").setProperty("visible", false),
                this.byId("editBtn").setProperty("visible", true),
                this.byId("tableUtentiFlussi").byId("eliminaUtenteDaFlussoBtn").setProperty("enabled", false)
        },
        edit: function (oEvent) {

            this.byId("id").setProperty("editable", false);
            this.byId("nome").setProperty("editable", true);
            this.byId("descrizione").setProperty("editable", true);
            this.byId("modulo").setProperty("visible", true);
            this.byId("modulo").setProperty("editable", true);
            this.byId("selectModuloAdd").setProperty("visible", true);
            this.byId("selectModuloAdd").setProperty("editable", true);
            this.byId("refreshBtn").setProperty("visible", true);
            this.byId("saveBtn").setProperty("visible", true);
            this.byId("deleteBtn").setProperty("visible", true);
            this.byId("exitBtn").setProperty("visible", true);
            this.byId("editBtn").setProperty("visible", false);
            this.byId("addBtn").setProperty("visible", false);

            this.getView().getModel("UIModel").setProperty("/blocked", true);

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

            this.byId("id").setProperty("editable", false);
            this.byId("nome").setProperty("editable", false);
            this.byId("descrizione").setProperty("editable", false);
            this.byId("modulo").setProperty("visible", true);
            this.byId("modulo").setProperty("editable", false);
            this.byId("selectModuloAdd").setProperty("visible", true);
            this.byId("refreshBtn").setProperty("visible", false);
            this.byId("saveBtn").setProperty("visible", false);
            this.byId("deleteBtn").setProperty("visible", false);
            this.byId("exitBtn").setProperty("visible", false);
            this.byId("editBtn").setProperty("visible", true);
            this.byId("addBtn").setProperty("visible", true);

            this.getView().getModel("UIModel").setProperty("/blocked", false);

            var list = this.getView().byId("list");
            list.getModel().refresh();
        },
        exit: function () {

            this.byId("id").setProperty("editable", false);
            this.byId("nome").setProperty("editable", false);
            this.byId("descrizione").setProperty("editable", false);
            this.byId("modulo").setProperty("editable", false);
            this.byId("modulo").setProperty("visible", true);
            this.byId("selectModuloAdd").setProperty("visible", true);
            this.byId("refreshBtn").setProperty("visible", false);
            this.byId("saveBtn").setProperty("visible", false);
            this.byId("deleteBtn").setProperty("visible", false);
            this.byId("exitBtn").setProperty("visible", false);
            this.byId("editBtn").setProperty("visible", true);
            this.byId("addBtn").setProperty("visible", true);

            this.getView().getModel("UIModel").setProperty("/blocked", false);

        },


    });
    return PageController;
});