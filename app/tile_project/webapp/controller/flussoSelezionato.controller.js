sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("tileproject.tileproject.controller.tile", {
            onInit: function () {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("Routedettaglio").attachMatched(this._onObjectMatched, this);
            },


            _onObjectMatched: function (oEvent) {

                var sObjectId = oEvent.getParameter("arguments").selectedobj;
                this.getView().bindElement({ path: "/flussi/" + sObjectId, model: "flussiModel" });

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
            _showDetail: function (oItem) {
                var id = oItem.getBindingContext("ErroriModel").getProperty("id"); //prendo l'elemento da selezionare tramite id nella master page
                console.log(id);
                this.getView().byId("detail").bindElement({ path: "/errori/" + id, model: "ErroriModel" });//lo sparo dritto nella detail page
            },

            vaiADnD: function () {
                this.getRouter().navTo("RouteDnD");
            },

            vaiHome: function () {
                window.history.go(-1)
            }


        });
    });