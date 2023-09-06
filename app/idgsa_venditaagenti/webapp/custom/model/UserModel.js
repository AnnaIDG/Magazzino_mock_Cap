jQuery.sap.declare("model.UserModel");
//
jQuery.sap.require("utils.UserSerializer");
jQuery.sap.require("model.service.ODataService");

model.UserModel = {
	/**
	 * @memberOf model.UserModel
	 */
	_isMock : icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
	
	_mockLogin : function() {
		// TODO
	},

	login : function(username, password) {
		if (this._isMock) {
			this._defer = Q.defer();
			$.getJSON("custom/model/mockData/UsersMock.json").success(function(result) {
				var users = utils.UserSerializer.user.fromSapItems(result);
				var filteredUser = _.filter(users, function(o) {
					return o.userId.toUpperCase() === username.toUpperCase();
				});
				if (!filteredUser || filteredUser.length === 0) {
					this._defer.reject("No such user found");
				} else if (filteredUser[0].password !== password) {
					this._defer.reject("Wrong password");
				}
				this._defer.resolve(filteredUser);
			}.bind(this)).fail(function(err) {
				this._defer.reject(err);
			}.bind(this));
			return this._defer.promise;
		} else {
			this._defer = Q.defer();
			var success = function(result) {
				var users = utils.UserSerializer.user.fromSapItems(result);
				if (!users || users.length === 0) {
					this._defer.reject("No such user found");
				}
				this._defer.resolve(users);
			}.bind(this);
			//
			var error = function(err) {
				this._defer.reject(err.statusText);
			}.bind(this);
			//
			model.service.ODataService.login(username, password, success, error);
			return this._defer.promise;
		}
	},
	
	logout : function(){
		if (!this._isMock) {
			this._defer = Q.defer();
			var success = function(result) {
				this._defer.resolve("LOGOUT SUCCESSFUL");
			}.bind(this);
			//
			var error = function(err) {
				this._defer.reject(err.statusText);
			}.bind(this);
			//
			model.service.ODataService.logout(success, error);
			return this._defer.promise;
		} else {
			this._defer = Q.defer();
			this._defer.resolve("LOGOUT SUCCESSFUL");
			return this._defer.promise;
		}
	}
};