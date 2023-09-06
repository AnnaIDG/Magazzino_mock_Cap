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
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ushell/services/URLParsing"
], function (ControlMessageProcessor, Message, Controller, coreLibrary, JSONModel, MessagePopover, MessagePopoverItem, MessageToast, oCore, Utils, Filter, FilterOperator, FilterType, UIComponent,ODataModel,URLParsing) {
    "use strict";

    var MessageType = coreLibrary.MessageType;

    var PageController = Controller.extend("tileproject.tileproject.controller.tile", {

        onInit: function () {
            // var oModel = new JSONModel(sap.ui.require.toUrl("tileproject/tileproject/model/Utenti.json"));
            // this.getView().setModel(oModel);


            var oMessageProcessor = new ControlMessageProcessor();
            var oMessageManager = oCore.getMessageManager();

            oMessageManager.registerMessageProcessor(oMessageProcessor);

            oMessageManager.addMessages(
                new Message({
                    message: "Something wrong happened",
                    type: MessageType.Error,
                    processor: oMessageProcessor
                }),


            );

          

        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);

        },
        add: function () {
            var msg = 'Utente salvato correttamente';
            MessageToast.show(msg);
            this.byId("cognome").setValue(""),
                this.byId("nome").setValue(""),
                this.byId("ruolo").setValue(""),
                this.byId("email").setValue(""),
                this.byId("telefono").setValue("")
        },



        refresh: function () {
            this.byId("cognome").setValue(""),
                this.byId("nome").setValue(""),
                this.byId("ruolo").setValue(""),
                this.byId("email").setValue(""),
                this.byId("telefono").setValue("")
        },

        exit: function () {
            var oModel = new sap.ui.model.odata.v4.ODataModel();
this.getView().setModel(oModel);

            var cognome = this.getView().byId("cognome").getValue();
            var nome = this.getView().byId("nome").getValue();
            var ruolo = this.getView().byId("ruolo").getValue();
            var email = this.getView().byId("email").getValue();
            var telefono = this.getView().byId("telefono").getValue();

            var oData = {
                COGNOME_UTENTE: cognome,
                NOME_UTENTE: nome,
                EMAIL_UTENTE: email,
                ID_RUOLO: ruolo,
                TELEFONO_UTENTE: telefono

            }
            var oModel = this.getView().getModel();
           
            oModel.create("/Anagrafica_Utenti", oData);

            var msg = 'Utente salvato correttamente';
            MessageToast.show(msg);
            this.getRouter().navTo("RouteAnagUtenti");
        },








    });


    return PageController;

});