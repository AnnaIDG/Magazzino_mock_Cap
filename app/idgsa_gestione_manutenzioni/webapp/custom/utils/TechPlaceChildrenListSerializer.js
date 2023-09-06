jQuery.sap.declare("utils.TechPlaceChildrenListSerializer");

utils.TechPlaceChildrenListSerializer = {
	
	fromSapItems : function(sapItems) {
        var arr = sapItems.results;
		var results = [];
		if (arr && arr.length > 0) {
			for (var i = 0; i < arr.length; i++) {
				results.push(this.fromSapItem(arr[i]));
			}
		}
		return results;
	},

	fromSapItem : function(sapItem) {
		var item = {};
		item.id = sapItem.id;
		item.description = sapItem.description;
		item.padre = sapItem.Padre;
        item.ultimo = sapItem.ultimo ? sapItem.ultimo : undefined;
        item.livello = sapItem.liv ? parseInt(sapItem.liv) : undefined;
		
		return item;
	},
	
	
};

/*
"id": "subA1"
            , "Padre": "Tp1"
            , "description": "Sub Area 1"
    }
*/