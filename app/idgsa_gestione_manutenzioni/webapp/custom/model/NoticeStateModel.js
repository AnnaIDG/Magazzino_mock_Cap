jQuery.sap.declare("model.NoticeStateModel");
jQuery.sap.require("model.service.LocalStorageService");
jQuery.sap.require("model.service.ODataService");
jQuery.sap.require("utils.NetworkSerializer");

model.NoticeStateModel = {
	/**
	 * @memberOf model.NoticeStateModel
	 * @returns {Array}
	 */
	_isMock: icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
	_noticeStates: [],

	// _getNoticeStates : function() {
	// 	var noticeStates = [{
	// 		key : "INIZ",
	// 		roles : ["1"]
	// 	}, {
	// 		key : "WIPP",
	// 		roles : ["1,2"]
	// 	}, {
	// 		key : "TOCP",
	// 		roles : ["1"]
	// 	}, {
	// 		key : "TRAS",
	// 		roles : ["1,3"]
	// 	}, {
	// 		key : "WIPM",
	// 		roles : ["1,3,4"]
	// 	}, {
	// 		key : "TOCL",
	// 		roles : ["1,3"]
	// 	}];
	// 	return noticeStates;
	// },

	_getNoticeStatesByRole: function (role) {
		var noticeStates = [];
		if (role && role !== "") {
			noticeStates = _.filter(this._getNoticeStates(), function (state) {
				return _.any(state.roles, function (r) {
					return _.contains(r, role);
				});
			});
		}
		return noticeStates;
	},

	_loadNoticeStates: function () {

		var defer = Q.defer();

		this._noticeStates = [];
		if (this._isMock) {
			defer.resolve([]);
		} else {
			var fSuccess = function (res) {
				if (res && res.results && res.results.length > 0)
					this._noticeStates = utils.NetworkSerializer.fromSapItems(res.results);
				model.service.LocalStorageService.session.save("networkStatusSet", this._noticeStates);
				defer.resolve(this._noticeStates);
			}
			fSuccess = _.bind(fSuccess, this);

			var fError = function (err) {
				this._noticeStates = [];
				defer.reject(err);
			}
			fError = _.bind(fError, this);

			model.service.ODataService.loadNetworkStatus(fSuccess, fError);
		}

		return defer.promise;

	},
	_getNoticeStates: function () {
		if (!this._noticeStates || this._noticeStates.length == 0) {
			this._noticeStates = model.service.LocalStorageService.session.get("networkStatusSet") ? model.service.LocalStorageService.session.get("networkStatusSet") : [];
		}
		return this._noticeStates;
	},
	_getSapStatusByUserStatusAsync: function (userStatus) {
		var defer = Q.defer();

		var status = {};

		var fSuccess = function (res) {
			status = _.find(res, { userStatus: userStatus });
			if (status)
				defer.resolve(status.sapStatus);
			else
				defer.reject("Not Found");
		}
		fSuccess = _.bind(fSuccess, this);

		var fError = function (err) {
			defer.reject(err);
		}
		fError = _.bind(fError, this);

		this._loadNoticeStates()
			.then(fSuccess, fError);

		return defer.promise;
	},
	_getSapStatusByUserStatus: function (userStatus) {
		this._noticeStates = this._getNoticeStates();
		var status = _.find(this._noticeStates, { userStatus: userStatus });
		if (status)
			return status.sapStatus;

		return null;
	}
};
