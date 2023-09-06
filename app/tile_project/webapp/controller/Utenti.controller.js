sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./Utils"
], function(Controller, Utils) {
	"use strict";

	return Controller.extend("tileproject.tileproject.controller.Utenti", {

		onDropAvailableProductsTable: function(oEvent) {
			var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext();
			if (!oDraggedItemContext) {
				return;
			}

			// reset the rank property and update the model to refresh the bindings
			var oAvailableProductsTable = this.getView().byId("table");
			var oProductsModel = oAvailableProductsTable.getModel();
			oProductsModel.setProperty("Rank", Utils.ranking.Initial, oDraggedItemContext);
		},

		moveToSelectedProductsTable: function() {
			var oAvailableProductsTable = this.getView().byId("table");
			Utils.getSelectedItemContext(oAvailableProductsTable, function(oAvailableItemContext, iAvailableItemIndex) {
				var oSelectedProductsTable = this.getView().byId("table");
				var oFirstItemOfSelectedProductsTable = oSelectedProductsTable.getItems()[0];
				var iNewRank = Utils.ranking.Default;

				if (oFirstItemOfSelectedProductsTable) {
					var oFirstContextOfSelectedProductsTable = oFirstItemOfSelectedProductsTable.getBindingContext();
					iNewRank =  Utils.ranking.Before(oFirstContextOfSelectedProductsTable.getProperty("Rank"));
				}

				var oProductsModel = oAvailableProductsTable.getModel();
				oProductsModel.setProperty("Rank", iNewRank, oAvailableItemContext);

				// select the inserted and previously selected item
				oSelectedProductsTable.getItems()[0].setSelected(true);
				var oPrevSelectedItem = oAvailableProductsTable.getItems()[iAvailableItemIndex];
				if (oPrevSelectedItem) {
					oPrevSelectedItem.setSelected(true);
				}
			}.bind(this));
		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameter("listItem").setSelected(true);
		}
	});

});