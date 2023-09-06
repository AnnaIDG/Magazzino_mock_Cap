jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.TechPlaceModel");

jQuery.sap.require("utils.Formatter");

controller.AbstractController.extend("controller.RfidLoader", {
    /**
     * @memberOf controller.RfidLoader
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        //
        this.rfidLoaderModel = new sap.ui.model.json.JSONModel();
        this.rfidLoaderModel.setSizeLimit(2500);
        this.getView().setModel(this.rfidLoaderModel, "rfidLoaderModel");

        this.rfidFilterModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.rfidFilterModel, "rfidFilterModel");

        this.listTypeModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.listTypeModel, "listTypeModel");
        //
        this.getView().removeStyleClass("logoBackground");
        //
        this.uiModel.setProperty("/backButton", false);
    },

    handleRouteMatched: function (evt) {
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        //
        if (!this._checkRoute(evt, "rfidLoader"))
            return;
        //

        this.fathersTechplaces = [];
        this.fathersEquipments = [];
        this.listTypes = {
            "results": []
        };
        var techPlaceTab = {
            "name": this._getLocaleText("techPlaceLabel"),
            "key": "FL",
            "icon": "sap-icon://building"
        };
        var equipmentTab = {
            "name": this._getLocaleText("equipmentLabel"),
            "key": "EQ",
            "icon": "sap-icon://product"

        };
//        var user = model.service.LocalStorageService.session.get("userLogged");
//        if (user.rfidEquiUpdate === "X" && user.rfidFnclocUpdate === "X") {
            this.listTypes.results.push(techPlaceTab);
            this.listTypes.results.push(equipmentTab);
//        } else if (user.rfidEquiUpdate === "X" && user.rfidFnclocUpdate === "") {
//            this.listTypes.results.push(equipmentTab);
//        } else if (user.rfidEquiUpdate === "" && user.rfidFnclocUpdate === "X") {
//            this.listTypes.results.push(techPlaceTab);
//        }
        this.listTypeModel.setData(this.listTypes);
        this.rfidLoaderModel.setProperty("/listType", "FL");
        this.refreshList();

        // this._refreshList();

        this._initializeFilter();


        //        $(document).scannerDetection({
        //            onComplete: function (barcode) {
        //                if (window.location.hash.indexOf("noticeCreate") !== -1) {
        //                    this._detectRFID(barcode);
        //                }
        //            }.bind(this),
        //            onError: function (barcode) {
        //                // DO NOTHING
        //            }.bind(this)
        //        });
        if (this.rfidCell) {
            this.rfidCell.removeStyleClass("classBorderItemSelected");
        }
    },

    // --------------Initializing View
    // ---------------------------------------------
    refreshList: function () {

        // To check, maybe tachPlaceHierarchy params should be cleared in the
        // launchpad
        this.techPlaceHierarchy = model.service.LocalStorageService.session.get("techPlaceHierarchy") ? model.service.LocalStorageService.session.get("techPlaceHierarchy") : [];
        var reqFL = (this.techPlaceHierarchy.length > 0) ? {
            supTechPlace: this.techPlaceHierarchy[this.techPlaceHierarchy.length - 1]
        } : "";
        // -------------------------------------------------
        // **
        this.equipmentHierarchy = model.service.LocalStorageService.session.get("equipmentHierarchy") ? model.service.LocalStorageService.session.get("equipmentHierarchy") : [];
        if (this.equipmentHierarchy) {
            var reqE = (this.equipmentHierarchy.length > 0) ? this.equipmentHierarchy[this.equipmentHierarchy.length - 1] : "";
        }

        var isEquipment = (this.rfidLoaderModel.getProperty("/listType") == "EQ");
        var req = isEquipment ? reqE : reqFL
            // **
        var f = _.bind(this._loadTechPlaces, this);

        // this._loadTechPlaces(req, isEquipment).then(f);
        this._loadTechPlaces(req, isEquipment);

        this._applyFilter({}, undefined);
        this._initializeFilter();
    },

    _loadTechPlaces: function (params, equip) {
        var defer = Q.defer();
        this.equip = equip;

        this.getView().setBusy(true);

        var fSuccess = function (res) {

            this.getView().setBusy(false);

            this.rfidLoaderModel.setProperty("/results", res);
            if (this.equip) {
                this.rfidLoaderModel.setProperty("/backButton", this.equipmentHierarchy.length > 0);
                model.service.LocalStorageService.session.save("equipmentHierarchy", this.equipmentHierarchy);
                this.uiModel.setProperty("/backButton", (this.equipmentHierarchy.length > 0));
            } else {
                this.rfidLoaderModel.setProperty("/backButton", this.techPlaceHierarchy.length > 0);
                model.service.LocalStorageService.session.save("techPlaceHierarchy", this.techPlaceHierarchy);
                this.uiModel.setProperty("/backButton", (this.techPlaceHierarchy.length > 0));
            }
            this.rfidLoaderModel.refresh();
            this.uiModel.refresh();
            if (this.rfidCell) {
                this.rfidCell.removeStyleClass("classBorderItemSelected");
            }
            defer.resolve();
        };
        fSuccess = _.bind(fSuccess, this);
        var fError = function (err) {

            this.getView().setBusy(false);

            if (!this.equip) {
                this.rfidLoaderModel.setData({
                    "results": []
                });
            }

            sap.m.MessageBox.error(error, {
                title: this._getLocaleText("errorLoadingTechPlaceListMessageBoxTitle")
            });
            defer.reject(err);
        };
        fError = _.bind(fError, this);
        model.TechPlaceModel.getTechPlaces(params, this.equip).then(fSuccess, fError);
        return defer.promise;
    },

    // --------------------------------------------------------------------------------------------------------------

    // ----------------List -
    // Navigation-----------------------------------------------------------------------------

    goToChild: function (evt) {
        // TODO FIXARE
        var icon = evt.getSource();
        var father = icon.getParent().getBindingContext("rfidLoaderModel").getObject();
        // icon.getParent().getParent().getBindingContext().getObject();

        // if (this.enableModel.getData().techPlaceVisible) { //Why?
        if (!father.ultimo) {
            this.techPlaceHierarchy.push(father.id);
            model.service.LocalStorageService.session.save("techPlaceHierarchy", this.techPlaceHierarchy);
            this._loadTechPlaces({
                supTechPlace: father.id
            });
        }
        // }
    }

    ,
    goBackToYourFatherLuke: function (evt) {

        // if (this.enableModel.getData().techPlaceVisible) {
        var lastFather = this.techPlaceHierarchy[this.techPlaceHierarchy.length - 2] ? this.techPlaceHierarchy[this.techPlaceHierarchy.length - 2] : "";
        this.techPlaceHierarchy.pop();
        this._loadTechPlaces({
            supTechPlace: lastFather
        });
        // }
        // else if (this.enableModel.getData().equipmentVisible) {
        // var lastFather =
        // this.equipmentHierarchy[this.equipmentHierarchy.length - 2] ?
        // this.equipmentHierarchy[this.equipmentHierarchy.length - 2] : "";
        // this.equipmentHierarchy.pop();
        // this._loadTechPlaces({
        // supTechPlace: lastFather
        // }, true);
        // }
    },

    onNavBackPress: function () {
        this.router.navTo("launchpad");
    }

    // ----------------------------------------------------------------------------------------------------------------
    // ---------------Filter----------------------------------------------------------------------------------------

    ,
    _initializeFilter: function () {
        this.rfidFilterModel.setProperty("/searchValue", "");
        // this.rfidFilterModel.setProperty("/type", "");
        // this.rfidFilterModel.setProperty("/category", "");
        this.rfidFilterModel.refresh();
    },
    onFilterPress: function (evt) {
        // this.populateSelect(this.selectModels, _.bind(this._openFilterDialog,
        // this));
    },
    onSearch: function (evt) {
        var src = evt.getSource();
        var value = src.getValue();
        var properties = this.equip ? ["id", "description", "descriptionTechPlace"] : ["id", "description"]; // fabio 16/03
        var filterData = {};

        if (value) {

            for (var i = 0; i < properties.length; i++) {
                filterData[properties[i]] = value;
            }
            var options = {
                operator: sap.ui.model.FilterOperator.Contains,
                type: "OR"
            };

        }
        this._applyFilter(filterData, options);
    },
    _openFilterDialog: function () {
        if (!this.filterDialog)
            this.filterDialog = sap.ui.xmlfragment("view.fragment.rfidLoader.RfidFilterDialog", this);

        var page = this.getView().byId("rfidLoaderPageId");
        page.addDependent(this.filterDialog);

        this.filterDialog.open();
    },
    onOKFilterDialogPress: function (evt) {
        this.rfidFilterModel.setProperty("/searchValue", "");
        var filterData = this.rfidFilterModel.getData();

        this._applyFilter(filterData);

        this.filterDialog.close();
    },
    _resetFilter: function () {
        this._initializeFilter();

        var filterData = this.rfidFilterModel.getData();
        this._applyFilter(filterData);
    },
    _applyFilter: function (data, options) {

        var tableName = (this.rfidLoaderModel.getProperty("/listType") == "EQ") ? "rfidLoaderEquipmentTable" : "rfidLoaderTechPlaceTable";
        var list = this.getView().byId(tableName);
        list.getBinding("items").filter();
        var filters = [];
        var filterOperator = sap.ui.model.FilterOperator.EQ;
        var andBool = true;
        if (options) {
            if (options.operator)
                filterOperator = options.operator;
            if (options.type)
                andBool = (options.type == "OR") ? false : true;
        }

        for (var prop in data) {
            if (data[prop]) {
                var filter = new sap.ui.model.Filter(prop, filterOperator, data[prop]);
                filters.push(filter);
            }
        }
        if (filters && filters.length > 0)
            list.getBinding("items").filter(new sap.ui.model.Filter({
                filters: filters,
                and: andBool
            }));
    },

    onResetFilterDialogPress: function () {
        this._resetFilter();
        // this.filterDialog.close();
    },

    onCancelFilterDialogPress: function (evt) {
        this._resetFilter();
        this.filterDialog.close();
    },
    // ------------------------------------------------------------------------------------------------------------------------

    // ------------------------Rfid
    // Association------------------------------------------------------------

    onBindRfidBtnPress: function (evt) {
        var src = evt.getSource();
        var row = src.getParent();

        //        var items = this.rfidLoaderModel.getData().results;
        //        for (var i = 0; items && i < items.length; i++) {
        //            items[i].rfidEditable = false;
        //        }
        this.rfidLoaderModel.refresh();
        var item = row.getBindingContext("rfidLoaderModel").getObject();
        var itemId = item.id;

        if (item.rfidCode === "") {
            if (this.rfidCell) {
                this.rfidCell.removeStyleClass("classBorderItemSelected");
            }
            //            item.rfidEditable = true;
            this.rfidLoaderModel.refresh();

            var tableName = this.rfidLoaderModel.getProperty("/listType") == "FL" ? "rfidLoaderTechPlaceTable" : "rfidLoaderEquipmentTable";
            var table = tableName ? this.getView().byId(tableName) : null;
            var tableRows = table && table.getAggregation("items") ? table.getAggregation("items") : [];

            var selectedItem = _.find(tableRows, _.bind(function (r) {
                var rfidObj = r.getBindingContext("rfidLoaderModel").getObject();
                return rfidObj.id == itemId;

            }, this));
            if (selectedItem) {
                var cells = selectedItem.mAggregations.cells;
                var rfidCell = cells[3];

                this.item = item;
                this.rfidCell = rfidCell;
                this.rfidCell.addStyleClass("classBorderItemSelected");

                $(document).scannerDetection({
                    onComplete: function (barcode) {
                        if (window.location.hash.indexOf("rfidLoader") !== -1) {
                            if (this.rfidCell.getValue() !== "") {
                                this.troppiRfid = true;
                                sap.m.MessageBox.confirm(this._getLocaleText("troppiRFIDLetti"), {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: _.bind(function (oAction) {
                                        this.rfidCell.setValue("");
                                        this.item.rfidCode = "";
                                        this.rfidLoaderModel.refresh();
                                    }, this)
                                });
                                return;
                            }
                            this.rfidCell.setValue(barcode);

                            var that = this;

                            var rfidConfirmTxt = this._getLocaleText("rfidAssociationConfirm") + ": " + this.item.description + " - " + this.item.rfidCode;
                            var rfidCancelTxt = this._getLocaleText("rfidAssociationCancel");
                            var msgTxt = this.item.rfidCode ? rfidConfirmTxt : rfidCancelTxt;

                            setTimeout(_.bind(function () {
                                if (!this.troppiRfid) {
                                    sap.m.MessageBox.confirm(msgTxt, {
                                        actions: [sap.m.MessageBox.Action.CANCEL, sap.m.MessageBox.Action.OK],
                                        onClose: _.bind(function (oAction) {
                                            if (oAction == "OK") {
                                                this._updateRfid(this.item);
                                            } else
                                                this.item.rfidCode = "";
                                                this.rfidLoaderModel.refresh();
                                        }, this)
                                    });
                                }
                            }, this), 1000);
                        }
                    }.bind(this),
                    onError: function (barcode) {
                        // DO NOTHING
                    }.bind(this)
                });
            }
        } else {

        }
    },

    onCancelRfid: function (evt) {
        var src = evt.getSource();
        var row = src.getParent();
        var item = row.getBindingContext("rfidLoaderModel").getObject();

        var rfidCancelTxt = this._getLocaleText("rfidAssociationCancel");
        var msgTxt = rfidCancelTxt;

        var that = this;

        sap.m.MessageBox.confirm(msgTxt, {
            actions: [sap.m.MessageBox.Action.CANCEL, sap.m.MessageBox.Action.OK],
            onClose: _.bind(function (oAction) {
                if (oAction == "OK") {
                    var rfidObj = _.cloneDeep(item);
                    rfidObj.rfidCode = "";
                    this._updateRfid(rfidObj);
                }
            }, that)
        });
    },

    onRfidInput: function (evt) {
        var src = evt.getSource();
        src.setEditable(false);

        var ctx = src.getBindingContext("rfidLoaderModel").getObject();
        this.src = src;
        var that = this;

        var rfidConfirmTxt = this._getLocaleText("rfidAssociationConfirm") + ": " + ctx.description + " - " + ctx.rfidCode;
        var rfidCancelTxt = this._getLocaleText("rfidAssociationCancel");
        var msgTxt = ctx.rfidCode ? rfidConfirmTxt : rfidCancelTxt;

        sap.m.MessageBox.confirm(msgTxt, {
            actions: [sap.m.MessageBox.Action.CANCEL, sap.m.MessageBox.Action.OK],
            onClose: _.bind(function (oAction) {
                if (oAction == "OK") {
                    that._updateRfid(ctx);
                } else
                    that.src.setValue("");
                    that.rfidLoaderModel.refresh();
            }, that)
        });

    },

    _updateRfid: function (rfid) {

        this.getView().setBusy(true);
        var isEquipment = (this.rfidLoaderModel.getProperty("/listType") == "EQ");

        var fSuccess = function (res) {
            this.getView().setBusy(false);
            this.refreshList();
            sap.m.MessageToast.show(this._getLocaleText("rfidAssociationSuccessMessageToast"), {
                duration: 1000
            });
        };
        fSuccess = _.bind(fSuccess, this);

        var fError = function (err) {
            this.getView().setBusy(false);
            if (err.indexOf("PM/022") !== -1) {
                if (this.rfidCell) {
                    this.rfidCell.setValue("");
                    if (this.item) {
                        this.item.rfidCode = "";
                    }
                    this.rfidLoaderModel.refresh();
                } else if (this.src) {
                    this.src.setValue("");
                    if (this.item) {
                        this.item.rfidCode = "";
                    }
                    this.rfidLoaderModel.refresh();
                }
            }
            sap.m.MessageBox.error(err, {
                title: this._getLocaleText("errorSettingRfidMessageBoxTitle"),
                onClose: _.bind(function () {
                    this.item.rfidCode = "";
                    this.rfidLoaderModel.refresh();
                }, this)
            });
            
        };
        fError = _.bind(fError, this);

        model.TechPlaceModel.assignRfid(rfid, isEquipment).then(fSuccess, fError);
    },

    // -----------------------------------------------------------------------------------------------------------


});