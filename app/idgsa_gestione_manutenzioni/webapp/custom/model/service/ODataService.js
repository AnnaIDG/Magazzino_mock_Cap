jQuery.sap.declare("model.service.ODataService");
jQuery.sap.require("utils.Formatter");
model.service.ODataService = {
    _serverUrl: icms.Component.getMetadata().getManifestEntry("sap.app").dataSources["SERVER"].url,
    _logoffUrl: icms.Component.getMetadata().getManifestEntry("sap.app").dataSources["LOGOFF"].url,
    _noticeHeaderSet: "/NotifHeaderSet",
    _techPlaceSet: "/FuncLocSet",
    _equipmentSet: "/EquipmentDataSet",
    _catalogSet: "/CatalogSet",
    _prioritySet: "/PrioritySet",
    _networkStatusSet: "/NetworkStatusSet",
    _partnersList: "/UserPartnerSet",
    _noticeProblemSet: "/NotifProblemSet",
    _noticeTaskSet: "/NotifTaskSet",
    _noticeStatusSet: "/NotifStatusSet",
    _noticeTaskStatusSet: "/NotifTaskStatusSet",
    _userTypeSet: "/UserTypeSet",
    _userCheck: "/UserCheckSet",
    _userChangePsw: "/UserPswNewSet",
    /**
     * @memberOf model.service.ODataService
     */
    _getDataModel: function () {
        if (!this._dataModel) {
            this._dataModel = new sap.ui.model.odata.ODataModel(this._serverUrl, true);
        }
        return this._dataModel;
    },
    login: function (username, password, success, error) {
        $.ajax({
            url: this._serverUrl + "/?sap-language=" + (sessionStorage.getItem("language") ? sessionStorage.getItem("language") : "IT"),
            type: "GET",
            headers: {
                "Authorization": "Basic " + btoa(username + ":" + password)
            },
            context: this,
            success: success,
            error: error,
            async: false
        });
    },
    logout: function (success, error) {
        $.ajax({
            url: this._logoffUrl,
            type: "GET",
            context: this,
            success: success,
            error: error,
            async: false
        });
    },
    
    checkPsw: function (uname, success, error) {
        var url = this._userCheck;
        url = url + "('" + uname + "')";
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    
    // oData cambio password
    changePassword: function (entity, success, error) {
        var url = this._userChangePsw;
//        var url = ";o=SDVCLNT300/UserPswNewSet"
        this._getDataModel().update(url.concat("(IUname='" + entity.IUname + "',IPasswordOld='" + entity.IPasswordOld + "')"), entity, {
            success: success,
            error: error
        });
    },
    
    getNoticeList: function (req, success, error) {
        var url = this._noticeHeaderSet;
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop]) && !_.isDate(req[prop]))
                continue;
            if (prop !== "fromDate" && prop !== "toDate") {
                if (isFirst) {
                    url = url.concat("?$filter=");
                    isFirst = false;
                } else {
                    url = url.concat(" and ");
                }
                var propString = "";
                if (prop === "Priok" && req[prop] === "nopriority") {
                    propString = prop + " eq ''";
                } else if (prop === "Qmnum") {
                    propString = "substringof('" + req[prop] + "', Qmnum)";
                } else {
                    propString = prop + " eq '" + req[prop] + "'";
                }
                url = url.concat(propString);
            }
        }
        if (_.isDate(req["fromDate"]) && _.isDate(req["toDate"])) {
            url += " and (Qmdat ge datetime'" + utils.Formatter.Date.formatDateToSap(req["fromDate"]) + "' " + "and Qmdat le datetime'" + utils.Formatter.Date.formatDateToSap(req["toDate"]) + "')";
        } else if (_.isDate(req["fromDate"])) {
            url += " and Qmdat ge datetime'" + utils.Formatter.Date.formatDateToSap(req["fromDate"]) + "'";
        } else if (_.isDate(req["toDate"])) {
            url += " and Qmdat le datetime'" + utils.Formatter.Date.formatDateToSap(req["toDate"]) + "'";
        }
        url = url + "&$top=1000";
        this._getDataModel().read(url, {
            success: success,
            error: error,
            async: true
        });
    },
    getNoticeDetail: function (noticeId, success, error) {
        var params = "(Qmnum='" + noticeId + "')?$expand=NotifPartnerSet,NotifProblemSet,NotifTaskSet,DocumentSet";
        // DocumentSet
        this._getDataModel().read(this._noticeHeaderSet + params, {
            success: success,
            error: error
        });
    },
    getCatalog: function (req, success, error) {
        var url = this._catalogSet;
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop]))
                continue;
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            url = url.concat(propString);
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    }, // CREATE NOTICE
    createNotice: function (notice, success, error) {
        var url = this._noticeHeaderSet;
        var entity = {};
        for (var prop in notice) {
            if (!notice[prop])
                continue;
            entity[prop] = notice[prop];
        }
        // entity.Vbeln = "";
        this._getDataModel().create(url, entity, {
            success: success,
            error: error
        });
    },
    updateNoticeHeader: function (noticeHeader, success, error) {
        var url = this._noticeHeaderSet;
        this._getDataModel().update(url.concat("(Qmnum='" + noticeHeader.Qmnum + "')"), noticeHeader, {
            success: success,
            error: error
        });
    },
    createProblem: function (problem, success, error) {
        var url = this._noticeProblemSet;
        this._getDataModel().create(url, problem, {
            success: success,
            error: error
        });
    },
    updateProblem: function (problem, noticeId, success, error) {
        var url = this._noticeProblemSet;
        this._getDataModel().update(url.concat("(Qmnum='" + noticeId + "',Fenum='" + problem.Fenum + "')"), problem, {
            success: success,
            error: error
        });
    },
    getPriorityList: function (req, success, error) {
        var url = this._prioritySet;
        if (req && req.ITplnr) {
            var isFirst = true;
            for (var prop in req) {
                if (_.isEmpty(req[prop]))
                    continue;
                if (isFirst) {
                    url = url.concat("?$filter=");
                    isFirst = false;
                } else {
                    url = url.concat(" and ");
                }
                var propString = prop + " eq '" + req[prop] + "'";
                url = url.concat(propString);
            }
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    }, // NETWORK STATUS
    loadNetworkStatus: function (success, error) {
        var url = this._networkStatusSet;
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    }, // TECH PLACES HIERARCHY
    loadTechPlaces: function (req, success, error) {
        var url = this._techPlaceSet;
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop]))
                continue;
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            url = url.concat(propString);
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    loadEquipments: function (req, success, error) {
        var url = this._equipmentSet;
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop]))
                continue;
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            url = url.concat(propString);
        }
//        if (url.indexOf("?$filter=") !== -1) {
//            url = url + "&$top=100";
//        } else {
//            url = url + "?$top=100";
//        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getTechPlaceFromRfid: function (req, success, error) {
        var url = this._techPlaceSet;
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop]))
                continue;
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            url = url.concat(propString);
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getEquipmentFromRfid: function (req, success, error) {
        var url = this._equipmentSet;
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop]))
                continue;
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            url = url.concat(propString);
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    updateTechPlace: function (entity, success, error) {
        var url = this._techPlaceSet;
        this._getDataModel().update(url.concat("(FunctLoc='" + entity.FunctLoc + "')"), entity, {
            success: success,
            error: error
        });
    },
    updateEquipment: function (entity, success, error) {
        var url = this._equipmentSet;
        this._getDataModel().update(url.concat("(Equipment='" + entity.Equipment + "')"), entity, {
            success: success,
            error: error
        });
    },
    getPartnersList: function (success, error) {
        var url = this._partnersList;
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    }, // *** da implementare
    changeNoticeState: function (req, success, error) {
        var url = this._noticeStatusSet;
        var r = {};
        r.StatusInt = req.StatusInt;
        this._getDataModel().update(url.concat("(Qmnum='" + req.Qmnum + "')"), r, {
            success: success,
            error: error
        });
    }, // ***
    createTask: function (task, success, error) {
        var url = this._noticeTaskSet;
        this._getDataModel().create(url, task, {
            success: success,
            error: error
        });
    },
    updateTask: function (task, noticeId, success, error) {
        var url = this._noticeTaskSet;
        this._getDataModel().update(
            url.concat("(Qmnum='" + noticeId + "',Fenum='" + task.Fenum + "',Qsmnum='" + task.Qsmnum + "')"), task, {
                success: success,
                error: error
            });
    },
    closeTask: function (task, noticeId, success, error) {
        var url = this._noticeTaskStatusSet;
        this._getDataModel().update(url.concat("(Qmnum='" + noticeId + "',Manum='" + task.Manum + "')"), task, {
            success: success,
            error: error
        });
    },
    getUserType: function (uname, success, error) {
        var url = this._userTypeSet;
        url = url + "('" + uname + "')";
        //url = url + "(Uname='" + uname + "')"; //LC
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getTechPlace: function (id, success, error) {
        var url = this._techPlaceSet;
        url = url.concat("?$filter=FunctLoc eq '" + id + "'");
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getEquipment: function (id, success, error) {
        var url = this._equipmentSet;
        url = url.concat("?$filter=Equipment eq '" + id + "'");
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },

    // oData cancellazione attachment
    deleteNoticeAttachment: function (url, fSuccess, fError) {
        this._getDataModel().remove(url, {
            success: fSuccess,
            error: fError
        });
    },
    
    // oData cambio password
//    changePassword: function () {
//        
//        this._getDataModel().update(url, entita, {
//            success: fSuccess,
//            error: fError
//        });
//    },
};