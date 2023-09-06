jQuery.sap.declare("model.NoticeModel");
jQuery.sap.require("utils.NoticeSerializer");

model.NoticeModel = {
    _isMock: icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
    /**
     * @memberOf model.NoticeModel
     */
    getNoticeList: function (params) {
        var defer = Q.defer();

        if (this._isMock) {
            $.getJSON("custom/model/mockData/NoticesMock.json").success(function (result) {
                //TODO filtro fromDate
                //TODO filtro toDate
                var filter = _.chain(params)
                    .pick(['noticeType', 'noticeState', 'noticeId', 'priority'])
                    .omit(function (v, k) {
                        return v === '';
                    })
                    .mapKeys(function (v, k) {
                        return (k === "priority") ? "priorityId" : k;
                    })
                    .value();
                var res = (_.keys(filter).length > 0) ? _.filter(result, filter) : result;
                defer.resolve(res)
            }.bind(this)).fail(fError);
        } else {
            var req = {
                fromDate: params && params.noticeDateFrom ? params.noticeDateFrom : "",
                toDate: params && params.noticeDateTo ? params.noticeDateTo : "",
                //Qmdat: params && params.noticeDateFrom ? params.noticeDateFrom : "",
                Qmart: params && params.noticeType ? params.noticeType : "Z1",
                SysStatus: params && params.noticeState ? params.noticeState : "",
                Qmnum: params && params.noticeId ? params.noticeId : "",
                Priok: params && params.priority ? params.priority : ""
            };

            var fSuccess = function (result) {
                var res = [];
                if (result && result.results)
                    res = utils.NoticeSerializer.serializeSAPList2ModelList(result.results);
                defer.resolve(res);
            };

            var fError = function (err) {
                defer.reject(err);
            };

            model.service.ODataService.getNoticeList(req, fSuccess, fError);
        }

        return defer.promise;
    },

    getNoticeDetail: function (noticeId) {
        var defer = Q.defer();
        model.service.ODataService.getNoticeDetail(noticeId, function (success) {
            var result = utils.NoticeSerializer.serializeSAPItem2ModelItem(success);
            defer.resolve(result);

        },
            function (error) {
                defer.reject(error);
            });
        return defer.promise;
    },

    getInstance: function () {
        var notice = utils.NoticeSerializer.serializeSAPItem2ModelItem(null);
        return notice;
    },

    createNotice: function (notice) {

        var defer = Q.defer();

        var noticeToSap = utils.NoticeSerializer.toSAP(notice);

        var fSuccess = function (res) {
            defer.resolve(res);
        };
        var fError = function (err) {
            defer.reject(err);
        };

        model.service.ODataService.createNotice(noticeToSap, fSuccess, fError);

        return defer.promise;
    },

    updateNotice: function (notice) {
        var defer = Q.defer();
        var noticeToSap = utils.NoticeSerializer.toSAP(notice);
        delete noticeToSap.NotifPartnerSet;
        delete noticeToSap.NotifProblemSet;
        delete noticeToSap.NotifTaskSet;
        model.service.ODataService.updateNoticeHeader(noticeToSap,
            function (result) {
                defer.resolve(result);
            },
            function (error) {
                defer.reject(error);
            });
        return defer.promise;
    },

    //	updateNoticeStatus : function(status) {
    //		// TODO implementare
    //		this._defer = Q.defer();
    //		this._defer.resolve("res");
    //		return this._defer.promise;
    //	},

    changeNoticeState: function (req) {
        var defer = Q.defer();

        var noticeToSap = utils.NoticeSerializer.toSAP(req);
        delete noticeToSap.NotifPartnerSet;
        delete noticeToSap.NotifProblemSet;
        delete noticeToSap.NotifTaskSet;

        var fSuccess = function (success) {
            var result = utils.NoticeSerializer.serializeSAPItem2ModelItem(success);
            defer.resolve(result);
        };
        var fError = function (err) {
            defer.reject(err);
        };

        model.service.ODataService.changeNoticeState(noticeToSap, fSuccess, fError);

        return defer.promise;

    },

    deleteAttachment: function (url) {
        var defer = Q.defer();

        var fSuccess = function () {
            defer.resolve();
        };
        var fError = function (err) {
            defer.reject(err);
        };

        model.service.ODataService.deleteNoticeAttachment(url, fSuccess, fError);

        return defer.promise;
    }
};