jQuery.sap.declare("utils.EquipmentSerializer");

utils.EquipmentSerializer = {
	/**
	 * @memberOf EquipmentSerializer
	 */
	serializeSAPList2ModelList : function(list) {
		var result = [];
		if (list && list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				result.push(this.serializeSAPItem2ModelItem(list[i]));
			}
		}
		return result;
	},

	serializeSAPItem2ModelItem : function(item) {
		var equipment = {};
		equipment.id = (item && item.Equipment) ? item.Equipment : "";
		equipment.description = (item && item.Equidescr) ? item.Equidescr : "";
		// (item && item.Catprofile) ? item.Catprofile : "";
		equipment.supEquipment = (item && item.EquipmentSup) ? item.EquipmentSup : "";
		equipment.supTechPlace = (item && item.FunctLocSup) ? item.FunctLocSup : "";

		equipment.rfidCode = item && item.RfidCodeEqui ? item.RfidCodeEqui : "";

		equipment.rfidEditable = false;
		equipment.ultimo = item && item.Outlast ? (item.Outlast == "X") : false;
		return equipment;
	},

	toSap : function(s) {
		var e = {};
		e.Equipment = s && s.id ? s.id : "";
		e.RfidCodeEqui = s && s.rfidCode ? s.rfidCode : "";
		return e;
	}
};
