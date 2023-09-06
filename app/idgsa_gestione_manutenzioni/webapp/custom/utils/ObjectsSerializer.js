jQuery.sap.declare("utils.ObjectsSerializer");

utils.ObjectsSerializer = {
	/**
	 * @memberOf utils.ObjectsSerializer
	 * @param sapItems
	 * @returns {Array}
	 */
	fromSapItems : function(sapItems) {
		var results = [];
        sapItems = sapItems.results;
		if (sapItems && sapItems.length > 0) {
			for (var i = 0; i < sapItems.length; i++) {
				results.push(this.fromSapItem(sapItems[i]));
			}
		}
		return results;
	},

	fromSapItem : function(sapItem) {
		var item = {};
		item.id = sapItem.id;
		item.object = sapItem.object;
        item.idPadre = sapItem.masterCat;
		
        return item;
	},
	
	
};