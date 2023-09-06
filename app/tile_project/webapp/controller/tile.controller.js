sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent) {
        "use strict";

        return Controller.extend("tileproject.tileproject.controller.tile", {
            onInit: function () {

                var dataModel = this.getOwnerComponent().getModel("model/flussi.json");
                this.getView().setModel(dataModel, "flussiModel");
             

            },
            getRouter: function () {
                return UIComponent.getRouterFor(this);

            },
            vaiAlDettaglio: function (oEvent) {
                console.log("entrato in vai al dettaglio");
                var oSource = oEvent.getSource(),
                    oContext = oSource.getBindingContext(),
                   
                    idFlusso = oContext.getProperty("ID_FLUSSO");
                this.getRouter().navTo("Routedettaglio", {
                    selectedobj: idFlusso
                });

            },
            vaiAnagUtenti: function () {


                this.getRouter().navTo("RouteAnagUtenti");

            },
            vaiAnagFlussi: function () {


                this.getRouter().navTo("RouteAnagFlussi");

            },

            vaiADnD: function () {
                console.log("entrato in dnd");

                this.getRouter().navTo("RouteDnD");

            },
            vaiTabellaGestione: function(){
                this.getRouter().navTo("RouteTabellaGestione");
            }
            
        });
    });
