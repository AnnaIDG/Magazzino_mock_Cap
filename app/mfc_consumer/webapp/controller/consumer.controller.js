sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "../model/formatter",
    "sap/ui/model/FilterType",


],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Sorter, formatter, FilterType) {
        "use strict";

        var mostralegenda=false;

        return Controller.extend("mfcconsumer.controller.med_technical", {
            formatter: formatter,

            onInit: function () {


                // var id = 7
               
                // this.getView().byId("detail").bindElement({ path: "/Anagrafica_Errori/" + id });
                

                //  var firstItem = this.getView().byId("list").getItems()[0]; 
           
                //     var lista=[];
                //    elemento = this.byId("list").getItems();
                //    lista.push(elemento);

                //            var primoElemento=lista[0];
                //            this.getView().byId("list").setSelectedItem(primoElemento,true); 






              
            },
            edit: function () {
                this.getView().byId("selectStatoErrore").setVisible(true);
                this.getView().byId("statoerrore").setVisible(false);
                this.getView().byId("saveBtn").setVisible(true);
                this.getView().byId("editBtn").setVisible(false);


            },


            save: function () {
                this.getView().byId("saveBtn").setVisible(false);
                this.getView().byId("editBtn").setVisible(true);
                this.getView().byId("selectStatoErrore").setVisible(false);
                this.getView().byId("statoerrore").setVisible(true);

                var oContext = this.getView().byId("detail").getBindingContext();
                var statoerrore = this.getView().byId("selectStatoErrore").getSelectedKey();



                if (statoerrore == "Errore") {

                    oContext.setProperty("ID_STATO_ERRORE_ID_STATO_ERRORE", 1);

                } else if (statoerrore == "Gestione Tecnica") {

                    oContext.setProperty("ID_STATO_ERRORE_ID_STATO_ERRORE", 2);

                } else if (statoerrore == "Risolto") {

                    oContext.setProperty("ID_STATO_ERRORE_ID_STATO_ERRORE", 3);

                } else {

                }
                var list = this.getView().byId("list");
                list.getModel().refresh();

                this.getView().getModel().submitBatch(); 
            },
            // questo e un commento di prova


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
                var id = oItem.getBindingContext().getProperty("ID_ERRORE"); //prendo l'elemento da selezionare tramite id nella master page
                // console.log(id);
                this.getView().byId("detail").bindElement({ path: "/Anagrafica_Errori/" + id });//lo sparo dritto nella detail page
            },

            onListSort: function (oEvent) {
                var oList = this.byId("list"),
                    oBinding = oList.getBinding("items");

                var sSortKey = "ID_ERRORE";
                this.bDescending = !this.bDescending; //switches the boolean back and forth from ascending to descending
                var bGroup = false;
                var aSorter = [];

                aSorter.push(
                    new sap.ui.model.Sorter(sSortKey, this.bDescending, bGroup)
                );
                oBinding.sort(aSorter);
            },

            onSearch: function (oEvent) {
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();

                console.log(sQuery);

                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter(
                        "ID_ERRORE",
                        FilterOperator.EQ,
                        sQuery,

                    );
                    aFilters.push(filter);
                }
                //update list binding
                var oList = this.byId("list");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },

            //  // onSearch: function (oEvt) {

            // //     var sQuery = oEvt.getParameter("query"),


            // //         aFilter = [new Filter({
            // //             path: "ID_ERRORE_ID_ERRORE",
            // //             operator: FilterOperator.EQ,
            // //             value: sQuery,
            // //             caseSensitive: false
            // //         }),

            // //         ],
            // //         oTable = this.byId("list"),
            // //         oBinding = oTable.getBinding("items"),
            // //         oFilter = null;
            // //     if (sQuery.length != 0) {
            // //         oFilter = new Filter({
            // //             filters: aFilter,
            // //             and: false
            // //         });
            // //     }
            // //     oBinding.filter(oFilter);
            // // },

            onUpdateFinished: function (oEvent) {
                var oList = oEvent.getSource();
                var aItems = oList.getItems();
                //oList.setSelectedItem(aItems[0], true);
                aItems[0].setSelected(true);
                aItems[0].firePress();
            },

            onDefaultMessageDialogPress: function () {
                if (!this.oDefaultMessageDialog) {
                    this.oDefaultMessageDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Default Message",
                        content: new Text({ text: "Build enterprise-ready web applications, responsive to all devices and running on the browser of your choice. That's OpenUI5." }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.oDefaultMessageDialog.close();
                            }.bind(this)
                        })
                    });
                }

            },

            showLegend: function(oEvent){
                mostralegenda=!mostralegenda
                this.getView().byId("pannello").setVisible(mostralegenda);

            }

        });
    });