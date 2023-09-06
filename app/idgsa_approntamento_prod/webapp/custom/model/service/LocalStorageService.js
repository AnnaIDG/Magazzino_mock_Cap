jQuery.sap.declare("model.service.LocalStorageService");
//
jQuery.sap.require("jquery.sap.storage");

model.service.LocalStorageService = {
	_sgt : icms.Component.getMetadata().getManifestEntry("sap.app").bcube,
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
		storage.setItem(namespace + '.' + property, this._encrypt(JSON.stringify(value)));
	},
	_get : function(storage, property) {
		var namespace = icms.Component.getMetadata().getManifestEntry("sap.app").id;
		var objString = storage.getItem(namespace + '.' + property);
		return JSON.parse(this._decrypt(objString));
	},
	_remove : function(storage, property) {
		var namespace = icms.Component.getMetadata().getManifestEntry("sap.app").id;
		storage.removeItem(namespace + '.' + property);
	},
	/**
	 * String to base64
	 */
	_utoa : function(str){
		if(str){
			//ucs-2 string to base64 encoded ascii
		    return window.btoa(unescape(encodeURIComponent(str)));
		    //string to base64
			//return window.btoa(str);
		} else {
			return null;
		}
	},
	/**
	 * base64 to String
	 */
	_atou: function(str){
		if(str){
			//base64 encoded ascii to ucs-2 string
			return decodeURIComponent(escape(window.atob(str)));
			//base64 to String
			//return window.atob(str);
		} else {
			return null;
		}
	},
	_encrypt : function(str){
		if(str){
			return sjcl.encrypt(this._sgt, str);
		} else {
			return null;
		}
	},
	_decrypt : function(str){
		if(str){
			return sjcl.decrypt(this._sgt, str);
		} else {
			return null;
		}
	}
};