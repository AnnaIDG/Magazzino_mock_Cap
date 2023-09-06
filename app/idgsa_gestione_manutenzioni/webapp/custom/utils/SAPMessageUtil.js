jQuery.sap.declare("utils.SAPMessageUtil");

utils.SAPMessageUtil = {
	/**
	 * @memberOf utils.SAPMessageUtil
	 * @param err the SAP error
	 * @returns the SAP error message
	 */	
	getErrorMessage : function(err) {
		if (!err.response.body)
			return "Unhandled SAP Exception";
		else {
			try{
				var error = JSON.parse(err.response.body);
				var msg = error.error.message.value;
				return msg;
			} catch(e){
				return err.response.body;
			}
		}
	},
	/**
	 * @param err the SAP error
	 * @returns the SAP error code
	 */
	getErrorCode : function(err) {
		if (!err.response.body)
			return "";
		else {
			var error = JSON.parse(err.response.body);
			var msg = error.error.code ? error.error.code : "";
			return msg;
		}
	},
	/**
	 * @param err the SAP error
	 * @returns a string containing code - message
	 */
	getFormattedError : function(err){
		var code = this.getErrorCode(err);
		var msg = this.getErrorMessage(err);
		return code !== "" ? code + " - " + msg : msg; 
	}
};