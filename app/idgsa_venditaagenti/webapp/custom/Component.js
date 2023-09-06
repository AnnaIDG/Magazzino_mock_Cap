jQuery.sap.declare("icms.Component");

sap.ui.core.UIComponent.extend("icms.Component", {
	metadata : {
		manifest : "json"
	},
	init: function () {
		jQuery.sap.registerModulePath("view", "custom/view");
		jQuery.sap.registerModulePath("controller", "custom/controller");
		jQuery.sap.registerModulePath("model", "custom/model");
		jQuery.sap.registerModulePath("utils", "custom/utils");

		// call the base component's init function and create the App view (call overridden init > createContent)
		
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		this.getRouter().initialize();
	},
	
	destroy: function () {
		sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
	},
	
	createContent: function () {
        // create root view
        var oView = sap.ui.view({
            id: "mainApp",
            viewName: "view.App",
            type: "XML",
            viewData: {
                component: this
            }
        });

        return oView;
    }
});