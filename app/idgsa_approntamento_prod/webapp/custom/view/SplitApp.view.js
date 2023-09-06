sap.ui.jsview("view.SplitApp", {

	getControllerName: function() {
		return "controller.SplitApp";
	},

	createContent: function(oController) {
		this.setDisplayBlock(true);
//		this.app = new sap.m.SplitApp("splitApp");
		this.app = new sap.m.SplitApp("splitApp", {});
		return this.app;
	}
});
