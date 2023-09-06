jQuery.sap.declare("model.TilesModel");

model.TilesModel = {

	getTiles : function(role, session) {
		this.model = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "custom/i18n/i18n.properties"

		});
		var tiles = [ {
			"icon" : "customer-financial-fact-sheet",
			"title" : this.model.getProperty("orderCreateTitle"),
			"url" : "orderCreate",
			"role" : ["AG", "IT"],
			"session" : [true]
		},{
			"icon" : "customer",
			"title" : this.model.getProperty("customerManagementTileTitle"),
			"url" : "customerManagement",
			"role" : ["AG", "IT"],
			"session" : [false]
		}, {
			"icon" : "product",
			"title" : this.model.getProperty("productCatalogTitle"),
			"url" : "productCatalog",
			"role" : ["AG", "IT"],
			"session" : [true]
		}, {
			"icon" : "my-sales-order",
			"title" : this.model.getProperty("orderListTitle"),
			"url" : "orderList",
			"role" : ["AG", "IT"],
			"session" : [true, false]
		}, {
			"icon" : "add-contact",
			"title" : this.model.getProperty("customerCreateTitle"),
			"url" : "customerCreate",
			"role" : ["AG", "IT"],
			"session" : [false]
		}, {
            "_comment" : "",
			"icon" : "customer-view",
			"title" : this.model.getProperty("customerManagementDetail"),
			"url" : "customerManagementDetailFromLaunchpad",
			"role" : ["AG", "IT"],
			"session" : [true]
		}, {
			"icon" : "log",
			"title" : this.model.getProperty("closeCustomerSessionTitle"),
			"url" : "launchpad",
			"role" : ["AG", "IT"],
			"session" : [true]
		}];
		// fitro i tile per il ruolo
		var tileFilteredByRole = _.filter(tiles, function(tile) {
			return _.any(tile.role, function(r) {
				return _.contains(r, role);
			});
		});
		// filtro i tile per session
		var tileFilteredBySession = [];
		for (var i = 0; i < tileFilteredByRole.length; i++) {
			for (var j = 0; j < tileFilteredByRole[i].session.length; j++) {
				if (tileFilteredByRole[i].session[j] === session) {
					tileFilteredBySession.push(tileFilteredByRole[i]);
				}
			}
		}

		return tileFilteredBySession;
	}

};