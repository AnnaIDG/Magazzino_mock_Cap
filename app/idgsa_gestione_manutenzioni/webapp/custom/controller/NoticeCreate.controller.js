jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.NoticeModel");
jQuery.sap.require("model.NoticeStateModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("utils.Collections");
jQuery.sap.require("model.InterventionDatesModel");
jQuery.sap.require("model.TechPlaceModel");
jQuery.sap.require("model.ObjectsModel");
jQuery.sap.require("model.NoticeModel");
jQuery.sap.require("controller.AbstractNotice");
jQuery.sap.require("model.PartnersModel");
controller.AbstractNotice.extend("controller.NoticeCreate", {
    /**
     * @memberOf controller.NoticeCreate
     */
    onInit: function () {
        // controller.AbstractController.prototype.onInit.apply(this,
        // arguments);
        controller.AbstractNotice.prototype.onInit.apply(this, arguments);
        // this.mainModel = this.mainModel;
        this.getView().setModel(this.mainModel, "mainModel");
        // this.mainModel.setProperty("/noticeState", "");
        this.interventionDatesModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.interventionDatesModel, "inteventionDatesModel");
        this.page = "noticeCreatePageId";
        this.mainModelName = "mainModel";
        this.techPlaceModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.techPlaceModel, "techPlaces");
        this.equipmentsModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.equipmentsModel, "equipments");
        this.partnersModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.partnersModel, "reqUser");
        this.requesterUser = undefined;

        this.serverModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.serverModel, "serverModel");
    },
    handleRouteMatched: function (evt) {
        //
        if (!this._checkRoute(evt, "noticeCreate"))
            return;
        controller.AbstractNotice.prototype.handleRouteMatched.apply(this, arguments);

        //
        this.uiModel.setProperty("/multiComboVisible", false);
        this.uiModel.setProperty("/problemsListTabVisible", false);
        this.uiModel.setProperty("/taskListTabVisible", false);
        this._selectFirstIconTab("idIconTabBarMultiCreate");
        this.getView().byId("txtAreaId").setValueState("None");
        this.getView().byId("techPlaces").setValueState("None");
        this.getView().byId("equipment").setValueState("None");
        this.mainModel.getData().techPlaceId = "";
        this.mainModel.getData().equipmentId = "";
        //commentato per mock
        //this.getCatalog();
        // **
        // var arrayList =
        // model.service.LocalStorageService.session.get("newNoticeArray");
        // if (!arrayList) {
        // model.service.LocalStorageService.session.save("newNoticeArray",
        // []);
        // }

        // model per URL del server
        var url = icms.Component.getMetadata().getManifestEntry("sap.app").dataSources["SERVER"].url;
        this.serverModel.setProperty("/link", url);
        //
        this.fathersTechplaces = [];
        this.fathersEquipments = [];
        this.uiModel.setProperty("/backButtonVisible", true);
        this.uiModel.setProperty("/encodingComboBoxEditable", false);
        this.uiModel.setProperty("/interventionDatesVisible", false);
        this.uiModel.setProperty("/enterEmailFieldVisible", false);
        this.notice = model.NoticeModel.getInstance();
        this.mainModel.setData(this.notice);



        // nascondo le descrizioni dei campi che poi appariranno
        // dinamicamente quando farò una selezione sul radio button
        this.getView().byId("idTechPlaceRadioButton").setSelected(true);
        this.enableModel.setProperty("/techPlaceVisible", true);
        this.enableModel.setProperty("/equipmentVisible", false);
        this.enableModel.setProperty("/rfidVisible", false);
        this._initializeTechPlaceAndEquipmentHierarchy();
        this.getPartnersList();
        // this._initializeEquipmentHierarchy();
        //
        this.populateComboBox();
        //
        this.uiModel.setProperty("/openCloseTaskVisible", false);
        //
        $(document).scannerDetection({
            onComplete: function (barcode) {
                if (window.location.hash.indexOf("noticeCreate") !== -1) {
                    this._detectRFID(barcode);
                }
            }.bind(this),
            onError: function (barcode) {
                // DO NOTHING
            }.bind(this)
        });
        setTimeout(_.bind(this.removeFocus, this), 1000);
    },
    _initializeTechPlaceAndEquipmentHierarchy: function () {
        this.techPlaceHierarchy = model.service.LocalStorageService.session.get("techPlaceHierarchy") ? model.service.LocalStorageService.session.get("techPlaceHierarchy") : [];
        var req = (this.techPlaceHierarchy.length > 0) ? this.techPlaceHierarchy[this.techPlaceHierarchy.length - 1] : "";
        // **
        this.equipmentHierarchy = model.service.LocalStorageService.session.get("equipmentHierarchy") ? model.service.LocalStorageService.session.get("equipmentHierarchy") : [];
        if (this.equipmentHierarchy) {
            var reqE = (this.equipmentHierarchy.length > 0) ? this.equipmentHierarchy[this.equipmentHierarchy.length - 1] : "";
        } else {
            var reqE = "";
        }
        // **
        var f = _.bind(this._loadTechPlaces, this);
        this._loadTechPlaces(req, true).then(f);
    }
    // ,
    // _initializeEquipmentHierarchy: function () {
    // this.equipmentHierarchy =
    // model.service.LocalStorageService.session.get("equipmentHierarchy")
    // ?
    // model.service.LocalStorageService.session.get("equipmentHierarchy")
    // : [];
    // if (this.equipmentHierarchy) {
    // var req = (this.equipmentHierarchy.length > 0) ?
    // this.equipmentHierarchy[this.equipmentHierarchy.length - 1] : "";
    // }
    // else {
    // var req = "";
    // }
    // this._loadTechPlaces(req,true);
    // }

    ,
    _loadTechPlaces: function (params, equip) {
        var defer = Q.defer();
        this.equip = equip;
        // ** per settare il busy sul dialog
        if (!this._valueHelpDialogPlaces) {
            this._valueHelpDialogPlaces = sap.ui.xmlfragment("view.fragment.noticeCreate.PlacesDialog", this);
        }
        this._valueHelpDialogPlaces.setBusy(true);
        // ** per rimuovere l'elemento selezionato
        if (this.listItem) {
            this.listItem.removeSelections();
        }
        // this.techPlaceModel.setProperty("/results", []);
        // this.equipmentsModel.setProperty("/results", []);
        // this.techPlaceModel.refresh();
        // this.equipmentsModel.refresh();
        var fSuccess = function (res) {
            if (!this.equip) {
                this.techPlaceModel.setProperty("/results", res);
                this.techPlaceModel.setProperty("/backButton", this.techPlaceHierarchy.length > 0);
                this.techPlaceModel.refresh();
            } else {
                this.equipmentsModel.setProperty("/results", res);
                this.equipmentsModel.setProperty("/backButton", this.equipmentHierarchy.length > 0);
                this.equipmentsModel.refresh();
            }
            defer.resolve();
            if (this._valueHelpDialogPlaces) {
                this._valueHelpDialogPlaces.setBusy(false);
            }
        }
        fSuccess = _.bind(fSuccess, this);
        var fError = function (err) {
            if (this._valueHelpDialogPlaces) {
                this._valueHelpDialogPlaces.setBusy(false);
            }
            if (!this.equip) {
                this.techPlaceModel.setData({
                    "results": []
                });
            } else {
                this.equipmentsModel.setData({
                    "results": []
                });
            }
            defer.reject(err);
        }
        fError = _.bind(fError, this);
        model.TechPlaceModel.getTechPlaces(params, this.equip).then(fSuccess, fError);
        return defer.promise;
    },
    _handleValueHelpSearch: function (evt) {
        var sValue = evt.getParameter("value");
        var oFilter = new sap.ui.model.Filter({
            path: "nameComplete",
            operator: "Contains",
            value1: sValue
        });
        evt.getSource().getBinding("items").filter([oFilter]);
    },
    _handleValueHelpClose: function (evt) {
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
            this.requestUser = oSelectedItem.getBindingContext().getObject();
            this.mainModel.setProperty("/reqUser", this.requestUser);
            var input = sap.ui.getCore().byId(this.inputValueId);
            input.setValue(oSelectedItem.getTitle());
            if (this.requestUser.user === "PMUTEGEN") {
                this.uiModel.setProperty("/enterEmailFieldVisible", true);
            } else {
                this.uiModel.setProperty("/enterEmailFieldVisible", false);
                // this.mainModel.setProperty("/reqUser", {});
            }
        } else {
            this._setUserRequestes();
            //                this.requesterUser = undefined;
        }
        evt.getSource().getBinding("items").filter([]);
    }
    // , handlePrioritySelectionChange: function (evt) {
    // var src = evt.getSource();
    // var key = src.getSelectedKey();
    // model.InterventionDatesModel.getInterventionDates(key).then(function
    // (result) {
    // this.interventionDatesModel.setData(result);
    // this.mainModel.setProperty("/intervention", result);
    // }.bind(this));
    // this.uiModel.setProperty("/interventionDatesVisible", true);
    // }

    ,

    // funzione lanciata se scrivo a mano la sede tecnica ??
    onTechPlaceChange: function (evt) {
        console.log(evt.getSource());
    },

    onChangeIssueType: function (evt) { },
    onAddIssueOkPress: function () {
        controller.AbstractNotice.prototype.onAddIssueOkPress.apply(this);
        this.mainModel.setProperty("/objectId", undefined);
        this.mainModel.setProperty("/issueTypeId", undefined);
    },
    onAddIssueCancelPress: function (evt) {
        controller.AbstractNotice.prototype.onAddIssueCancelPress.apply(this);
        this.mainModel.setProperty("/issueTypeId", undefined);
        this.mainModel.setProperty("/objectId", undefined);
        this.getView().getModel("issueTypes").getData().issueTypeTextDescription = "";
        this.getView().getModel("issueTypes").refresh();
    },
    onTaskProblemSelectionChange: function (evt) {
        var selectedItem = evt.getParameter("selectedItem").getBindingContext("taskModel").getObject();
        this.taskModel.setProperty("/tasks", this._filterTasks(selectedItem.problemId));
        this.taskModel.setProperty("/task", "");
    },
    _filterProblems: function (object) {
        var problems = this._getCurrentProblems();
        // ---------------------------------------------------------------------
        var filteredProblems = _.filter(problems, _.bind(function (item) {
            return item.objectId == object
        }, this));
        return filteredProblems;
    },
    onTaskStateChange: function (evt) {
        var src = evt.getSource();
        var stateDescr = src.getSelectedItem().getText();
        this.taskModel.setProperty("/stateDescr", stateDescr);
    },
    onRadioButtonPress: function (evt) {
        var idSelectedButton = evt.getParameters().id;
        if (idSelectedButton.indexOf("idTechPlaceRadioButton") >= 0) {
            this.enableModel.setProperty("/techPlaceVisible", true);
            this.enableModel.setProperty("/equipmentVisible", false);
            this.enableModel.setProperty("/rfidVisible", false);
            this.getView().byId("techPlaces").setValue("");
            this.getView().byId("techPlacesId").setValue("");
            //             this._initializeEquipmentHierarchy();
            // this._loadTechPlaces("",true);
        } else if (idSelectedButton.indexOf("idEquipmentRadioButton") >= 0) {
            this.enableModel.setProperty("/equipmentVisible", true);
            this.enableModel.setProperty("/techPlaceVisible", false);
            this.enableModel.setProperty("/rfidVisible", false);
            this.getView().byId("equipment").setValue("");
            this.getView().byId("equipmentId").setValue("");
            //             this._initializeTechPlaceHierarchy();
        }
        // else if (idSelectedButton.indexOf("idRfidRadioButton") >= 0)
        // {
        // this.enableModel.setProperty("/rfidVisible", true);
        // this.enableModel.setProperty("/techPlaceVisible", false);
        // this.enableModel.setProperty("/equipmentVisible", false);
        // }
    },
    onNavBackPress: function () {
        this.router.navTo("launchpad");
    },
    handleValueHelpPress: function (oEvent) {
        this.mainModel.setProperty("/reqUser", {});
        var sInputValue = oEvent.getSource().getValue();
        this.inputValueId = oEvent.getSource().getId();
        if (!this._requesterDialogPlaces) {
            this._requesterDialogPlaces = sap.ui.xmlfragment(
                "view.fragment.noticeCreate.GenericValueHelpDialog", this);
        }
        this._requesterDialogPlaces.setModel(this.getView().getModel("reqUser"));
        this.getView().addDependent(this._requesterDialogPlaces);
        this._requesterDialogPlaces.open();
    }, // * Dialog for the places
    // *****************************************************
    onPlacesValueHelpPress: function (oEvent) {
        var sInputValue = oEvent.getSource().getValue();
        this.inputValueId = oEvent.getSource().getId();
        // create value help dialog
        if (!this._valueHelpDialogPlaces) {
            this._valueHelpDialogPlaces = sap.ui.xmlfragment("view.fragment.noticeCreate.PlacesDialog", this);
        }
        if (this.inputValueId.indexOf("techPlaces") >= 0) {
            this._valueHelpDialogPlaces.setModel(this.getView().getModel("techPlaces"));
        }
        if (this.inputValueId.indexOf("equipment") >= 0) {
            this._valueHelpDialogPlaces.setModel(this.getView().getModel("equipments"));
        }
        this.getView().addDependent(this._valueHelpDialogPlaces);
        this._valueHelpDialogPlaces.open();
        // this._valueHelpDialog.open(sInputValue);
    },
    _handleValueHelpPlacesClose: function (evt) {
        var listItem = evt.getSource().getParent().getParent().getContent()[1];
        if (listItem && listItem.getSelectedItem()) {
            this.listItem = listItem;
            var oSelectedItem = listItem.getSelectedItem().getBindingContext().getObject();
            if (oSelectedItem) {
                if (oSelectedItem.rfidCode !== "") {
                    sap.m.MessageBox.alert("Sede tecnica associata con RFID, continuare manualmente?", {
                        title: "ATTENZIONE",
                        actions: [sap.m.MessageBox.Action.CANCEL, sap.m.MessageBox.Action.OK],
                        onClose: _.bind(function (oAction) {
                            if (oAction == "OK") {
                                this.continuaAssociazioneManuale(oSelectedItem);
                            } else {
                                this._valueHelpDialogPlaces.close();
                                this.uiModel.setProperty("/problemsListTabVisible", true);
                                return;
                            }
                        }, this)
                    });
                } else {
                    this.continuaAssociazioneManuale(oSelectedItem);
                }

            }
            if (this._valueHelpDialogPlaces) {
                this._valueHelpDialogPlaces.close();
                this.uiModel.setProperty("/problemsListTabVisible", true);
            }
        } else {
            sap.m.MessageToast.show(this._getLocaleText("selectItem"));
        }
    },

    continuaAssociazioneManuale: function (oSelectedItem) {
        var input = sap.ui.getCore().byId(this.inputValueId);
        input.setValue(oSelectedItem.description);
        // **
        if (this.getView().byId("idTechPlaceRadioButton").getSelected()) {
            this.notice.techPlaceId = oSelectedItem.id;
        } else {
            this.notice.equipmentId = oSelectedItem.id;
        }
        // **
        if (this.enableModel.getData().techPlaceVisible) {
            model.service.LocalStorageService.session.save("selectedtechPlaces", oSelectedItem);
        } else if (this.enableModel.getData().equipmentVisible) {
            model.service.LocalStorageService.session.save("selectedEquip", oSelectedItem);
        }
        if (this.enableModel.getData().techPlaceVisible) {
            oSelectedItem.masterCategory = "S";
        } else {
            oSelectedItem.masterCategory = "E";
        }
        //Commentato per mock
        //this.getCatalog();
        //this.populateComboBox(oSelectedItem);
    },

    onPressCloseHelpPlaces: function () {
        this._valueHelpDialogPlaces.close();
    },

    _handleSearchDialog: function (evt) {
        var sValue = evt.getParameter("newValue");
        var filters = [];
        var oFilter = new sap.ui.model.Filter({
            path: "description",
            operator: "Contains",
            value1: sValue
        });
        var oDialog = sap.ui.getCore().byId("listPlacesId");
        var items = oDialog.getBinding("items");
        filters.push(oFilter);
        items.filter(filters);
    },
    goToChild: function (evt) {
        var icon = evt.getSource();
        this.id = icon.getId();
        var father = icon.getParent().getParent().getBindingContext().getObject();
        if (this.enableModel.getData().techPlaceVisible) {
            if (!father.ultimo) {
                this.techPlaceHierarchy.push(father.id);
                model.service.LocalStorageService.session.save("techPlaceHierarchy", this.techPlaceHierarchy);
                this._loadTechPlaces({
                    supTechPlace: father.id
                });
            }
        } else if (this.enableModel.getData().equipmentVisible) {
            if (!father.ultimo) {
                this.equipmentHierarchy.push(father.id);
                model.service.LocalStorageService.session.save("equipmentHierarchy", this.equipmentHierarchy);
                this._loadTechPlaces({
                    supTechPlace: father.id
                }, true);
            }
        }
    },
    goBackToYourFatherLuke: function (evt) {
        // else if (this.enableModel.getData().equipmentVisible)
        if (this.enableModel.getData().techPlaceVisible) {
            var lastFather = this.techPlaceHierarchy[this.techPlaceHierarchy.length - 2] ? this.techPlaceHierarchy[this.techPlaceHierarchy.length - 2] : "";
            this.techPlaceHierarchy.pop();
            this._loadTechPlaces({
                supTechPlace: lastFather
            });
        } else if (this.enableModel.getData().equipmentVisible) {
            var lastFather = this.equipmentHierarchy[this.equipmentHierarchy.length - 2] ? this.equipmentHierarchy[this.equipmentHierarchy.length - 2] : "";
            this.equipmentHierarchy.pop();
            this._loadTechPlaces({
                supTechPlace: lastFather
            }, true);
        }
    },
    onCreateNotice: function () {
        if (this._checkNoticeDescription() && this._checkNoticeTechPlace()) {
            var that = this;
            this.notice.requestUser = this.userModel.getData().userLogged.username;
            this.notice.catalogElementTypeD = this.catalogElementTypeD;
            var newNotice = this.notice;
            // *****************
            var partners = [];
            // var partner = {};
            // partner.name = this._getUserLogged().userName;
            // partner.partnerRole = "Z0";
            // partner.noticeId = "";
            // partners.push(partner);
            this.notice.partners = partners;
            // *****************
            var fSuccess = function (res) {
                // sap.m.MessagetBox.success(this._getLocaleText("noticeCreated"));
                sap.m.MessageBox.success(this._getLocaleText("noticeCreated"), {
                    title: "Success", // default
                    onClose: function () {
                        if (sap.ui.Device.system.desktop) {
                            that.router.navTo("noticeList");
                        } else {
                            that.router.navTo("noticeMobileList");
                        }
                    } // default
                });
            };
            var fError = function (err) {
                sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(err));
            };
            fSuccess = _.bind(fSuccess, this);
            fError = _.bind(fError, this);
            model.NoticeModel.createNotice(newNotice).then(fSuccess, fError);
        }
    },

    // funzione che apre il DIALOG per l'aggiunta delle immagini
    onAddAttachmentPress: function () {
        this.uploadAttachmentFragment = sap.ui.xmlfragment("view.fragment.UploadAttachment", this);
        this.getView().addDependent(this.uploadAttachmentFragment);
        this.uploadAttachmentFragment.open();
    },

    onUploadChange: function (oEvent) {
        // controllo la lunghezza del nome perche SAP prevede una lunghezza max di 128 caratteri
        var name = oEvent.getParameter("newValue");
        console.log(name);
        if (name.length > 100) {
            this.fileNameDialog = sap.ui.xmlfragment("view.fragment.fileNameDialog", this);
            this.fileModel = new sap.ui.model.json.JSONModel();
            this.fileModel.setData({
                "name": name
            });
            this.getView().setModel(this.fileModel, "fn");
            var page = this.getView().byId(this.page);
            page.addDependent(this.fileNameDialog);
            this.fileNameDialog.open();
        } else {
            this.fileName = name;
        }
    },

    onUploadComplete: function (evt) {
        var status = evt.getParameter("status").toString();
        //        var dataFile = "";
        if (status && status === "201") {
            var sResponse = evt.getParameter("response");
            if (sResponse) {
                var res = sResponse.split("DDMFileSet")[1];
                var CGuid = res.split("='")[1].split("'")[0];
                var CDrunr = res.split("='")[2].split("'")[0];
                if (this.notice.CGuid === "") {
                    this.notice.CGuid = CGuid;
                }
                dataFile = {
                    nomeFile: this.fileName,
                    posId: CDrunr,
                    estensioneFile: this.fileType,
                    url: "/DDMFileSet(CGuid='" + CGuid + "',CDrunr='" + CDrunr + "')"
                };
                this.notice.attachments.push(dataFile);
                sap.m.MessageToast.show(this._getLocaleText("uploadOk"));
            } else {
                sap.m.MessageToast.show(this._getLocaleText("uploadKo"));
            }
            this.getView().getModel("mainModel").refresh();
        }
        if (this.uploadAttachmentFragment) {
            this.onCancelUploadPress();
        }

    },

    //    onFileSizeExceed: function () {
    //        sap.m.MessageToast.show(this._getLocaleText("immagineGrande"));
    //    },

    onCancelUploadPress: function () {
        sap.ui.getCore().getElementById("myImage").setValue("");
        this.uploadAttachmentFragment.setBusy(false);
        this.uploadAttachmentFragment.close();
        this.uploadAttachmentFragment.destroy(true);
    },

    onConfirmUploadPress: function () {
        this.uploadAttachmentFragment.setBusy(true);
        var uploadData = {};
        var fileUploader = sap.ui.getCore().byId("myImage");
        if (!fileUploader.getValue()) {
            sap.m.MessageToast.show(this._getLocaleText("chooseFileFirst"));
            this.uploadAttachmentFragment.setBusy(false);
            return;
        } else {
            fileUploader.removeAllHeaderParameters();
            fileUploader.setSendXHR(true);

            var modello = model.service.ODataService._getDataModel();
            modello.refreshSecurityToken();
            var header = new sap.ui.unified.FileUploaderParameter({
                name: "x-csrf-token",
                value: modello.getHeaders()['x-csrf-token']
            });

            fileUploader.addHeaderParameter(header);

            this.fileName = fileUploader.oFileUpload.files[0].name;
            this.fileType = fileUploader.oFileUpload.files[0].type;

            var headerSlug;
            if (this.notice.CGuid && this.notice.CGuid !== "") {
                var guid = this.notice.CGuid;
                headerSlug = new sap.ui.unified.FileUploaderParameter({
                    name: "Slug",
                    value: this.fileName + "|" + this.fileType + "|" + guid
                });
            } else {
                headerSlug = new sap.ui.unified.FileUploaderParameter({
                    name: "Slug",
                    value: this.fileName + "|" + this.fileType + "|"
                });
            }
            fileUploader.addHeaderParameter(headerSlug);

            fileUploader.upload();
        }
    },

    onFileNameOK: function (evt) {
        var name = this.getView().getModel("fn").getProperty("/name");
        if (name.length <= 100) {
            this.fileName = name;
            sap.m.MessageToast.show(model.i18n._getLocaleText("PRESS_UPLOAD_FILE") + " " +
                evt.getParameter("newValue") + "'");
            this.fileNameDialog.close();
            this.fileNameDialog.destroy(true);
        } else {
            sap.m.MessageToast.show(model.i18n._getLocaleText("REDEFINE_FILE_NAME"));
        }
    },

    onFileNameClose: function (evt) {
        this.fileNameDialog.close();
        this.fileNameDialog.destroy(true);
        this.onCancelUploadPress();
    },

    onPressAttachment: function (evt) {
        var obj = evt.getSource();
        if (obj.getBindingContext("mainModel")) {
            var selectedItem = obj.getBindingContext("mainModel").getModel().getProperty(obj.getBindingContext("mainModel").getPath());
            var url = selectedItem.url;
            var image = this.serverModel.getProperty("/link") + url + "/$value";
            window.open(image);
        }
    },

    onDeleteAttachment: function (evt) {
        var path = evt.getParameter("listItem").getBindingContext("mainModel").getPath();
        this.selectedItem = evt.getParameter("listItem").getBindingContext("mainModel").getModel().getProperty(path);

        var fSuccess = function () {
            sap.m.MessageToast.show(this._getLocaleText("fileCancellato"));
            _.remove(this.notice.attachments, {
                url: this.selectedItem.url
            });
            this.getView().getModel("mainModel").refresh();
        };

        var fError = function (err) {
            sap.m.MessageToast.show(this._getLocaleText("cancellazioneFallita"));
        };

        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);

        model.NoticeModel.deleteAttachment(this.selectedItem.url)
            .then(fSuccess, fError);
    },


    onTaskSelectionChange: function (evt) {
        var selectedItem = evt.getParameter("selectedItem").getBindingContext("taskModel").getObject();
        // this.taskModel.setProperty("/tasks",
        // this._filterTasks(selectedItem.problemId));
        var task = _.find(this.taskModel.getData().tasks, {
            codeErr: selectedItem.codeErr
        });
        this.taskModel.setProperty("/task", task);
    },
    getPartnersList: function () {
        var fSuccess = function (res) {
            var result = {};
            result.results = res;
            this.partnersModel.setData(result);

            this._setUserRequestes();

        }
        var fError = function (err) {
            sap.m.MessageToast.show(this._getLocaleText("partnersError"));
            this.partnersModel.setData();
        }
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.PartnersModel.getList().then(fSuccess, fError);
    },
    onChangeValueState: function (evt) {
        this.mainModel.setProperty("/description", evt.getSource().getValue());
        if (evt.getSource().getValue() !== "") {
            this.getView().byId("txtAreaId").setValueState("Success");
        } else {
            this.getView().byId("txtAreaId").setValueState("Error");
        }
    },
    _checkNoticeDescription: function () {
        if (this.notice.description == "") {
            sap.m.MessageBox.alert(this._getLocaleText("insertDescr"));
            this.getView().byId("txtAreaId").setValueState("Error");
            return false;
        } else {
            this.getView().byId("txtAreaId").setValueState(null);
            return true;
        }
    },

    _checkNoticeTechPlace: function () {
        //        this.notice.techPlaceId
        //this.notice.equipmentId
        if (this.getView().byId("idTechPlaceRadioButton").getSelected()) {
            if (this.notice.techPlaceId == "") {
                sap.m.MessageBox.alert(this._getLocaleText("insertTechPlace"));
                this.getView().byId("techPlaces").setValueState("Error");
                return false;
            } else {
                this.getView().byId("techPlaces").setValueState(null);
                return true;
            }
        } else {
            if (this.notice.equipmentId == "") {
                sap.m.MessageBox.alert(this._getLocaleText("insertEquipment"));
                this.getView().byId("equipment").setValueState("Error");
                return false;
            } else {
                this.getView().byId("equipment").setValueState(null);
                return true;
            }
        }
    },

    _setUserRequestes: function () {
        var userLog = _.find(this.partnersModel.getProperty("/results"), {
            user: this.userModel.getProperty("/userLogged").userName
        });
        if (userLog) {
            this.mainModel.setProperty("/reqUser", userLog);
            this.getView().byId("requesters").setValue(userLog.nameComplete);
            if (userLog.user === "PMUTEGEN") {
                this.uiModel.setProperty("/enterEmailFieldVisible", true);
            } else {
                this.uiModel.setProperty("/enterEmailFieldVisible", false);
            }
        }
        this.requesterUser = userLog;
    },

    // funzione lanciata alla selezione di una priorità. Necessaria per cancellare i campi della segnalazione telefonica
    onSelectPriority: function (evt) {
        var src = evt.getSource();
        if (src.getSelectedKey() === "2" || src.getSelectedKey() === "4") {
            this.mainModel.setProperty("/dataTel", "");
            this.mainModel.setProperty("/oraTel", "");
        }
    },

    onChangeDataTel: function (evt) {
        var src = evt.getSource();
        var value = src.getDateValue();
        value.setHours(12);
        this.mainModel.setProperty("/dataTel", value);
    },

    onChangeHourTel: function (evt) {
        var src = evt.getSource();
        var value = src.getValue();
        this.mainModel.setProperty("/oraTel", value);
    },
});