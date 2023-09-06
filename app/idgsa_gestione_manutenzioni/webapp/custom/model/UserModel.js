jQuery.sap.declare("model.UserModel");
//
jQuery.sap.require("model.service.ODataService");
jQuery.sap.require("utils.UserSerializer");

model.UserModel = {
	/**
	 * @memberOf model.UserModel
	 * @param username
	 * @param password
	 * @returns
	 */
	_isMock: icms.Component.getMetadata().getManifestEntry("sap.app").isMock,

	login: function (username, password) {

		this.uname = username;

		this._defer = Q.defer();

		if (this._isMock) {
			this.loginMock(username, password);
		} else {
			var success = function (result) {
				//			
				//            this.getUserType(this.uname, this._defer);
				this.checkValuePsw(this.uname, this._defer);
			}.bind(this);
			//
			var error = function (err) {
				this._defer.reject(err.statusText);
			}.bind(this);
			//
			model.service.ODataService.login(username, password, success, error);
		}

		return this._defer.promise;

	},

	loginMock: function (username, password) {
		$.getJSON("custom/model/mockData/UsersMock.json")
			.success(function (result) {
				var userLogged = _.chain(result.users)
					.filter({ userAlias: username.toUpperCase(), password: password })
					.map(function (data) {
						data.userName = data.userLogged;
						delete data.userAlias;
						delete data.password;
						data.statusAuthorization = "";
						data.canCreate = "";
						data.canDelete = "";
						data.isRtt = "";
						data.notifCreate = "X"; // SE vale X lo user può creare gli avvisi
						data.notifUpdate = "X"; // SE vale X lo user può modificare gli avvisi
						data.rfidEquiUpdate = "X"; // SE vale X lo user può modificare gli equipment, ovvero è abilitato alla modifica dello RFiD
						data.rfidFnclocUpdate = "X"; // SE vale X lo user può modificare le sedi tecniche, ovvero è abilitato alla modifica dello RFiD
						return data;
					})
					.first()
					.value();
				this._defer.resolve(userLogged);
			}.bind(this));
	},

	logout: function () {
		this._defer = Q.defer();
		if (!this._isMock) {
			var success = function (result) {
				this._defer.resolve("LOGOUT SUCCESSFUL");
			}.bind(this);
			//
			var error = function (err) {
				this._defer.reject(err);
			}.bind(this);
			//
			model.service.ODataService.logout(success, error);
		} else {
			this._defer.resolve("LOGOUT SUCCESSFUL");
		}
		return this._defer.promise;
	},

	checkValuePsw: function (uname, defer) {
		var fSuccess = function (result) {
			this.getUserType(this.uname, this._defer);
		};
		var fError = function (err) {
			defer.reject(err);
		};

		fSuccess = _.bind(fSuccess, this);
		fError = _.bind(fError, this);

		model.service.ODataService.checkPsw(uname, fSuccess, fError);
	},

	getUserType: function (uname, defer) {
		var fSuccess = function (success) {
			var userLogged = utils.UserSerializer.serializeSAPItem2ModelItem(success);
			defer.resolve(userLogged);
		};
		var fError = function (err) {
			defer.reject(err);
		};

		fSuccess = _.bind(fSuccess, this);
		fError = _.bind(fError, this);

		model.service.ODataService.getUserType(uname, fSuccess, fError);
	},

	changeUserPassword: function (entity) {
		var defer = Q.defer();
		var fSuccess = function () {
			defer.resolve();
		};
		var fError = function (err) {
			defer.reject(err);
		};

		fSuccess = _.bind(fSuccess, this);
		fError = _.bind(fError, this);

		model.service.ODataService.changePassword(entity, fSuccess, fError);
		return defer.promise;
	}
};