sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v4/ODataModel",
    'sap/ui/core/message/ControlMessageProcessor',
    'sap/ui/core/message/Message',
    'sap/ui/core/library',
    'sap/m/MessagePopover',
    'sap/m/MessagePopoverItem',
    "sap/ui/core/Core",
    "./Utils",
    "sap/ushell/services/URLParsing"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, UIComponent, Filter, FilterOperator, FilterType, formatter, JSONModel,MessageBox, ODataModel) {
        "use strict";
        
        var max_Utente_flusso = 0;
        var myData = [];
        var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";

        return Controller.extend("tileproject.tileproject.controller.tile", {
            formatter: formatter,

            onInit: function () {

                var dataModel = this.getOwnerComponent().getModel("model/flussi.json");
                this.getView().setModel(dataModel, "flussiModel");

                // var list = {
                //     id: "ID_UTENTE"
                // }

                // var oModel = new JSONModel(list);
                // this.getView().setModel(oModel, "listModel");

                var modelloJSON = new JSONModel;
                //  this.UtenteFlussoModel(modelloJSON);
                this.getView().setModel(modelloJSON, "UtenteFlusso");

                // francesco
                this.getRouter().attachRouteMatched(this.onRouteMatched, this);

                //Alessio
                this.getView().getModel("UtenteFlusso").setProperty("/UtentiFlussiSelezionati", []);
                this.getView().getModel("UtenteFlusso").setProperty("/simple_form", []);



            },

            onSort: function (oEvent) {
                var oList = this.byId("tableUtentiFlussi"),
                    oBinding = oList.getBinding("items");

                var sSortKey = "ID_UTENTE_FLUSSO";
                this.bDescending = !this.bDescending; //switches the boolean back and forth from ascending to descending
                var bGroup = false;
                var aSorter = [];

                aSorter.push(
                    new sap.ui.model.Sorter(sSortKey, this.bDescending, bGroup)
                );
                oBinding.sort(aSorter);
            },

            // onSearch: function (oEvent) {
            //     // add filter for search
            //     var aFilters = [];
            //     var sQuery = oEvent.getSource().getValue();

            //     if (sQuery && sQuery.length > 0) {

            //         aFilters = new Filter({
            //             filters: [
            //                 new Filter({ path: "ID_UTENTE_FLUSSO", operator: sap.ui.model.FilterOperator.EQ, value1: sQuery, caseSensitive: false }),
            //                 // new Filter({ path: "ID_FLUSSO", operator: sap.ui.model.FilterOperator.Contains, value1: sQuery, caseSensitive: false })

            //             ],
            //             and: false,
            //         });
            //     }

            //     // update list binding
            //     this._oBindList = new sap.m.List({
            //         items: {
            //             path: "/Anagrafica_Utente_Flusso",
            //             // parameters: {
            //             //     $$operationMode: "Server",
            //             //     $$updateGroupId: "SOME_GROUP"
            //             // },
            //             // length: 1,
            //             template: oItemTemplate
            //         }
            //     });

            //     this.getView().addDependent(this._oBindList);

            //     var items=this._oBindList.getBinding("items");

            //     var oList = this.byId("tableUtentiFlussi");
            //     var oBinding = oList.items;
            //     oBinding.filter(aFilters, "Application");
            // },



            onRouteMatched: function (oEvent) {
                console.info('oEvent', oEvent);
                var oParameters = oEvent.getParameters();

                var oView = this.getView();
                var oModel = oView.getModel();
                var UtenteFlussoModel = oView.getModel("UtenteFlusso");
                UtenteFlussoModel.setProperty("/UtentiFlussi", []);

                var table = this.byId("tableUtentiFlussi");
                //table.setModel(UtenteFlussoModel, "UtenteFlusso");
                var obj;

                jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function () {

                    /*oModel.read("/Anagrafica_Utente_Flusso", {
                      //  filters: aFilters,
                        success: function (oData, oResponse) {
                            var myData = [];
                            for (var i = 0; i < oData.results.length; i++) {
                                var obj = oData.results[i];
                                obj.visibleSave = false;
                                if (oData.results[i].Attivo) {
                                    obj.visibleEdit = true;
                                } else {
                                    obj.visibleEdit = false;
                                }
                                obj.visibleUndo = false;
                                myData.push(obj);
                            }
                         
                            sap.ui.getCore().getModel("UtenteFlusso").setProperty("/UtentiFlussi", myData);
                            //tableDestinazione.bindItems("UtenteFlusso>/UtentiFlussi", oItems);
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function (response) {
                            // var errDetails = response.message;
                            // MessageBox.error(errDetails);
                            UtenteFlussoModel.setProperty("/Destinazione", []);
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });*/

                    // $.get({
                    // jQuery.get({
                    jQuery.ajax({
                        url: "/CatalogService/Anagrafica_Utente_Flusso",
                        success: function (oData, oResponse) {
                            // var myData = oData.value;
                            var myData = [];
                            for (var i = 0; i < oData.value.length; i++) {
                                obj = oData.value[i];

                                jQuery.ajax({
                                    url: "/CatalogService/Anagrafica_Flussi(" + obj.ID_FLUSSO_ID_FLUSSO + ")",
                                    success: function (oData, oResponse) {
                                        obj.descrFlusso = oData.NOME_FLUSSO; // "prova descrizione flusso";
                                    },
                                    error: function (error) {
                                        // UtenteFlussoModel.setProperty("/UtentiFlussi", []);
                                    },
                                    async: false
                                });

                                jQuery.ajax({
                                    url: "/CatalogService/Anagrafica_Utenti(" + obj.ID_UTENTE_ID_UTENTE + ")",
                                    success: function (oData, oResponse) {
                                        obj.descrUtente = oData.COGNOME_UTENTE + " " + oData.NOME_UTENTE; // "utente utente";
                                        obj.emailUtente = oData.EMAIL_UTENTE;
                                    },
                                    error: function (error) {
                                        // UtenteFlussoModel.setProperty("/UtentiFlussi", []);
                                    },
                                    async: false
                                });

                                myData.push(obj);
                            }
                            UtenteFlussoModel.setProperty("/UtentiFlussi", myData);
                            //tableDestinazione.bindItems("UtenteFlusso>/UtentiFlussi", oItems);
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function (error) {
                            UtenteFlussoModel.setProperty("/UtentiFlussi", []);
                            sap.ui.core.BusyIndicator.hide();
                        },
                        async: false
                    });

                }, this));

            },

            getRouter: function () {
                return UIComponent.getRouterFor(this);

            },

            vaiADnD: function () {
                this.getRouter().navTo("RouteDnD");
            },

            vaiHome: function () {
                window.history.go(-1)
            },

            onSearch: function (oEvt) {
                var sQuery = oEvt.getParameter("query"),
                    aFilter = [new Filter("id", FilterOperator.Contains, sQuery),
                    new Filter("nome", FilterOperator.Contains, sQuery),
                    new Filter("cognome", FilterOperator.Contains, sQuery),
                    new Filter("flusso", FilterOperator.Contains, sQuery),
                    ],
                    oTable = this.byId("tableUtentiFlussi"),
                    oBinding = oTable.getBinding("items"),
                    oFilter = null;
                if (sQuery.length != 0) {
                    oFilter = new Filter({
                        filters: aFilter,
                        and: false
                    });
                }
                oBinding.filter(oFilter);
            },

            vaiAlDettaglio: function (oEvent) {

                var oSource = oEvent.getSource(),
                    oContext = oSource.getBindingContext("flussiModel"),
                    yes = oContext.getPath(),
                    cliente = oContext.getProperty("id");
                this.getRouter().navTo("RouteDnD", {
                    selectedobj: cliente
                });
            },



            add: function () {
                var View = this.getView();
                var frag = View.byId("addUtenteFlussoFragment");
                if (!frag) {
                    frag = sap.ui.xmlfragment(View.getId(), "tileproject.tileproject.view.fragment.addUtenteFlusso", this);
                    View.addDependent(frag)
                }
                frag.open();
            },

            onSaveAddFragment: function name(params) {
                var flusso = parseInt(this.getView().byId("selectFlusso").getSelectedKey());
                var utente = parseInt(this.getView().byId("selectUtente").getSelectedKey());
                var idUtenteFlusso = parseInt(this.getView().byId("idUtenteFlusso").getValue());

                var oItemTemplate = new sap.m.ColumnListItem();
                this._oBindList = new sap.m.List({
                    items: {
                        path: "/Anagrafica_Utente_Flusso",
                        // parameters: {
                        //     $$operationMode: "Server",
                        //     $$updateGroupId: "SOME_GROUP"
                        // },
                        // length: 1,
                        template: oItemTemplate
                    }
                });

                this.getView().addDependent(this._oBindList);

                var oContext = this._oBindList.getBinding("items").create({
                    ID_UTENTE_FLUSSO: idUtenteFlusso,
                    ID_FLUSSO_ID_FLUSSO: flusso,
                    ID_UTENTE_ID_UTENTE: utente

                });

                oContext.created().then(function () {
                    MessageToast.show("Creazione avvenuta con successo")
                }, function (oError) {
                    MessageToast.show("Creazione fallita")
                });

                var oView = this.getView();

                function resetBusy() {
                    oView.setBusy(false);
                }

                oView.setBusy(true);

                oView.getModel().submitBatch(oView.getModel().getUpdateGroupId()).then(resetBusy, resetBusy);

                this.byId("addUtenteFlussoFragment").close();
                // this.onResetDialogDest();

                this.byId(tableUtentiFlussi).getModel().refresh();




            },
            onCloseDialogAddFragment2: function () {
                this.byId("addUtenteFlussoFragment").close();
                //this.onResetDialogDest();
            },

            onCloseDialogAddFragment: function () {
                var oView = self.getView()
                var oDialog = oView.byId('addUtenteFlussoFragment');


                oDialog.close();
                oDialog.destroy();
            },

            // add: function () {
            //     //to add a new row
            //     var oItem = new sap.m.ColumnListItem({
            //         cells: [new sap.m.List({
            //             items:"{/Anagrafica_Utenti}"
            //         })
            //      ]
            //     });

            //     var oTable = this.getView().byId("tableUtentiFlussi");
            //     oTable.addItem(oItem);
            // },
            //             add:function (){
            //                 //to add a new row
            // var oItem = new sap.m.ColumnListItem({
            // cells: [new sap.m.ActionSelect("actionselect",new sap.ui.core.Item("items",new sap.ui.core.CustomData("customdata",{key:"ID_FLUSSO" ,text:"ID_FLUSSO"})),{items:"/Anagrafica_Flussi"})
            // ,new sap.m.Button({
            //  icon: "sap-icon://delete",
            //  type: "Reject",
            //  press: [this.remove, this]
            // })]
            // });

            // var oTable = this.getView().byId("tableUtentiFlussi");
            // var model=this.getView().getModel();
            // oTable.setModel(model);
            // oTable.addItem(oItem);
            // },



            // onConfirmationMessageBoxPress: function (MessageBox) {
            //     var flusso = this.getView().byId("id_Flusso").getSelectedKey();
            //     var utente = this.getView().byId("idUtenti").getSelectedKey();
            //     var oContext = this.getView().byId("table2").getBindingContext();
            //     var ans;
            //     // this is required since there is no direct access to the box's icons like MessageBox.Icon.WARNING
            //     jQuery.sap.require("sap.ui.commons.MessageBox");
            //     // open a fully configured message box
            //     sap.ui.commons.MessageBox.show(
            //         "vuoi salvare i dati in tabella?",
            //         sap.ui.commons.MessageBox.Icon.WARNING,
            //         "Salva dati in tabella",
            //         [sap.ui.commons.MessageBox.Action.YES, sap.ui.commons.MessageBox.Action.NO],
            //        ans= sap.ui.commons.MessageBox.Action.YES);
            //         if(ans==='YES'){
            //             oContext.setProperty("ID_FLUSSO_ID_FLUSSO", flusso);
            //             oContext.setProperty("ID_UTENTE_ID_UTENTE", utente);
            //             var list = this.getView().byId("items");
            //             list.getModel();
            //             //scrittura sull'odata
            //             this.getView().getModel().submitBatch();

            //         }


            // },

            // salva: function (oEvent) {
            //     console.log('AAJ');
            //     var flusso = this.getView().byId("id_Flusso").getSelectedKey();
            //     var utente = this.getView().byId("idUtenti").getSelectedKey();
            //     var oContext = this.getView().byId("table2").getBindingContext();
            //     oContext.setProperty("ID_FLUSSO_ID_FLUSSO", flusso);
            //     oContext.setProperty("ID_UTENTE_ID_UTENTE", utente);
            //     var list = this.getView().byId("items");
            //     list.getModel();
            //     //scrittura sull'odata
            //     this.getView().getModel().submitBatch();
            // },

            save: function () {
                var flusso = this.getView().byId("id_Flusso").getSelectedKey();
                var utente = this.getView().byId("idUtenti").getSelectedKey();
                // var ID_UTENTE_FLUSSO = this.getView().byId("ID_UTENTE_FLUSSO").getSelectedKey();
                // var descrUtente = this.getView().byId("descrUtente").getSelectedKey();
                // var descrFlusso = this.getView().byId("descrFlusso").getSelectedKey();

                var oContext = this.getView().byId("table2").getBindingContext();
                // console.log('pippo');
                //     oContext.setProperty("ID_FLUSSO_ID_FLUSSO", flusso);
                //     oContext.setProperty("ID_UTENTE_ID_UTENTE", utente);
                //     var list = this.getView().byId("items");
                //     list.getModel();
                //     this.getView().getModel().submitBatch();
                ////////////////////////////////////////////////////////////
                // var oData = {
                //     ID_FLUSSO_ID_FLUSSO: flusso,
                //     ID_UTENTE_ID_UTENTE: utente

                // }
                // this.getView().getModel("UtenteFlusso").getProperty("/CatalogService/Anagrafica_Utente_Flusso").push(oData);
                // this.getRouter().navTo("/CatalogService/Anagrafica_Utente_Flusso");
                // var oModel = new sap.ui.model.odata.v4.ODataModel();
                // this.getView().setModel(oModel);



                var oModel = this.getView().getModel();

                // oModel.create("/Anagrafica_Utente_Flusso", oData);

                var msg = 'Utente salvato correttamente';
                MessageToast.show(msg);
                this.getRouter().navTo("/CatalogService/Anagrafica_Utente_Flusso");


                var oContext = this.getView().byId("list").setBinding("items").create({
                    ID_UTENTE_ID_UTENTE: utente,
                    ID_FLUSSO_ID_FLUSSO: flusso,
                    ID_UTENTE_FLUSSO: ID_UTENTE_FLUSSO,
                });

                // Note: This promise fails only if the transient entity is deleted
                oContext.created().then(function () {
                    MessageToast.show("Creazione avvenuta con successo")
                }, function (oError) {
                    MessageToast.show("Creazione fallita")
                });
                this.getView().getModel("UtenteFlusso").getProperty("/CatalogService/Anagrafica_Utente_Flusso").push(oContext);
                this.getView().getModel().submitBatch();
            },

            associazione: function (oEvent) {

                //onRouteMatched(oEvent);

                var flussoSel = this.getView().byId("id_Flusso").getProperty('selectedKey');
                var utenteSelezionato = this.getView().byId("idUtenti").getProperty('selectedKey');
                


                var UtenteFlussoModel = this.getView().getModel('UtenteFlusso');
                var prova = this.getView().getModel('UtenteFlusso');
                myData = [];

                var arr = UtenteFlussoModel.getProperty("/UtentiFlussi");
                var obj;

                for (let i = 0; i < arr.length; i++) {
                    obj = arr[i];
                    // var ruoloNumerico = UtenteFlussoRuolo.getProperty();
                    if (flussoSel == obj.ID_FLUSSO_ID_FLUSSO &&
                        obj.ID_UTENTE_ID_UTENTE == utenteSelezionato) {
                        myData.push(obj);
                    }
                }

                if(myData.length>0){
                    this.byId('id_utente_flusso').setProperty('visible',false);
                }else{
                    this.byId('id_utente_flusso').setProperty('visible',true);
                    // this.getView().byId("id").setText(utenteSelezionato);
                    // var COGNOME_UTENTE = this.getView().byId("cognome").setProperty(cognome);
                    // var NOME_UTENTE = this.getView().byId("nome").setProperty(nome);
                    // var EMAIL_UTENTE = this.getView().byId("email").setProperty(email);
                    // var ID_FLUSSO_ID_FLUSSO = this.getView().byId("id_flusso").setProperty(id_flusso);
                    // var NOME_FLUSSO = this.getView().byId("NOME_FLUSSO").setProperty(nome_flusso);
                    // var DESC_FLUSSO = this.getView().byId("DESCRIZIONE_FLUSSO").setProperty(DESCRIZIONE_FLUSSO);
                }


                UtenteFlussoModel.setProperty("/UtentiFlussiSelezionati", myData);
                //tableDestinazione.bindItems("UtenteFlusso>/UtentiFlussi", oItems);
                sap.ui.core.BusyIndicator.hide();
                this.getView().getModel("UtenteFlusso").setProperty(myData, "/UtentiFlussiSelezionati");
                //this.byId("table2").getBinding("items").refresh();



            },

            crea_associazione: function () {

                var UtenteFlussoModel = this.getView().getModel('UtenteFlusso');
                var UtenteModel = this.getView().getModel('AnagraficaUtenti');
                var arr = UtenteFlussoModel.getProperty("/UtentiFlussiSelezionati");
                // var arr_Ut = UtenteModel.getProperty("/Anagrafica_Utenti");
                var flussoSel = this.getView().byId("id_Flusso").getProperty('selectedKey');
                console.log(arr);
                var input_id = parseInt(this.getView().byId("id_utente_flusso").getValue());
                // this.byId('simple_form').setProperty('visible',true);

                var cognome;
                var nome;
                var id_flusso;
                var email;
                var nome_flusso;
                var DESCRIZIONE_FLUSSO;
                let ut;
                let max_Utente_flusso = 0;
                var utenteSelezionato = this.getView().byId("idUtenti").getProperty('selectedKey');
                

                for (let i = 0; i < arr.length; i++) {

                    // var ruoloNumerico = UtenteFlussoRuolo.getProperty();
                    if (flussoSel == arr[i].ID_FLUSSO&&arr[i].ID_UTENTE == utenteSelezionato) {
                        console.log(arr[i].ID_FLUSSO);
                        id_flusso = flussoSel;
                        nome_flusso = arr[i].NOME_FLUSSO;
                        DESCRIZIONE_FLUSSO = arr[i].DESCRIZIONE_FLUSSO;
                        ut = arr[i].ID_UTENTE_FLUSSO

                    }

                    if (max_Utente_flusso > arr[i].ID_UTENTE_FLUSSO) {
                        max_Utente_flusso = arr[i].ID_UTENTE_FLUSSO;
                    }
                }
                max_Utente_flusso += 1;
                
                // for (let i = 0; i < arr_Ut.length; i++) {
                //     if (arr[i].ID_UTENTE == utenteSelezionato) {
                //         cognome = arr_Ut[i].COGNOME_UTENTE;
                //         nome = arr_Ut[i].NOME_UTENTE;
                //         email = arr_Ut[i].EMAIL_UTENTE;

                //     }
                // }

               


                    var oModel = this.getView().getModel();
                    var oList = oModel.bindList("/Anagrafica_Utente_Flusso");
                    var oContext = oList.create(
                        {
                            ID_UTENTE_FLUSSO: input_id,
                            ID_UTENTE_ID_UTENTE: parseInt(utenteSelezionato),
                            ID_FLUSSO_ID_FLUSSO: parseInt(flussoSel),
                        }
                    );




                // Note: This promise fails only if the transient entity is deleted
                oContext.created().then(function () {
                    alert("ok")
                }, function (oError) {
                    alert("fail")
                });
                this.getView().getModel().submitBatch();


            },


        });
    });