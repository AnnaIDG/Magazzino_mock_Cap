jQuery.sap.declare("model.TechPlaceModel");
jQuery.sap.require("utils.TechPlaceSerializer");
jQuery.sap.require("utils.EquipmentSerializer");
jQuery.sap.require("utils.TechPlaceChildrenListSerializer");
jQuery.sap.require("utils.SAPMessageUtil");

model.TechPlaceModel = {
	_isMock: icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
	/**
	 * @memberOf model.NoticeModel
	 */
	getInstance: function () {
		var techPlace = {};
		/* To Do if there are function to do on techPlace */
		return techPlace;
	},

	getTechPlaces: function (params, equip) {
		var defer = Q.defer();
		this.equip = equip;
		var _techPlaces = [];
		var _equipment = [];
		var req = {
			"FunctLocSup": params && params.supTechPlace ? params.supTechPlace : ""
		};

		var fSuccess = function (res) {
			if (!this.equip) {
				if (res && res.results && res.results.length > 0)
					_techPlaces = utils.TechPlaceSerializer.serializeSAPList2ModelList(res.results);

				defer.resolve(_techPlaces);
			} else {
				if (res && res.results && res.results.length > 0) {
					for (var i = 0; i < res.results.length; i++) {
						_equipment.push(utils.TechPlaceSerializer.serializeSAPItem2ModelItemEquip(res.results[i]));
					}
				}
				defer.resolve(_equipment);
			}
		};
		fSuccess = _.bind(fSuccess, this);

		var fError = function (err) {
			defer.reject(err);
		};
		fError = _.bind(fError, this);

		if (!equip) {
			if (this._isMock) {
				$.getJSON("custom/model/mockData/TechPlaceModel.json").success(function (result) {
					defer.resolve(result)
				}.bind(this)).fail(fError);
			} else {
				model.service.ODataService.loadTechPlaces(req, fSuccess, fError);
			}
		} else {
			if (this._isMock) {
				$.getJSON("custom/model/mockData/EquipmentsMock.json").success(function (result) {
					defer.resolve(result)
				}.bind(this)).fail(fError);
			} else {
				model.service.ODataService.loadEquipments(req, fSuccess, fError);
			}
		}

		return defer.promise;
	},

	getTechPlaceOrEquipmentFromRfid: function (rfid) {
		var defer = Q.defer();

		this.code = rfid;
		this.req = {};
		this.req.RfidCode = rfid;

		var fSuccess = function (res) {
			if (res && res.results && res.results.length == 0) {
				this.getEquipmentFromRfid(this.code, defer);
			} else if (res && res.results && res.results.length > 1) {
				defer.reject("Error - Found more than one tech place");
			} else {
				var techPlace = utils.TechPlaceSerializer.serializeSAPItem2ModelItem(res.results[0]);
				techPlace.tech = "X";
				defer.resolve(techPlace);
			}
		};
		var fError = function (err) {
			defer.reject(err);
		};

		fSuccess = _.bind(fSuccess, this);
		fError = _.bind(fError, this);

		model.service.ODataService.getTechPlaceFromRfid(this.req, fSuccess, fError);

		return defer.promise;
	},

	getEquipmentFromRfid: function (rfid, defer) {
		var req = {};
		req.RfidCodeEqui = rfid;
		var fSuccess = function (res) {
			if (res && res.results && res.results.length > 1) {
				defer.reject("Error - Found more than one equipment");
			} else if (res && res.results && res.results.length == 0) {
				defer.resolve(res);
			}
			if (res && res.results && res.results.length == 1) {
				var equipment = utils.TechPlaceSerializer.serializeSAPItem2ModelItemEquip(res.results[0]);
				equipment.equip = "X";
				defer.resolve(equipment);
			}
		};
		var fError = function (err) {
			defer.reject(err);
		};

		fSuccess = _.bind(fSuccess, this);
		fError = _.bind(fError, this);

		model.service.ODataService.getEquipmentFromRfid(req, fSuccess, fError);
	},

	assignRfid: function (rfidObj, isEquipment) {
		var defer = Q.defer();
		var fSuccess = function (res) {
			defer.resolve(res);
		};
		fSuccess = _.bind(fSuccess, this);

		var fError = function (err) {
			var error = utils.SAPMessageUtil.getFormattedError(err);
			defer.reject(error);
		};
		fError = _.bind(fError, this);

		if (!isEquipment) {
			var techPlace = utils.TechPlaceSerializer.toSap(rfidObj);
			model.service.ODataService.updateTechPlace(techPlace, fSuccess, fError);
		} else {
			var equipment = utils.EquipmentSerializer.toSap(rfidObj);
			model.service.ODataService.updateEquipment(equipment, fSuccess, fError);
		}

		return defer.promise;
	},

	getTechPlace: function (id) {
		var defer = Q.defer();
		model.service.ODataService.getTechPlace(id, function (res) {
			if (res && res.results && res.results.length > 1) {
				defer.reject("Error - Found more than one tech place");
			} else {
				var techPlace = utils.TechPlaceSerializer.serializeSAPItem2ModelItem(res.results[0]);
				defer.resolve(techPlace);
			}
		}, function (err) {
			var error = utils.SAPMessageUtil.getFormattedError(err);
			defer.reject(error);
		});
		return defer.promise;
	},

	getEquipment: function (id) {
		var defer = Q.defer();
		model.service.ODataService.getEquipment(id, function (res) {
			if (res && res.results && res.results.length > 1) {
				defer.reject("Error - Found more than one equipment");
			} else {
				var equipment = utils.EquipmentSerializer.serializeSAPItem2ModelItem(res.results[0]);
				defer.resolve(equipment);
			}
		}, function (err) {
			var error = utils.SAPMessageUtil.getFormattedError(err);
			defer.reject(error);
		});
		return defer.promise;
	}
};
