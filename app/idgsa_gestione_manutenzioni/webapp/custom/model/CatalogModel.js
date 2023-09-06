jQuery.sap.declare("model.CatalogModel");
jQuery.sap.require("utils.CatalogSerializer");
jQuery.sap.require("model.service.LocalStorageService");

model.CatalogModel = {
		
	getCatalog : function(params) {
            var defer = Q.defer();
        
            var req = {};
            req.FunctLoc = params.FuncLoc ? params.FuncLoc : "";
            req.Equipment = params.Equipment ? params.Equipment : "";
        
            var fSuccess = function(res)
            {
                var result = utils.CatalogSerializer.fromSapItems(res);
                
                defer.resolve(result);
            }
            var fError = function(err)
            {
                defer.reject(err);
            }
            fSuccess = _.bind(fSuccess, this);
            fError = _.bind(fError, this);
        
            model.service.ODataService.getCatalog(req, fSuccess, fError);
            return defer.promise;
	}
};