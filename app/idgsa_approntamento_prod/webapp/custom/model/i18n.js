jQuery.sap.declare("model.i18n");

model.i18n = {
    
    model : undefined,
    
    _getLocaleText: function (key) {
        return this.getModel("i18n").getProperty(key);
    },

    getModel: function() {
        
        if (this.model === undefined) {
            
            this.model = new sap.ui.model.resource.ResourceModel({
                bundleUrl: "custom/i18n/i18n.properties"
                
            });
            this.T = this.model.getResourceBundle();           
        }
       
        return this.model;
    }

};
(function(){
  model.i18n.getModel();
})();
