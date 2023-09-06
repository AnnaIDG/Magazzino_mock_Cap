sap.ui.jsview("view.SplitApp", {

	getControllerName: function() {
		return "controller.SplitApp";
	},

	createContent: function(oController) {
		this.setDisplayBlock(true);
		this.app = new sap.m.SplitApp("splitApp", {
            
        });
        
        this.app.addEventDelegate({
            onAfterRendering: function () {
                if(this.app.getMode() === sap.m.SplitAppMode.ShowHideMode) {
                    this.app.showMaster();
                }
            }.bind(this)
        }, this);
        
		return this.app;
	}
});
