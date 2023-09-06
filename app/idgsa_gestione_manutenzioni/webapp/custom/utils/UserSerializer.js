jQuery.sap.declare("utils.UserSerializer");

utils.UserSerializer = {
	/**
	 * @memberOf utils.UserSerializer
	 */
	serializeSAPItem2ModelItem : function(item){
		var user = {};
        user.userName = item.Uname ? item.Uname :"";
        
		user.statusAuthorization = item.statusAuthorization ? item.StatusAuthorization : "";
        user.canCreate = item.ActionCreate ? item.ActionCreate : "";
        user.canDelete = item.ActionDelete ? item.ActionDelete : "";
        user.isRtt = (item.IsRtt && item.IsRtt != "") ? "X" : "" ;
        user.notifCreate = item.NotifCreate ? item.NotifCreate : "" ; // SE vale X lo user può creare gli avvisi
        user.notifUpdate = item.NotifUpdate ? item.NotifUpdate : "" ; // SE vale X lo user può modificare gli avvisi
        user.rfidEquiUpdate = item.RfidEquiUpdate ? item.RfidEquiUpdate : "" ; // SE vale X lo user può modificare gli equipment, ovvero è abilitato alla modifica dello RFiD
        user.rfidFnclocUpdate = item.RfidFnclocUpdate ? item.RfidFnclocUpdate : "" ; // SE vale X lo user può modificare le sedi tecniche, ovvero è abilitato alla modifica dello RFiD
        
        return user;
	},
	
	serializeModelItem2SAPItem : function(item){
		var p = {};
		return p;
	}
};