sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "../model/formatter",
    "sap/ui/model/FilterType",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Sorter, formatter, FilterType,MessageToast) {
        "use strict";

        return Controller.extend("mfctechnical.controller.technical", {
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
                // this.getView().byId("selectStatoErrore").setVisible(true);
                this.getView().byId("statoerrore").setVisible(false);
                this.getView().byId("saveBtn").setVisible(true);
                this.getView().byId("editBtn").setVisible(false);
                this.getView().byId("statoErroreSwitch").setVisible(true);


            },


            save: function () {
                this.getView().byId("saveBtn").setVisible(false);
                this.getView().byId("editBtn").setVisible(true);
                this.getView().byId("statoerrore").setVisible(true);
                this.getView().byId("statoErroreSwitch").setVisible(false);

              

                var oContext = this.getView().byId("detail").getBindingContext();
                var statoErroreSwitch = this.getView().byId("statoErroreSwitch").getState();



                if (statoErroreSwitch == true) {
                    var msg = 'L errore è stato risolto e rimandato allapp del consumer';
                    MessageToast.show(msg);
                    
                    this.getView().byId("id").setValue("");
                    this.getView().byId("nomeFlusso").setValue("");
                    this.getView().byId("statoerrore").setValue("");
                    this.getView().byId("messaggio").setValue("");
                    this.getView().byId("data").setText("");

                    oContext.setProperty("ID_STATO_ERRORE_ID_STATO_ERRORE", 3);


                

                    var list = this.getView().byId("list");
                    list.getModel().refresh();
                    

                   


                    this.getView().getModel().submitBatch();
                } else {

                }
                
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
              
                //update list binding
                // var oList = this.byId("list"); 
                // var oBinding = oList.getBinding("items");
                // oBinding.filter(aFilters, "Application");

                // var aFilters = [];
                // var sQuery = oEvent.getSource().getValue();
    
                // if (sQuery && sQuery.length > 0) {
    
                //     aFilters = new Filter({
                //         filters: [
                //             new Filter({ path: "ID_STATO_ERRORE_ID_STATO_ERRORE", operator: sap.ui.model.FilterOperator.Contains, value1: 2, caseSensitive: false }),
                //             // new Filter({ path: "ID_FLUSSO", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery, caseSensitive: false })
                //             new Filter({ path: "ID_ERRORE", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery, caseSensitive: false }),

    
                //         ],
                //         and: false,
                //     });
                // };

                var onlyTechnicalFilter = new Filter(
                    "ID_STATO_ERRORE_ID_STATO_ERRORE",
                    FilterOperator.EQ,
                    '2'
                );

                aFilters.push(onlyTechnicalFilter);
             } 
             
             else {
                var onlyTechnicalFilter= new Filter(
                    "ID_STATO_ERRORE_ID_STATO_ERRORE",
                    FilterOperator.EQ,
                    '2'
                );
                aFilters.push(onlyTechnicalFilter);
             }
             
                //    update list binding
                var oList = this.byId("list"); 
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
                
            },
            
            onUpdateFinished: function (oEvent) {
                var oList = oEvent.getSource();
                var aItems = oList.getItems();
                oList.setSelectedItem(aItems[0], true);
                aItems[0].setSelected(true);
                aItems[0].firePress();
            },
         

            //  onSearch: function (oEvt) {

            //     var sQuery = oEvent.getSource().getValue();


            //         aFilter = [new Filter({
            //             path: "ID_ERRORE_ID_ERRORE",
            //             operator: FilterOperator.EQ,
            //             value: sQuery,
            //             caseSensitive: false
            //         }),

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

        });
    });
