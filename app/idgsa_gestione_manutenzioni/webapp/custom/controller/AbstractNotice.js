jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.NoticeModel");
jQuery.sap.require("model.NoticeStateModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("utils.Collections");
jQuery.sap.require("model.InterventionDatesModel");
jQuery.sap.require("model.TechPlaceModel");
jQuery.sap.require("model.ObjectsModel");
jQuery.sap.require("model.CatalogModel");
jQuery.sap.require("model.ComboBoxModel");
jQuery.sap.declare("controller.AbstractNotice");
controller.AbstractController.extend("controller.AbstractNotice", {
    /**
     * @memberOf controller.NoticeCreate
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.mainModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.mainModel, "mainModel");
        this.mainModel.setProperty("/noticeState", "");
        this.enableModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.enableModel, "enableModel");
        this.objectsListModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.objectsListModel, "objectsList");
        this.currentIssueModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.currentIssueModel, "currentIssue");
        this.catalogComplete = undefined;
        /*
         * Used to manage dialog addNewTask
         */
        this.taskModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.taskModel, "taskModel");
        this.issueTypesModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.taskModel, "issueTypes");
        //
        // model.service.LocalStorageService.session.save("newNoticeArray",[]);
    },
    handleRouteMatched: function (evt) {
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        //
    },
    removeFocus: function () {
        $(document).ready(function () {
            $(':focus').blur();
        });
    },
    _detectRFID: function (barcode) {
        var defer = Q.defer();
        this.getView().setBusy(true);
        //rimuove la priorità dato che la combobox viene ricalcolata in base alla sede tecnica
        var combo = this.getView().byId("priorityComboBox");
        if (combo) {
            combo.setSelectedItem(combo.getDefaultSelectedItem());
        }
        var fSuccess = function (res) {
            this.getView().setBusy(false);
            if (res.tech) {
                model.service.LocalStorageService.session.remove("selectedEquip");
                model.service.LocalStorageService.session.save("selectedtechPlaces", res);
                this.mainModel.setProperty("/techPlaceId", res.id);
                this.mainModel.setProperty("/equipmentId", "");
                if (this.getView().byId("idTechPlaceRadioButton"))
                    this.getView().byId("idTechPlaceRadioButton").setSelected(true);
                this.enableModel.setProperty("/equipmentVisible", false);
                this.enableModel.setProperty("/techPlaceVisible", true);
                this.mainModel.setProperty("/techPlaceDescr", res.description);
                this.mainModel.setProperty("/equipmentDescr", "");
                this.populateComboBox(res);
            } else if (res.equip) {
                model.service.LocalStorageService.session.remove("selectedtechPlaces");
                model.service.LocalStorageService.session.save("selectedEquip", res);
                this.mainModel.setProperty("/techPlaceId", "");
                this.mainModel.setProperty("/equipmentId", res.id);
                if (this.getView().byId("idEquipmentRadioButton"))
                    this.getView().byId("idEquipmentRadioButton").setSelected(true);
                this.enableModel.setProperty("/equipmentVisible", true);
                this.enableModel.setProperty("/techPlaceVisible", false);
                this.mainModel.setProperty("/equipmentDescr", res.description);
                this.mainModel.setProperty("/techPlaceDescr", "");
                this.populateComboBox(res);
            } else {
                sap.m.MessageToast.show(this._getLocaleText("noRfidFound"));
            }
            this.uiModel.setProperty("/problemsListTabVisible", true);
            this.mainModel.refresh();
            this.getCatalog();
        };
        var fError = function (err) {
            this.getView().setBusy(false);
            sap.m.MessageToast.show(this._getLocaleText("rfidError"));
            this.uiModel.setProperty("/problemsListTabVisible", false);
        };
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.TechPlaceModel.getTechPlaceOrEquipmentFromRfid(barcode).then(fSuccess, fError);
        return defer.promise;
    },
    populateComboBox: function (item) {
        if (item === undefined)
            item = {
                id: this.notice.techPlaceId
            };
        this.getView().setBusy(true);
        model.ComboBoxModel.getPriorityList(item).then(function (result) {
            this.getView().setBusy(false);
            this.prioritiesModel = new sap.ui.model.json.JSONModel();
            this.prioritiesModel.setData(result);
            this.getView().setModel(this.prioritiesModel, "priorities");
        }.bind(this), function (error) {
            this.getView().setBusy(false);
            sap.m.MessageBox.error(this.SAPMessageUtil.getErrorMessage(error), {
                title: this._getLocaleText("errorLoadingPriorityListMessageBoxTitle")
            });
        }.bind(this));
    },
    _handleValueHelpSearch: function (evt) {
        var sValue = evt.getParameter("value");
        var oFilter = new sap.ui.model.Filter({
            path: "description",
            operator: "Contains",
            value1: sValue
        });
        evt.getSource().getBinding("items").filter([oFilter]);
    },
    _handleValueHelpClose: function (evt) {
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
            var input = sap.ui.getCore().byId(this.inputValueId);
            input.setValue(oSelectedItem.getTitle());
            if (oSelectedItem.getTitle() === "User Generico") {
                this.uiModel.setProperty("/enterEmailFieldVisible", true);
            } else {
                this.uiModel.setProperty("/enterEmailFieldVisible", false);
            }
        }
        evt.getSource().getBinding("items").filter([]);
    },
    handlePrioritySelectionChange: function (evt) {
        var src = evt.getSource();
        var key = src.getSelectedKey();
        model.InterventionDatesModel.getInterventionDates(key).then(function (result) {
            this.interventionDatesModel.setData(result);
            this.mainModel.setProperty("/intervention", result);
        }.bind(this));
        this.uiModel.setProperty("/interventionDatesVisible", true);
    },
    initializeComboBoxToFirstValue: function (propertyName) {
        var comboBoxId = propertyName + "ComboBox";
        if (this.getView().byId(comboBoxId)) {
            if (this.getView().byId(comboBoxId).getSelectedKey().trim() === "") this.getView().byId(comboBoxId).setSelectedItem(this.getView().byId(comboBoxId).getItems()[0]);
        }
    },
    initializeComboBoxToDefaultValue: function (propertyName, key) {
        var comboBoxId = propertyName + "ComboBox";
        if (this.getView().byId(comboBoxId)) {
            this.getView().byId(comboBoxId).setSelectedKey(key);
        }
    },
    onAddIssuePress: function () {
        if (!!this.notice && !!this.notice.problems) {
            var newIssue = {
                type: "",
                typeId: "",
                description: ""
            };
            newIssue.type = this.mainModel.getProperty("/issueTypeId");
            newIssue.description = this.mainModel.getProperty("/issueTypeTextDescription");
            this.notice.problems.unshift(newIssue);
            this.mainModel.setProperty("/problems", this.notice.problems);
        }
    },
    openAddIssueDialog: function (evt) {
        if (!this.addIssueDialog) this.addIssueDialog = sap.ui.xmlfragment("view.fragment.noticeCreate.AddNewIssue", this);
        var page = this.getView().byId(this.page);
        page.addDependent(this.addIssueDialog);

        // this.mainModel.setProperty("/issuesList", []);
        this.getView().getModel("issueTypes").setProperty("/issueTypeTextDescription", "");
        this.mainModel.getData().issueCode = undefined;
        this.mainModel.setProperty("/objectId", undefined);
        this.uiModel.setProperty("/multiComboVisible", false);
        this.getView().getModel("objectsList").setProperty("/results", this.objectList);
        this.getView().getModel("objectsList").refresh();
        this.addIssueDialog.open();
        $(document).keyup(_.bind(this.keyUpFunc, this));
    },
    onChangeIssueType: function (evt) {},
    onAddIssueOkPress: function () {
        // var issues = [];
        var objectSelected = _.find(this.getView().getModel("objectsList").getData().results, {
            codeErr: this.mainModel.getProperty("/objectId")
        });
        var issue = _.find(this.getView().getModel("issueTypes").getData().results, {
            codeErr: this.mainModel.getData().issueCode
        });
        if (issue) {
            // ** remap
            var o = _.clone(issue);
            o.objectId = _.clone(objectSelected.codeErr);
            o.id = _.clone(issue.codeErr);
            o.description = (this.getView().getModel("issueTypes").getData().issueTypeTextDescription ? this.getView().getModel("issueTypes").getData().issueTypeTextDescription : "");
            o.positionId = (this.getView().getModel("mainModel").getData().problems).length + 1;
            o.problemId = (this.getView().getModel("mainModel").getData().problems).length + 1;
            // **
        } else {
            sap.m.MessageToast.show(this._getLocaleText("issueRequired"));
            return;
        }
        if (!!this.notice && !!this.notice.problems) {
            var newIssue = {
                type: "",
                typeId: "",
                description: ""
            };
            newIssue.description = (this.getView().getModel("issueTypes").getData().issueTypeTextDescription) ? this.getView().getModel("issueTypes").getData().issueTypeTextDescription : "";
            // ** remap
            newIssue.object = objectSelected.codeErrDescr;
            newIssue.objectId = objectSelected.codeErr;
            newIssue.type = o.codeErrDescr;
            newIssue.typeId = o.codeErr;
            newIssue.codeGruppeTypeC = o.codeGruppe;
            newIssue.codeGruppeTypeB = objectSelected.codeGruppe;
            newIssue.positionId = this.getView().getModel("mainModel").getData().problems.length + 1;
            newIssue.problemId = this.getView().getModel("mainModel").getData().problems.length + 1;
            // **
            this.notice.problems.unshift(_.cloneDeep(newIssue));
            this.newIssue = newIssue;
            newIssue = {};
            o = {};
            this.mainModel.setProperty("/problems", this.notice.problems);
            this.uiModel.setProperty("/taskListTabVisible", this.notice.problems.length > 0);
        }
        if (this.addIssueDialog) {
            this.addIssueDialog.close();
        }
        // this.getView().getModel("issueTypes").getData().issueTypeTextDescription
        // = "";
        // this.getView().getModel("issueTypes").refresh();
        this.resetValuesToDefault();
        // this.selectedItems = [];
    },
    onAddIssueCancelPress: function (evt) {
        if (this.addIssueDialog) {
            this.addIssueDialog.close();
        }
        sap.m.MessageToast.show(this._getLocaleText("nothingAdded"));
    },
    onIssueItemDelete: function (oEvent) {
        var oItem = oEvent.getSource();
        var index = parseInt(oItem.getBindingContext(this.mainModelName).getPath().split("/")[2]);
        if (index > -1) {
            this.notice.problems.splice(index, 1);
        }
        this.mainModel.setProperty("/problems", this.notice.problems);
        this.uiModel.setProperty("/taskListTabVisible", this.notice.problems.length > 0);
        sap.m.MessageToast.show(this._getLocaleText("itemRemovedSuccessfully"));
    },
    onEditIssueItemPress: function (oEvent) {
        this.resetValuesToDefault();
        var oItem = oEvent.getSource();
        var index = parseInt(oItem.getBindingContext(this.mainModelName).getPath().split("/")[2]);
        this.currentIssueIndex = index;
        this.currentIssue = oItem.getBindingContext(this.mainModelName).getObject();
        var c = _.cloneDeep(this.currentIssue);
        // **
        this.getView().getModel("currentIssue").setData(c);
        model.service.LocalStorageService.session.save("currentIssue", c);
        // **
        if (!this.editIssueDialog) this.editIssueDialog = sap.ui.xmlfragment("view.fragment.noticeCreate.EditIssue", this);
        var page = this.getView().byId(this.page);
        page.addDependent(this.editIssueDialog);
        this.editIssueDialog.open();
        $(document).keyup(_.bind(this.keyUpFunc, this));
    },
    onEditIssueOkPress: function () {
        var currentIssue = this.getView().getModel("currentIssue").getData();
        var issue = _.find(this.getView().getModel("issueTypes").getData().results, {
            codeErr: currentIssue.typeId
        });
        currentIssue.type = issue.codeErrDescr;
        currentIssue.codeGruppeTypeC = issue.codeGruppe;
        if (typeof this.currentIssueIndex !== "undefined" || typeof this.currentIssueIndex !== "null") {
            this.notice.problems[this.currentIssueIndex] = currentIssue;
            this.mainModel.getProperty("/problems")[this.currentIssueIndex] = currentIssue;
            this.mainModel.refresh();
        }
        this.mainModel.setProperty("/problems", this.notice.problems);
        if (this.editIssueDialog) {
            this.editIssueDialog.close();
        }
        model.service.LocalStorageService.session.remove("currentIssue");
        this.currentIssue = currentIssue;
        //sap.m.MessageToast.show(this._getLocaleText("itemModifiedSuccessfully"));
    },
    onEditIssueCancelPress: function () {
        if (!!this.currentIssueIndex) this.currentIssueIndex = undefined;
        if (this.editIssueDialog) {
            this.editIssueDialog.close();
        }
        this.getView().getModel("currentIssue").setData(this.currentIssue);
        sap.m.MessageToast.show(this._getLocaleText("nothingModified"));
    },
    onPressCreateTaskDialog: function (evt) {
        if (!this.addTaskDialog) this.addTaskDialog = sap.ui.xmlfragment("view.fragment.noticeCreate.AddNewTask", this);
        var page = this.getView().byId(this.page);
        page.addDependent(this.addTaskDialog);
        var problems = this._getCurrentProblems();
        var objects = _.uniq(_.map(problems, function (item) {
            return {
                //problemId: item.problemId,
                objectId: item.objectId,
                object: item.object
            };
        }), function (item) {
            //return item.problemId;
            return item.objectId;
        });
        this.taskModel.setProperty("/objects", objects);
        this.taskModel.setProperty("/object", "");
        this.taskModel.setProperty("/objectDescr", "");
        this.taskModel.setProperty("/problem", "");
        this.taskModel.setProperty("/tasks", []);
        this.taskModel.setProperty("/task", "");
        /*******************************************************************  
         * STARTED PREPARING DEFAULT VALUES IF SINGLE OBJECTS AND SINGLE RELATIVE PROBLEM
         */
        if (objects.length == 1) {
            this.taskModel.setProperty("/object", objects[0].objectId);
            this.onTaskObjectSelectionChange();
            if (this.taskModel.getProperty("/problems") && this.taskModel.getProperty("/problems").length == 1) {
                var selectedProblem = this.taskModel.getProperty("/problems")[0];
                this.taskModel.setProperty("/problem", selectedProblem.problemId);
            }

        }


        /***************************************************************************/
        // this.taskModel.setProperty("/problems", []);


        this.taskModel.setProperty("/description", "");
        this.taskModel.setProperty("/creationDate", null);
        this.taskModel.setProperty("/endDate", null);
        this.enableModel.setProperty("/creationDateButtonVisible", true);
        this.enableModel.setProperty("/creationDateInputVisible", false);
        this.enableModel.setProperty("/endDateButtonVisible", true);
        this.enableModel.setProperty("/endDateInputVisible", false);
        this.enableModel.setProperty("/endDatePanelVisible", false);
        this.enableModel.setProperty("/endDateInputEditable", false);
        this.taskModel.refresh();
        this.addTaskDialog.open();
        $(document).keyup(_.bind(this.keyUpFunc, this));
    },
    _getCurrentProblems: function () {
        var problems = this.getView().getModel(this.mainModelName).getProperty("/problems");
        var problemArray = [];
        _.map(problems, _.bind(function (item) {
            var objectDescr = item.object;
            // for (var i = 0; i < item.issuesList.length; i++) {
            var obj = {};
            obj.object = objectDescr;
            obj.objectId = item.objectId;
            obj.problem = item.type;
            obj.problemId = item.typeId;
            problemArray.push(obj);
            // }
        }, this));
        return problemArray;
    },
    onTaskObjectSelectionChange: function (evt) {

        if (evt)
            var selectedItem = evt.getParameter("selectedItem").getBindingContext("taskModel").getObject();
        else //Added to reuse in case only a single object exists
        {
            var objectId = this.taskModel.getProperty("/object");
            var selectedItem = _.find(this.taskModel.getProperty("/objects"), _.bind(function (item) {
                return item.objectId == objectId;
            }, this))
        }
        this.taskModel.setProperty("/objectDescr", selectedItem.object);
        this.taskModel.setProperty("/problems", _.filter(this.mainModel.getData().problems, {
            //typeId: selectedItem.problemId
            objectId: selectedItem.objectId
        }));

        var problems = this.taskModel.getProperty("/problems");
        if (problems && problems.length == 1) {
            var problem = problems[0].problemId;
            this.taskModel.setProperty("/problem", problem);
        }


        this.taskModel.setProperty("/tasks", this._filterTasks(selectedItem.objectId));
        this.taskModel.refresh();
    },
    /** *************It's just for mock************************** */
    _filterTasks: function (issue) {
        // var tasks = this.getView().getModel("taskTypes").getData().results;
        var tasks = this.issueTypesList;
        return tasks;
    },
    /** ********************************************************** */
    onAddTaskOkPress: function () {
        var task = this.taskModel.getProperty("/task");
        var textArea = this.taskModel.getProperty("/description");
        if (!!this.notice && !!this.notice.tasks) {
            var newTask = {
                type: "",
                typeDescr: "",
                description: "",
                state: {
                    key: "MIAP",
                    text: "Aperto"
                },
                problem: "",
                object: ""
            };
            var objectTaskFromCatalog = _.filter(this.taskModel.getProperty("/tasks"), function (o) {
                //                return o.codeErr === task.codeErr//L.C. added .codeErr
                return o.codeErr === task;
            });
            if (objectTaskFromCatalog[0]) {
                newTask.type = objectTaskFromCatalog[0].codeGruppe;
                newTask.typeDescr = objectTaskFromCatalog[0].codeErrDescr;
                newTask.TxtTaskgrp = objectTaskFromCatalog[0].codeGruppeDescr;
                newTask.id = objectTaskFromCatalog[0].id;

                //Added L.C.
                //                newTask.codeErr = newTask.id+" - "+newTask.type;
                //
            }
            newTask.description = textArea;
            newTask.problem = this.taskModel.getProperty("/problem");
            var p = _.find(this.mainModel.getData().problems, function (o) {
                return parseInt(o.problemId) == (newTask.problem)
            });
            newTask.problemDescr = p.type;
            newTask.object = this.taskModel.getProperty("/object");
            newTask.objectDescr = this.taskModel.getProperty("/objectDescr");

            newTask.Manum = this.notice.tasks.length + 1;
            var tasksForProblem = _.filter(this.notice.tasks, function (o) {
                return parseInt(o.problem) == parseInt(newTask.problem)
            });
            newTask.Qsmnum = tasksForProblem.length + 1;
            this.newTask = newTask;

            //--------LC Decommented-------------------//
            //this.notice.tasks.unshift(newTask);
            //---------------------------------------------
            this.mainModel.setProperty("/tasks", this.notice.tasks);
            this.mainModel.refresh();
        }
        if (this.addTaskDialog) {
            this.addTaskDialog.close();
        }

    },
    onAddTaskCancelPress: function (evt) {
        if (this.addTaskDialog) {
            this.addTaskDialog.close();
        }
        sap.m.MessageToast.show(this._getLocaleText("nothingAdded"));
    },
    onEditTaskItemPress: function (oEvent) {
        var oItem = oEvent.getSource();
        var task = _.cloneDeep(oItem.getBindingContext(this.mainModelName).getObject());
        //		this.taskModel.setProperty("/description", task.description);
        this.taskModel.setProperty("/description", task.description);
        this.taskModel.setProperty("/state", task.state.key);
        this.taskModel.setProperty("/stateDescr", task.state.text);
        this.taskModel.setProperty("/creationDate", task.creationDate);
        this.taskModel.setProperty("/endDate", task.endDate);
        this.taskModel.setProperty("/task", task.type);
        this.taskModel.setProperty("/taskId", task.taskId);

        //Added L.C. ->my fault, to bind task codeErr-CodeGruppe
        //        this.taskModel.setProperty("/codeErr", task.codeErr);

        this.taskModel.setProperty("/problem", task.problem);
        this.taskModel.setProperty("/problemDescr", task.problemDescr);
        this.taskModel.setProperty("/object", task.object);
        this.taskModel.setProperty("/objectDescr", task.objectDescr);
        this.taskModel.setProperty("/tasks", this.taskModel.getData().tasks);
        this.enableModel.setProperty("/creationDateButtonVisible", (task.creationDate == null));
        this.enableModel.setProperty("/creationDateInputVisible", (task.creationDate !== null));
        this.enableModel.setProperty("/endDateButtonVisible", (task.endDate == null) && (task.creationDate !== null));
        this.enableModel.setProperty("/endDateInputVisible", (task.endDate !== null));
        this.enableModel.setProperty("/endDatePanelVisible", (task.creationDate !== null));
        this.enableModel.setProperty("/endDateInputEditable", (task.endDate == null));
        if (!this.editTaskDialog) this.editTaskDialog = sap.ui.xmlfragment("view.fragment.noticeCreate.EditTask", this);
        var page = this.getView().byId(this.page);
        page.addDependent(this.editTaskDialog);
        var index = parseInt(oItem.getBindingContext(this.mainModelName).getPath().split("/")[2]);
        this.currentTaskIndex = index;
        this.editTaskDialog.open();
        $(document).keyup(_.bind(this.keyUpFunc, this));
    },
    onEditTaskOkPress: function () {
        var task = this.taskModel.getProperty("/task");
        var taskId = this.taskModel.getProperty("/taskId");

        if (!!this.notice && !!this.notice.tasks) {
            var newTask = {
                type: "",
                description: "",
                creationDate: new Date().ddmmyyyy(),
                state: {
                    key: "",
                    text: ""
                }
            };

            var objectTaskFromCatalog = _.filter(this.taskModel.getProperty("/tasks"), function (o) {
                return o.codeErr === task
                    //return o.codeErr === task.codeErr//L.C. added .codeErr

            });
            if (objectTaskFromCatalog) {
                newTask.type = objectTaskFromCatalog[0].codeGruppe;
                newTask.typeDescr = objectTaskFromCatalog[0].codeErrDescr;
                newTask.id = objectTaskFromCatalog[0].id;




                //                //Added L.C.
                //            	newTask.type = objectTaskFromCatalog[0].codeGruppe;
                //                newTask.typeDescr = objectTaskFromCatalog[0].codeErrDescr;
                //                newTask.TxtTaskgrp = objectTaskFromCatalog[0].codeGruppeDescr;
                //                newTask.id = objectTaskFromCatalog[0].id;
                //                newTask.codeErr = newTask.id+" - "+newTask.type;
                //                



            }

            //var t = _.find(this.mainModel.getData().tasks, function(o){return o.type ==task});
            var t = _.find(this.mainModel.getData().tasks, function (o) {
                return o.taskId == taskId
            });
            if (t) {
                newTask.taskId = t.taskId;
            }
            newTask.problem = this.taskModel.getProperty("/problem");
            newTask.problemDescr = this.taskModel.getProperty("/problemDescr");
            newTask.object = this.taskModel.getProperty("/object");
            newTask.objectDescr = this.taskModel.getProperty("/objectDescr");
            newTask.description = this.taskModel.getProperty("/description");
            newTask.creationDate = this.taskModel.getProperty("/creationDate") ? this.taskModel.getProperty("/creationDate") : null;
            newTask.endDate = this.taskModel.getProperty("/endDate") ? this.taskModel.getProperty("/endDate") : null;
            newTask.state = t.state;

            if (typeof this.currentTaskIndex !== "undefined" || typeof this.currentTaskIndex !== "null") {
                this.notice.tasks[this.currentTaskIndex] = newTask;

                var tasksWithSameProblem = _.filter(this.notice.tasks, function (o) {
                    return o.problem === newTask.problem
                });
                newTask.Qsmnum = 0;
                for (var i = 0; i < tasksWithSameProblem.length; i++) {
                    if (newTask.taskId === tasksWithSameProblem[i].taskId) {
                        newTask.Qsmnum = i + 1;
                    }
                }


                newTask.Manum = this.currentTaskIndex + 1;
                this.mainModel.getProperty("/tasks")[this.currentTaskIndex] = newTask;
                this.mainModel.refresh();
            }
            this.taskToEdit = newTask;
            this.mainModel.setProperty("/tasks", this.notice.tasks);
        }
        if (this.editTaskDialog) {
            this.editTaskDialog.close();
        }
        sap.m.MessageToast.show(this._getLocaleText("itemModifiedSuccessfully"));
    },
    onEditTaskCancelPress: function () {
        if (!!this.currentIndex) this.currentTaskIndex = undefined;
        if (this.editTaskDialog) {
            this.editTaskDialog.close();
        }
        sap.m.MessageToast.show(this._getLocaleText("nothingModified"));
    }

    ,
    onTaskItemDelete: function (oEvent) {
        var oItem = oEvent.getSource();
        var index = parseInt(oItem.getBindingContext(this.mainModelName).getPath().split("/")[2]);
        if (index > -1) {
            this.notice.tasks.splice(index, 1);
        }
        this.mainModel.setProperty("/tasks", this.notice.tasks);
        sap.m.MessageToast.show(this._getLocaleText("itemRemovedSuccessfully"));
    },
    keyUpFunc: function (e) {
        if (e.keyCode == 27) {
            // in case user close dialog via ESC
            if (this.addTaskDialog) {
                this.addTaskDialog.close();
            }
            if (this.addIssueDialog) {
                this.addIssueDialog.close();
            }
            if (this.editIssueDialog) {
                this.editIssueDialog.close();
            }
            if (this.editTaskDialog) {
                this.editTaskDialog.close();
            }
            $(document).off("keyup");
        }
    },
    getObjectsList: function (req) {
        var fSuccess = function (res) {
            this.mainModel.setProperty("/object", "");
            this.mainModel.refresh();
            var obj = {};
            obj.results = res;
            this.objectsListModel.setData(obj);
        };
        var fError = function (err) {
            sap.m.MessageToast.show("No Objects Found");
        };
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.ObjectsModel.getObjectsList(req).then(fSuccess, fError);
    },
    onChangeObject: function (evt) {
        var key = evt.getSource().getSelectedKey();
        this.resetValuesToDefault();
        // var problemsList =
        // this.getView().getModel("issueTypes").getData().results;
        var obj = _.find(this.getView().getModel("objectsList").getData().results, {
            codeErr: key
        });
        this.mainModel.setProperty("/object", obj);
        // this.mainModel.setProperty("/issuesList", []);
        this.getIssueTypeListForObject(obj);
    },
    getIssueTypeListForObject: function (req, list) {
        this.resetValuesToDefault();
        this.uiModel.setProperty("/multiComboVisible", true);
    },
    handleSelectionFinish: function (oEvent) {
        this.selectedItems = oEvent.getParameter("selectedItems");
    },
    getCatalog: function () {
        this.getView().setBusy(true);
        var defer = Q.defer();
        var fSuccess = function (res) {
            this.getView().setBusy(false);
            this.catalogComplete = res;
            var c = _.filter(res, function (item) {
                return item.catType == 'C';
            });
            this.issueTypesList = _.filter(res, function (item) {
                return item.catType == '2';
            });
            this.objectList = _.filter(res, function (item) {
                return item.catType == 'B';
            });
            // this.objectsListModel.setData(c);
            this.correctionsList = {};
            this.correctionsList.results = c;
            this.catalogElementTypeD = _.find(this.catalogComplete, {
                catType: 'D'
            });
            this.getView().getModel("issueTypes").setData(this.correctionsList);
            this.getView().getModel("taskModel").setProperty("/tasks", this.issueTypesList);
            this.getView().getModel("objectsList").setProperty("/results", this.objectList);
            this.getView().getModel("objectsList").refresh();
        };
        var fError = function (err) {
            this.getView().setBusy(false);
            this.catalogComplete = undefined;
            defer.reject(err);
            sap.m.MessageToast.show(utils.SAPMessageUtil.getErrorMessage(err));
        };
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        var req = {};
        req.FuncLoc = this.mainModel.getData().techPlaceId;
        req.Equipment = this.mainModel.getData().equipmentId;

        model.CatalogModel.getCatalog(req).then(fSuccess, fError);
        return defer.promise;
    },
    resetValuesToDefault: function () {
        this.getView().getModel("issueTypes").setData(this.correctionsList);
        this.getView().getModel("taskModel").setProperty("/tasks", this.issueTypesList);
        this.getView().getModel("objectsList").setProperty("/results", this.objectList);
        this.getView().getModel("issueTypes").refresh();
        this.getView().getModel("taskModel").refresh();
        this.getView().getModel("objectsList").refresh();
    }
});