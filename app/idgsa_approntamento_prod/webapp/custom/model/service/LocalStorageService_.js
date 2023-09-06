jQuery.sap.declare("model.service.LocalStorageService");
//
jQuery.sap.require("jquery.sap.storage");

model.service.LocalStorageService = {
	local : {
		/**
		 * @memberOf utils.LocalStorageService.local
		 */
		save : function(property, value) {
			model.service.LocalStorageService._save(localStorage, property, value);
		},
		get : function(property) {
			return model.service.LocalStorageService._get(localStorage, property);
		},
		remove : function(property) {
			model.service.LocalStorageService._remove(localStorage, property);
		}
	},
	session : {
		/**
		 * @memberOf utils.LocalStorageService.session
		 */
		save : function(property, value) {
			model.service.LocalStorageService._save(sessionStorage, property, value);
		},
		get : function(property) {
			return model.service.LocalStorageService._get(sessionStorage, property);
		},
		remove : function(property) {
			model.service.LocalStorageService._remove(sessionStorage, property);
		}
	},
	/**
	 * @memberOf utils.LocalStorageService
	 */
	_save : function(storage, property, value) {
		var namespace = icms.Component.getMetadata().getManifestEntry("sap.app").id;
		storage.setItem(namespace + '.' + property, JSON.stringify(value));
	},
	_get : function(storage, property) {
		var namespace = icms.Component.getMetadata().getManifestEntry("sap.app").id;
		var objString = storage.getItem(namespace + '.' + property);
		return JSON.parse(objString);
	},
	_remove : function(storage, property) {
		var namespace = icms.Component.getMetadata().getManifestEntry("sap.app").id;
		storage.removeItem(namespace + '.' + property);
	}
};