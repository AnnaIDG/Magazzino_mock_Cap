jQuery.sap.declare("utils.TechPlaceSerializer");

utils.TechPlaceSerializer = {
	/**
	 * @memberOf utils.TechPlaceSerializer
	 * @param sapItems
	 * @returns {Array}
	 */
	fromSapItems : function(sapItems) {
		var results = [];
		if (sapItems && sapItems.length > 0) {
			for (var i = 0; i < sapItems.length; i++) {
				results.push(this.fromSapItem(sapItems[i]));
			}
		}
		return results;
	},

	fromSapItem : function(sapItem) {
		var item = {};
		item.techPlaceId = sapItem.id;
		item.description = sapItem.description;
        item.rfid = sapItem.rfid;
		item.type = sapItem.type;
		item.typeDescr = sapItem.typeDescr;
		item.category = sapItem.category;
		item.categoryDescr = sapItem.categoryDescr;
		item.rfidEditable = (sapItem.rfid == "");
		return item;
	},
	
	serializeSAPList2ModelList : function(list){
		var result = [];
		if (list && list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				result.push(this.serializeSAPItem2ModelItem(list[i]));
			}
		}
		return result;
	},
	
	serializeSAPItem2ModelItem : function(item){
		var techPlace = {};
		techPlace.id = (item && item.FunctLoc) ? item.FunctLoc : "";
		techPlace.description = (item && item.Funcldescr) ? item.Funcldescr : "";
		//(item && item.Catprofile) ? item.Catprofile : "";
		//(item && item.Tplkz) ? item.Tplkz : "";
		//(item && item.Fltyp) ? item.Fltyp : "";
		techPlace.supTechPlace = (item && item.FunctLocSup) ? item.FunctLocSup : "";
		//(item && item.Eqart) ? item.Eqart : "";
        techPlace.rfidCode = item.RfidCode ? item.RfidCode : "";
		techPlace.ultimo = (item && item.Outlast)? item.Outlast : "";
		
		techPlace.rfidEditable = false; // Default -> It's used only in rfidLoader
		
		return techPlace;
	},
    
    serializeSAPItem2ModelItemEquip : function(item)
    {
        var equip = {};
        equip.id = (item && item.Equipment) ? item.Equipment : "";
		equip.description = (item && item.Equidescr) ? item.Equidescr : "";
		equip.descriptionTechPlace = (item && item.Funcldescr) ? item.Funcldescr : ""; // add Fabio 16/03
		//(item && item.Catprofile) ? item.Catprofile : "";
		//(item && item.Tplkz) ? item.Tplkz : "";
		//(item && item.Fltyp) ? item.Fltyp : "";
		equip.supTechPlace = (item && item.FunctLocSup) ? item.FunctLocSup : "";
		//(item && item.Eqart) ? item.Eqart : "";
        equip.rfidCode = item.RfidCodeEqui ? item.RfidCodeEqui : "";
		equip.ultimo = (item && item.Outlast)? item.Outlast : "";
		equip.rfidEditable=false;
        
        
        return equip;
    },
    
    toSap : function(item)
    {
    	var t = {};
    	t.FunctLoc = item && item.id ? item.id : "";
    	t.RfidCode = item && item.rfidCode ? item.rfidCode : "";
    	
    	return t;
//    	t.Funcldescr = item.description;
//    	t.Catprofile=
//    	t.Tplkz
//    	t.Fltyp
//    	t.FunctLocSup
//    	t.Eqart
//   	t.Outlast
    
    	

    }
    
    
};