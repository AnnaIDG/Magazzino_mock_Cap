jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.NoticeModel");
jQuery.sap.require("model.NoticeStateModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("utils.Collections");
jQuery.sap.require("model.ObjectsModel");
jQuery.sap.require("model.CatalogModel");
jQuery.sap.require("controller.AbstractNotice");
jQuery.sap.require("model.ProblemModel");
jQuery.sap.require("model.TaskModel");
controller.AbstractNotice.extend("controller.NoticeDetail", {
    /**
     * @memberOf controller.NoticeDetail
     */
    onInit: function () {
        controller.AbstractNotice.prototype.onInit.apply(this, arguments);
        // this.mainModel = this.mainModel;
        this.getView().setModel(this.mainModel, "mainModel");
        this.problemsModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.problemsModel, "problemModel");
        this.page = "noticeDetailPageId";
        this.mainModelName = "mainModel";

        this.serverModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.serverModel, "serverModel");
    },
    handleRouteMatched: function (evt) {
        //
        if (this._checkRoute(evt, "noticeMobileList")) {
            this._selectFirstIconTab("iconTabBarNoticeDetailId");
            this.uiModel.setProperty("/backButtonVisible", false);
            this.uiModel.setProperty("/noticeDetailVisible", false);
            this.uiModel.setProperty("/modifyButtonVisible", false);
            this.mainModel.setData({});
            this.getView().removeStyleClass("logoBackground");
        }

        this.userModel.setProperty("/userLogged", model.service.LocalStorageService.session.get("userLogged"));
        if (!this._checkRoute(evt, "noticeDetail") && !this._checkRoute(evt, "noticeMasterDetail"))
            return;
        //
        controller.AbstractNotice.prototype.handleRouteMatched.apply(this, arguments);
        //
        this.getView().byId("priorityComboBox").setValueState(null);
        this.getView().byId("detailDescriptionId").setValueState(null);
        this.uiModel.setProperty("/noticeDetailVisible", false);
        this.uiModel.setProperty("/modifyButtonVisible", false);
        this.uiModel.setProperty("/backButtonVisible", false);
        this.uiModel.setProperty("/chargePhoto", false);
        //
        if (this._checkRoute(evt, "noticeMasterDetail")) {
            this.uiModel.setProperty("/backButtonVisible", false);
        } else {
            this.uiModel.setProperty("/backButtonVisible", true);
        }
        this.uiModel.setProperty("/noticeDetailVisible", true);
        this.uiModel.setProperty("/modifyButtonVisible", true);

        // model per URL del server
        var url = icms.Component.getMetadata().getManifestEntry("sap.app").dataSources["SERVER"].url;
        this.serverModel.setProperty("/link", url);
        //
        var id = evt.getParameter("arguments").noticeId;
        this._getNoticeDetail(id).then(_.bind(this.populateComboBox, this)).then(
            _.bind(this.getCatalog, this));
        // this.getCatalog();
        // this.populateComboBox({id: this.notice.techPlaceId});
        //
        this._selectFirstIconTab("iconTabBarNoticeDetailId");
        //
        this.uiModel.setProperty("/openCloseTaskVisible", true);

        this._checkProblemSolving(id);

        //
        $(document).scannerDetection({
            onComplete: function (barcode) {
                if (window.location.hash.indexOf("noticeDetail") !== -1 || window.location.hash.indexOf("noticeMasterDetail")) {
                    if (this.scanningTask) {
                        this._checkRFID(barcode);
                    } else {
                        this._detectRFID(barcode);
                    }
                }
            }.bind(this),
            onError: function (barcode) {
                //DO NOTHING
            }.bind(this)
        });
        setTimeout(_.bind(this.removeFocus, this), 1000);
    },

    _checkProblemSolving: function (noticeId) {
        if (model.service.LocalStorageService.local.get("startDateProblemSolving_" + noticeId)) {
            this.uiModel.setProperty("/dateStartProblemSolving", true);
        } else {
            this.uiModel.setProperty("/dateStartProblemSolving", false);
        }
        this.uiModel.refresh();
    },

    _getNoticeDetail: function (id) {
        var defer = Q.defer();
        this.getView().setBusy(true);
        model.NoticeModel.getNoticeDetail(id).then(function (result) {
            this.notice = result;
            this.mainModel.setData(this.notice);
            this.getView().setBusy(false);
            defer.resolve();
        }.bind(this), function (error) {
            this.getView().setBusy(false);
            sap.m.MessageBox.error(this.SAPMessageUtil.getErrorMessage(error), {
                title: this._getLocaleText("errorLoadingNoticeListMessageBoxTitle")
            });
            defer.reject(error);
        }.bind(this));
        return defer.promise;
    },

    onNavBackPress: function () {
        if (sap.ui.Device.system.desktop) {
            this.router.navTo("noticeList");
        } else {
            this.router.navTo("noticeMobileList");
        }
    },

    onPressDocumentation: function () {
        sap.m.URLHelper.redirect("https://drive.google.com/file/d/0Bx1Hy4k97vZPWHNQbkxVMmNqUVE/view",
            true);
    },

    // funzione per l'apertura dell'immagine
    onPressAttachments: function (evt) {
        var obj = evt.getSource();
        if (obj.getBindingContext("mainModel")) {
            var selectedItem = obj.getBindingContext("mainModel").getModel().getProperty(obj.getBindingContext("mainModel").getPath());
            if (selectedItem.url) {
                var url = selectedItem.url;
                var image = this.serverModel.getProperty("/link") + url + "/$value";
            } else {


                var url = icms.Component.getMetadata().getManifestEntry("sap.app").dataSources["SERVER"].url;
                var idAppl = selectedItem.estensioneFile;
                var fileName = selectedItem.nomeFile;
                var idObj = selectedItem.idFile;
                var image = url + "/ContentFileSet(IDappl='" + idAppl + "',IFilename='" + fileName + "',IPhObjid='" + idObj + "')/$value";
            }
            window.open(image);
        }
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

    //    onDeleteAttachments: function (evt) {
    //        //        console.log(evt.getSource())
    //        var path = evt.getParameter("listItem").getBindingContext("mainModel").getPath();
    //        var selectedItem = evt.getParameter("listItem").getBindingContext("mainModel").getModel().getProperty(path);
    //        //        CGuid  this.CGuid
    //        //        CDrunr selectedItem.idFile
    //        //        
    //    },

    onViewMapPress: function (evt) {
        var url = this.mainModel.getData().geoLoc;
        sap.m.URLHelper.redirect(url, true);
    },

    onPressEditNotice: function () {
        if (this._checkNoticeDescription() && this._checkNoticePriority() && this._checkDateHourTel()) {
            this.getView().setBusy(true);
            model.NoticeModel.updateNotice(this.mainModel.getData()).then(
                function (result) {
                    this._getNoticeDetail(this.mainModel.getData().noticeId)
                        .then(_.bind(sap.m.MessageBox.success(this._getLocaleText("noticeUpdatedMessage") + " " + this.mainModel.getData().noticeId, {
                            title: this._getLocaleText("successUpdatingNoticeTitle"),
                            onClose: function () {
                                if (!sap.ui.Device.system.desktop) {
                                    var params = {
                                        noticeDateFrom: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                                        noticeDateTo: new Date(),
                                        noticeType: "Z1"
                                    };
                                    var eventBus = sap.ui.getCore().getEventBus();
                                    eventBus.publish("variabileAcaso", "variabileAcaso2", params);
                                }
                            }
                        }), this));



                }.bind(this),
                function (error) {
                    this.getView().setBusy(false);
                    sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
                        title: this._getLocaleText("errorUpdatingNoticeTitle")
                    });
                }.bind(this));
        }
    },
    // -----------------------------------------------------------------------------------------------
    onOpenStatusSheet: function (oEvent) {
        var oButton = oEvent.getSource();
        var nextStates = model.service.LocalStorageService.session.get("networkStatusSet");
        var buttons = _.bind(this._createStatusButtons, this);
        var button;
        // create action sheet only once
        if (!this._actionSheet) {
            this._actionSheet = sap.ui.xmlfragment("view.fragment.noticeDetail.StatusActionSheet", this);
            this.getView().addDependent(this._actionSheet);
        }
        if (this._actionSheet.getButtons().length > 0)
            this._actionSheet.removeAllButtons();
        for (var i = 0; i < nextStates.length; i++) {
            if (nextStates[i].userStatus !== "INIZ") {
                button = buttons(nextStates[i]);
                this._actionSheet.addButton(button);
            }
        }
        this._actionSheet.openBy(oButton);
    },

    _createStatusButtons: function (b) {
        var newButton = new sap.m.Button({
            text: b.userStatus, // icon:
            // "sap-icon://technical-object",
            press: [this._assignNextStatusButton, this]
        });
        newButton.addStyleClass(b.userStatus);
        var icon = this._getIcon(b);
        newButton.setProperty("icon", icon);
        return newButton;
    },

    _assignNextStatusButton: function (evt) {
        this.source = evt.getSource();
        if (this._checkNoticeDescription() && this._checkNoticePriority()) {
            this.getView().setBusy(true);
            model.NoticeModel.updateNotice(this.mainModel.getData()).then(
                function (result) {
                    this._getNoticeDetail(this.mainModel.getData().noticeId).then(
                        _.bind(function () {
                            //                            var source = evt.getSource();
                            var newStatus = this.source.getText();
                            if (this._checkNoticeDescription() && this._checkNoticePriority(newStatus)) {
                                var objStatus = _.find(model.service.LocalStorageService.session.get("networkStatusSet"),
                                    function (o) {
                                        return o.userStatus === newStatus;
                                    });
                                this.notice.noticeState = newStatus;
                                this.notice.StatusInt = objStatus.sapStatus;
                                this._changeNoticeState();
                            }
                        }, this));
                }.bind(this),
                function (error) {
                    this.getView().setBusy(false);
                    sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
                        title: this._getLocaleText("errorUpdatingNoticeTitle")
                    });
                }.bind(this));
        }


        //        var source = evt.getSource();
        //        var newStatus = source.getText();
        //        if (this._checkNoticeDescription() && this._checkNoticePriority(newStatus)) {
        //            var objStatus = _.find(model.service.LocalStorageService.session.get("networkStatusSet"),
        //                function (o) {
        //                    return o.userStatus === newStatus;
        //                });
        //            this.notice.noticeState = newStatus;
        //            this.notice.StatusInt = objStatus.sapStatus;
        //            this._changeNoticeState();
        //        }
    },

    _getIcon: function (b) {
        var s = b.userStatus;
        if (s == "INIZ") {
            return "";
        } else if (s == "TOCP") {
            return "sap-icon://locked";
        } else if (s == "TRAS") {
            return "sap-icon://outbox";
        } else if (s == "WIPM") {
            return "sap-icon://technical-object";
        } else if (s == "TOCL") {
            return "sap-icon://locked";
        } else if (s == "WIPP") {
            return "sap-icon://technical-object";
        }
    },

    _changeNoticeState: function () {
        this.getView().setBusy(true);
        var fSuccess = function (res) {
            this.getView().setBusy(false);
            this._getNoticeDetail(this.mainModel.getData().noticeId).then(
                _.bind(sap.m.MessageToast.show(this
                    ._getLocaleText("successUpdatingNoticeStatusToast"), this)));
        };
        var fError = function (err) {
            this._getNoticeDetail(this.notice.noticeId);
            sap.m.MessageToast.show(utils.SAPMessageUtil.getErrorMessage(err));
            this.getView().setBusy(false);
        };
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.NoticeModel.changeNoticeState(this.notice).then(fSuccess, fError);
    },

    onAddIssueOkPress: function () {
        controller.AbstractNotice.prototype.onAddIssueOkPress.apply(this);
        model.ProblemModel.createProblem(this.newIssue, this.mainModel.getData().noticeId).then(
            function (result) {
                this._getNoticeDetail(this.mainModel.getData().noticeId).then(
                    _.bind(sap.m.MessageBox.success(this._getLocaleText("noticeUpdatedMessage") + " " + this.mainModel.getData().noticeId, {
                        title: this._getLocaleText("successUpdatingNoticeTitle")
                    }), this));
            }.bind(this),
            function (error) {
                this.getView().setBusy(false);
                sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
                    title: this._getLocaleText("errorUpdatingNoticeTitle")
                });
            }.bind(this));
    },

    onEditIssueOkPress: function () {
        controller.AbstractNotice.prototype.onEditIssueOkPress.apply(this);
        model.ProblemModel.updateProblem(this.currentIssue, this.mainModel.getData().noticeId).then(
            function (result) {
                this._getNoticeDetail(this.mainModel.getData().noticeId).then(
                    _.bind(sap.m.MessageBox.success(this._getLocaleText("noticeUpdatedMessage") + " " + this.mainModel.getData().noticeId, {
                        title: this._getLocaleText("successUpdatingNoticeTitle")
                    }), this));
            }.bind(this),
            function (error) {
                this.getView().setBusy(false);
                sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error), {
                    title: this._getLocaleText("errorUpdatingNoticeTitle")
                });
            }.bind(this));
    },

    handleIconTabBarSelect: function (evt) {
        var key = evt.getParameter("key");
        if (key == "headNotice") {
            this.uiModel.setProperty("/modifyButtonVisible", true);
        } else {
            this.uiModel.setProperty("/modifyButtonVisible", false);
        }
        this.uiModel.refresh();
    },
    // **aggiunta di un task ad un avviso già esistente
    onAddTaskOkPress: function () {
        var funzione = _.bind(function () {
            this.getView().setBusy(true);
            controller.AbstractNotice.prototype.onAddTaskOkPress.apply(this);
            var noticeId = this.mainModel.getData().noticeId;
            var fSuccess = function (success) {
                //            this._getNoticeDetail(success.Qmnum);

                if (model.service.LocalStorageService.local.get("startDateProblemSolving_" + this.notice.noticeId)) {
                    model.service.LocalStorageService.local.remove("startDateProblemSolving_" + this.notice.noticeId);
                    this._checkProblemSolving();
                }
                this._getNoticeDetail(success.Qmnum)
                    .then(function () {
                        this.currentTask = this.mainModel.getData().tasks[this.mainModel.getData().tasks.length - 1];
                        this._openTask();
                    }.bind(this));
            };
            var fError = function (err) {
                this.getView().setBusy(false);
                sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(err), {
                    title: this._getLocaleText("errorUpdatingNoticeTitle")
                });
            };
            fSuccess = _.bind(fSuccess, this);
            fError = _.bind(fError, this);
            model.TaskModel.createTask(this.newTask, noticeId).then(fSuccess, fError);

        }, this);

        if (!model.service.LocalStorageService.local.get("startDateProblemSolving_" + this.notice.noticeId)) {
            sap.m.MessageBox.show("Impossibile determinare l'orario esatto dell'inizio misura correttiva. \n Probabilmente per iniziare la stessa è stato usato un altro dispositivo mobile. \n Settare la data di inizio attività con la data attuale ? ",
                sap.m.MessageBox.Icon.NONE,
                "Attenzione", [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                _.bind(function (action) {
                    if (action === "YES") {
                        model.service.LocalStorageService.local.save("startDateProblemSolving_" + this.notice.noticeId, new Date());
                        funzione();
                    } else {
                        this.addTaskDialog.close();
                    }
                }, this)
            );
        } else {
            funzione();
        }

    },
    // **modifica di un task già esistente
    onEditTaskOkPress: function () {
        controller.AbstractNotice.prototype.onEditTaskOkPress.apply(this);
        var defer = Q.defer();
        var noticeId = this.mainModel.getData().noticeId;
        if (!this.cs) {
            var fSuccess = function (success) {
                this._getNoticeDetail(this.mainModel.getData().noticeId);
                this.cs = false;
                defer.resolve();
            };
            var fError = function (err) {
                defer.reject(err);
                this.getView().setBusy(false);
                sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(err), {
                    title: this._getLocaleText("errorUpdatingNoticeTitle")
                });
            };
        } else {
            var fSuccess = function (success) {
                defer.resolve();
                this.cs = false;
                // this._getNoticeDetail(this.mainModel.getData().noticeId);
            };
            var fError = function (err) {
                defer.reject(err);
                this.getView().setBusy(false);
                sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(err), {
                    title: this._getLocaleText("errorUpdatingNoticeTitle")
                });
            };
        }
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.TaskModel.updateTask(this.taskToEdit, noticeId).then(fSuccess, fError);
        return defer.promise;
    },

    onOpenTaskItemPress: function (evt) {
        //        var index = evt.getSource().oPropagatedProperties.oBindingContexts.mainModel.sPath;
        //        index = index.substr(index.lastIndexOf("/") + 1);
        //        this.currentTask = this.mainModel.getData().tasks[index];
        if (!this.changeDatesTaskDialog) this.changeDatesTaskDialog = sap.ui.xmlfragment("view.fragment.noticeDetail.ChangeDatesTask", this);
        var page = this.getView().byId(this.page);
        page.addDependent(this.changeDatesTaskDialog);
        this.manageTaskModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.manageTaskModel, "manageTaskModel");
        this.changeDatesTaskDialog.removeAllButtons();
        if (this.notice.techPlaceId !== "" && this.notice.equipmentId === "") {
            model.TechPlaceModel.getTechPlace(this.notice.techPlaceId).then(
                function (success) {
                    this.hasRFID = success.rfidCode !== "";
                    if (this.hasRFID) {
                        this.scanningTask = true;
                        this.currentRFID = success.rfidCode;
                        this.manageTaskModel.setProperty("/message", this._getLocaleText("scanToManageTaskMsg"));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("closeTaskButton"),
                            press: [this._closeFragmentTask, this],
                            type: "Reject"
                        }));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("startTaskButton"),
                            enabled: false,
                            //                            press: [this._openTask, this],
                            press: [this._closeDialog, this],
                            type: "Accept"
                        }));
                    } else {
                        this.manageTaskModel.setProperty("/message", this._getLocaleText("startTaskMsg"));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("closeTaskButton"),
                            press: [this._closeFragmentTask, this],
                            type: "Reject"
                        }));

                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("startTaskButton"),
                            //                            press: [this._openTask, this],
                            press: [this._closeDialog, this],
                            type: "Accept"
                        }));
                    }
                    this.changeDatesTaskDialog.open();
                    setTimeout(_.bind(this.removeFocus, this), 500);
                }.bind(this),
                function (error) {
                    sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error));
                }.bind(this));
        } else if (this.notice.equipmentId !== "") {
            model.TechPlaceModel.getEquipment(this.notice.equipmentId).then(
                function (success) {
                    this.hasRFID = success.rfidCode !== "";
                    if (this.hasRFID) {
                        this.scanningTask = true;
                        this.currentRFID = success.rfidCode;
                        this.manageTaskModel.setProperty("/message", this._getLocaleText("scanToManageTaskMsg"));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("closeTaskButton"),
                            press: [this._closeFragmentTask, this],
                            type: "Reject"
                        }));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("startTaskButton"),
                            enabled: false,
                            press: [this._openTask, this],
                            type: "Accept"
                        }));
                    } else {
                        this.manageTaskModel.setProperty("/message", this._getLocaleText("startTaskMsg"));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("startTaskButton"),
                            press: [this._openTask, this],
                            type: "Accept"
                        }));
                    }
                    this.changeDatesTaskDialog.open();
                    setTimeout(_.bind(this.removeFocus, this), 500);
                }.bind(this),
                function (error) {
                    sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error));
                }.bind(this));
        }
    },

    _closeDialog: function () {
        this.changeDatesTaskDialog.close();
        this._checkProblemSolving(this.notice.noticeId);
    },

    _openTask: function () {
        this.changeDatesTaskDialog.close();
        this.getView().setBusy(true);
        model.TaskModel.openTask(this.currentTask, this.mainModel.getData().noticeId).then(function (result) {
            this._getNoticeDetail(this.mainModel.getData().noticeId).then(
                _.bind(sap.m.MessageBox.success(this._getLocaleText("noticeUpdatedMessage") + " " + this.mainModel.getData().noticeId, {
                    title: this._getLocaleText("successUpdatingNoticeTitle")
                }), this));
        }.bind(this), function (error) {
            this.getView().setBusy(false);
            sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error));
        }.bind(this));
    },

    _checkRFID: function (barcode) {
        if (this.scanningTask && this.hasRFID && this.currentRFID === barcode) {
            this.manageTaskModel.setProperty("/message", this._getLocaleText("checkRFIDSuccessTaskMsg"));
            if (this.changeDatesTaskDialog.getButtons()[1]) {
                this.changeDatesTaskDialog.getButtons()[1].setEnabled(true);
            } else {
                this.changeDatesTaskDialog.getButtons()[0].setEnabled(true);
            }

        } else {
            this.manageTaskModel.setProperty("/message", this._getLocaleText("checkRFIDErrorTaskMsg"));
        }
    },

    cancelChangeTask: function () {
        this.scanningTask = false;
    },

    onCloseTaskItemPress: function (evt) {
        var index = evt.getSource().oPropagatedProperties.oBindingContexts.mainModel.sPath;
        index = index.substr(index.lastIndexOf("/") + 1);
        this.currentTask = this.mainModel.getData().tasks[index];

        //        this.evento = evt;
        if (model.service.LocalStorageService.local.get("startDateProblemSolving_" + this.notice.noticeId)) {
            sap.m.MessageBox.show("Determinata l'ora esatta dell'inizio attività. \n Aggiornare la data di inizio ?",
                sap.m.MessageBox.Icon.NONE,
                "Attenzione", [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                _.bind(function (action) {
                    if (action === "YES") {
                        this.currentTask.creationDate = new Date(model.service.LocalStorageService.local.get("startDateProblemSolving_" + this.notice.noticeId));
                        //                        model.service.LocalStorageService.local.remove("startDateProblemSolving_" + this.notice.noticeId);
                        this._onCloseTaskItemPress();
                    } else {
                        //                        model.service.LocalStorageService.local.remove("startDateProblemSolving_" + this.notice.noticeId);
                        this._onCloseTaskItemPress();
                    }
                }, this)
            );
        } else {
            this._onCloseTaskItemPress();
        }
    },

    _onCloseTaskItemPress: function (evt) {
        //        var index = evt.getSource().oPropagatedProperties.oBindingContexts.mainModel.sPath;
        //        index = index.substr(index.lastIndexOf("/") + 1);
        //        this.currentTask = this.mainModel.getData().tasks[index];
        if (this.currentTask.typeDescr === "Correttiva non definita") {
            sap.m.MessageBox.warning(this._getLocaleText("noTypeTaskMsg"));
        } else {
            if (!this.changeDatesTaskDialog) this.changeDatesTaskDialog = sap.ui.xmlfragment("view.fragment.noticeDetail.ChangeDatesTask", this);
            var page = this.getView().byId(this.page);
            page.addDependent(this.changeDatesTaskDialog);
            this.manageTaskModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(this.manageTaskModel, "manageTaskModel");
            this.changeDatesTaskDialog.removeAllButtons();
            if (this.notice.techPlaceId !== "" && this.notice.equipmentId === "") {
                model.TechPlaceModel.getTechPlace(this.notice.techPlaceId).then(
                    function (success) {
                        this.hasRFID = success.rfidCode !== "";
                        if (this.hasRFID) {
                            this.scanningTask = true;
                            this.currentRFID = success.rfidCode;
                            this.manageTaskModel.setProperty("/message", this._getLocaleText("scanToManageTaskMsg"));
                            this.changeDatesTaskDialog.addButton(new sap.m.Button({
                                text: this._getLocaleText("closeTaskButton"),
                                press: [this._closeFragmentTask, this],
                                type: "Reject"
                            }));
                            this.changeDatesTaskDialog.addButton(new sap.m.Button({
                                text: this._getLocaleText("endTaskButton"),
                                enabled: false,
                                press: [this._closeTask, this],
                                type: "Accept"
                            }));
                        } else {
                            this.manageTaskModel.setProperty("/message", this._getLocaleText("endTaskMsg"));
                            this.changeDatesTaskDialog.addButton(new sap.m.Button({
                                text: this._getLocaleText("closeTaskButton"),
                                press: [this._closeFragmentTask, this],
                                type: "Reject"
                            }));

                            this.changeDatesTaskDialog.addButton(new sap.m.Button({
                                text: this._getLocaleText("endTaskButton"),
                                press: [this._closeTask, this],
                                type: "Accept"
                            }));
                        }
                        this.changeDatesTaskDialog.open();
                        setTimeout(_.bind(this.removeFocus, this), 500);
                    }.bind(this),
                    function (error) {
                        sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error));
                    }.bind(this));
            } else if (this.notice.equipmentId !== "") {
                model.TechPlaceModel.getEquipment(this.notice.equipmentId).then(
                    function (success) {
                        this.hasRFID = success.rfidCode !== "";
                        if (this.hasRFID) {
                            this.scanningTask = true;
                            this.currentRFID = success.rfidCode;
                            this.manageTaskModel.setProperty("/message", this._getLocaleText("scanToManageTaskMsg"));
                            this.changeDatesTaskDialog.addButton(new sap.m.Button({
                                text: this._getLocaleText("closeTaskButton"),
                                press: [this._closeFragmentTask, this],
                                type: "Reject"
                            }));
                            this.changeDatesTaskDialog.addButton(new sap.m.Button({
                                text: this._getLocaleText("endTaskButton"),
                                enabled: false,
                                press: [this._closeTask, this],
                                type: "Accept"
                            }));
                        } else {
                            this.manageTaskModel.setProperty("/message", this._getLocaleText("endTaskMsg"));
                            this.changeDatesTaskDialog.addButton(new sap.m.Button({
                                text: this._getLocaleText("endTaskButton"),
                                press: [this._closeTask, this],
                                type: "Accept"
                            }));
                        }
                        this.changeDatesTaskDialog.open();
                        setTimeout(_.bind(this.removeFocus, this), 500);
                    }.bind(this),
                    function (error) {
                        sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error));
                    }.bind(this));
            }
            //            }
        }
    },

    // funzione che chiude il fragment tramite "ANNULLA"
    _closeFragmentTask: function () {
        //        if (model.service.LocalStorageService.local.get("startDateProblemSolving_" + this.notice.noticeId)) {
        //            model.service.LocalStorageService.local.remove("startDateProblemSolving_" + this.notice.noticeId);
        //        }

        this.changeDatesTaskDialog.close();
    },

    _closeTask: function () {
        this.changeDatesTaskDialog.close();
        this.getView().setBusy(true);
        model.TaskModel.closeTask(this.currentTask, this.mainModel.getData().noticeId).then(function (result) {
            this._getNoticeDetail(this.mainModel.getData().noticeId).then(
                _.bind(sap.m.MessageBox.success(this._getLocaleText("noticeUpdatedMessage") + " " + this.mainModel.getData().noticeId, {
                    title: this._getLocaleText("successUpdatingNoticeTitle")
                }), this));
            model.service.LocalStorageService.local.remove("startDateProblemSolving_" + this.notice.noticeId);
        }.bind(this), function (error) {
            this.getView().setBusy(false);
            sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error));
        }.bind(this));
    },
    _checkNoticeDescription: function () {
        if (this.notice.description == "") {
            sap.m.MessageBox.alert(this._getLocaleText("insertDescr"));
            this.getView().byId("detailDescriptionId").setValueState("Error");
            return false;
        } else {
            this.getView().byId("detailDescriptionId").setValueState(null);
            return true;
        }
    },
    _checkNoticePriority: function (newStatus) {
        if (this.notice.priorityId == "" && ((newStatus && newStatus !== 'INIZ' && newStatus !== 'WIPP') ||
                (!newStatus && this.notice.noticeState !== 'INIZ' && this.notice.noticeState !== 'WIPP'))) {
            sap.m.MessageBox.alert(this._getLocaleText("priorityRequired"));
            this.getView().byId("priorityComboBox").setValueState("Error");
            return false;
        } else {
            this.getView().byId("priorityComboBox").setValueState(null);
            return true;
        }
    },
    onChangeDescriptionValueState: function (evt) {
        if (evt.getSource().getValue() !== "") {
            this.getView().byId("detailDescriptionId").setValueState(null);
        } else {
            this.getView().byId("detailDescriptionId").setValueState("Error");
        }
    },
    onChangePriorityValueState: function (evt) {
        if (evt.getSource().getValue() === "" && this.notice.noticeState !== 'INIZ' && this.notice.noticeState !== 'WIPP') {
            this.getView().byId("priorityComboBox").setValueState("Error");
        } else {
            this.getView().byId("priorityComboBox").setValueState(null);
        }
    },

    // funzione che apre il DIALOG per l'aggiunta delle immagini
    onAddAttachmentPress: function () {
        this.uploadAttachmentFragment = sap.ui.xmlfragment("view.fragment.UploadAttachment", this);
        this.getView().addDependent(this.uploadAttachmentFragment);
        this.uploadAttachmentFragment.open();
    },

    // funziona che si scatena se cerco di selezionare un file che non sia un'immagine
    onChoseTypeMissmatch: function (evt) {
        sap.m.MessageToast.show("Il file di estensione *." + evt.getParameter("fileType") +
            " non è supportato.");
    },

    // funzione per il controllo della lunghezza del nome perche SAP prevede una lunghezza max di 128 caratteri
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

    // funzione che controlla se l'immagine è stata caricata su SAP
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


    // chiusura DIALOG di upload
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
            this.uiModel.setProperty("/chargePhoto", true);
        }
    },


    // funzione per rinominare il file
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

    // chiusura DIALOG per rinominare il file da caricare
    onFileNameClose: function (evt) {
        this.fileNameDialog.close();
        this.fileNameDialog.destroy(true);
        this.onCancelUploadPress();
    },

    // funzione che salva in Local storage la data attuale
    onPressStartProblemSolving: function () {
        model.service.LocalStorageService.local.save("startDateProblemSolving_" + this.notice.noticeId, new Date());
        this.onOpenTaskItemPress();
        //        this._checkProblemSolving(this.notice.noticeId);
    },

    _onOpenTaskItemPress: function (evt) {
        //        var index = evt.getSource().oPropagatedProperties.oBindingContexts.mainModel.sPath;
        //        index = index.substr(index.lastIndexOf("/") + 1);
        //        this.currentTask = this.mainModel.getData().tasks[index];
        if (!this.changeDatesTaskDialog) this.changeDatesTaskDialog = sap.ui.xmlfragment("view.fragment.noticeDetail.ChangeDatesTask", this);
        var page = this.getView().byId(this.page);
        page.addDependent(this.changeDatesTaskDialog);
        this.manageTaskModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.manageTaskModel, "manageTaskModel");
        this.changeDatesTaskDialog.removeAllButtons();
        if (this.notice.techPlaceId !== "" && this.notice.equipmentId === "") {



            model.TechPlaceModel.getTechPlace(this.notice.techPlaceId).then(
                function (success) {
                    this.hasRFID = success.rfidCode !== "";
                    if (this.hasRFID) {
                        this.scanningTask = true;
                        this.currentRFID = success.rfidCode;
                        this.manageTaskModel.setProperty("/message", this._getLocaleText("scanToManageTaskMsg"));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("closeTaskButton"),
                            press: [this._closeFragmentTask, this],
                            type: "Reject"
                        }));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("startTaskButton"),
                            enabled: false,
                            //                            press: [this._openTask, this],
                            type: "Accept"
                        }));
                    } else {
                        this.manageTaskModel.setProperty("/message", this._getLocaleText("startTaskMsg"));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("startTaskButton"),
                            //                            press: [this._openTask, this],
                            type: "Accept"
                        }));
                    }
                    this.changeDatesTaskDialog.open();
                }.bind(this),
                function (error) {
                    sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error));
                }.bind(this));
        } else if (this.notice.equipmentId !== "") {
            model.TechPlaceModel.getEquipment(this.notice.equipmentId).then(
                function (success) {
                    this.hasRFID = success.rfidCode !== "";
                    if (this.hasRFID) {
                        this.scanningTask = true;
                        this.currentRFID = success.rfidCode;
                        this.manageTaskModel.setProperty("/message", this._getLocaleText("scanToManageTaskMsg"));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("closeTaskButton"),
                            press: [this._closeFragmentTask, this],
                            type: "Reject"
                        }));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("startTaskButton"),
                            enabled: false,
                            press: [this._openTask, this],
                            type: "Accept"
                        }));
                    } else {
                        this.manageTaskModel.setProperty("/message", this._getLocaleText("startTaskMsg"));
                        this.changeDatesTaskDialog.addButton(new sap.m.Button({
                            text: this._getLocaleText("startTaskButton"),
                            press: [this._openTask, this],
                            type: "Accept"
                        }));
                    }
                    this.changeDatesTaskDialog.open();
                }.bind(this),
                function (error) {
                    sap.m.MessageBox.error(utils.SAPMessageUtil.getErrorMessage(error));
                }.bind(this));
        }
    },

    onChangeDataTel: function (evt) {
        var src = evt.getSource();
        var value = src.getDateValue();
        value.setHours(12);
        this.notice.dataTel = value;
    },
    
    onChangeHourTel: function (evt) {
        var src = evt.getSource();
        var value = src.getValue();
        this.notice.oraTel = value;
    },
    
    _checkDateHourTel: function () {
        if (this.notice.priorityId === "2" || this.notice.priorityId === "4") {
            if (!this.notice.dataTel || this.notice.dataTel === "" || this.notice.dataTel > new Date()) {
                this.getView().byId("idDataTel").setValueState("Error");
                if (!this.notice.oraTel || this.notice.oraTel === "") {
                    this.getView().byId("idOraTel").setValueState("Error");
                }
                return false;
            } else if (!this.notice.oraTel || this.notice.oraTel === "") {
                this.getView().byId("idDataTel").setValueState("None");
                this.getView().byId("idOraTel").setValueState("Error");
                return false;
            } else {
                this.getView().byId("idDataTel").setValueState("None");
                this.getView().byId("idOraTel").setValueState("None");
                return true;
            }
        } else {
            this.notice.dataTel = null;
            if (!this.notice.oraTel)
                this.notice.oraTel = "PT00H00M00S";
            return true;
        }
    },
    
    
});