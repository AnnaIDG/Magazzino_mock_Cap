jQuery.sap.declare("model.ComboBoxModel");
jQuery.sap.require("utils.ComboBoxSerializer");

model.ComboBoxModel = {
	_isMock: icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
	/**
	 * @memberOf model.ComboBoxModel
	 */
	getPriorityList: function (item) {
		this.model = new sap.ui.model.resource.ResourceModel({
			bundleUrl: "custom/i18n/i18n.properties"

		});
		var defer = Q.defer();

		var fSuccess = function (result) {
			var res = [];
			if (result && result.results)
				res = utils.ComboBoxSerializer.priority.serializeSAPList2ModelList(result.results);
			defer.resolve(res);
		};

		var fError = function (err) {
			defer.reject(err);
		};

		if (this._isMock) {
			$.getJSON("custom/model/mockData/Priorities.json").success(function (result) {
				var res = (item && item.id) ? _.filter(result.results, { id: item.id }) : result.results;
				defer.resolve(res);
			}).fail(fError);
		} else {
			var req = {};
			if (item && item.id) {
				req.ITplnr = item.id;
			};

			model.service.ODataService.getPriorityList(req, fSuccess, fError);
		}

		return defer.promise;
	}
};
