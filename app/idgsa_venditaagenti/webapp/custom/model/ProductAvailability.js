jQuery.sap.declare("model.ProductAvailability");
//jQuery.sap.require("utils.ProductAvailabilitySerializer");

model.ProductAvailability = {
    
    _isMock : icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
    
	getAvailabilityByProductId : function(productId, reqQty) {
        if (this._isMock) {
            this._defer = Q.defer();
            var obj = {};
            $.getJSON("custom/model/mockData/ProductsAvailabilityMock.json").success(function(result) {
                var product = _.find(result, {
                    'productId' : productId
                });
                if(!product){
                    obj.warning = false;
                    obj.available = false;
                    this._defer.resolve(obj);
                    return;
                }
//                var futureDate = new Date(product.futureDate);
//                var requestedDate = new Date(product.reqDate);
                var quantityAvailable = parseInt(product.quantity);
                reqQty = parseInt(reqQty);
//                if(requestedDate > futureDate){
//                    obj.warning = false;
//                    obj.available = true;
//                }else{
                    if(reqQty > quantityAvailable){
                        obj.warning = false;
                        obj.available = false;
                    }else{
                        if(reqQty < quantityAvailable/2){
                            obj.warning = false;
                            obj.available = true;
                        }else{
                            obj.warning = true;
                            obj.available = true;
                        }
                    }
//                }
                this._defer.resolve(obj);

            }.bind(this)).fail(function(err) {
                this._defer.reject(err);
            }.bind(this));
            return this._defer.promise;
        }else{
            
            /*This is for later when odata calls will be implemented
            this._defer = Q.defer();			
			var success = function(result) {
				console.log(result);
				var availabilityData = utils.ProductAvailabilitySerializer.AvailabilityData.fromSapItems(result);
				this._defer.resolve(availabilityData);
			}.bind(this);

			var error = function(err) {
				this._defer.reject(err.statusText);
			}.bind(this);

			var params = '?$filter=';
			params = params + "Uname eq '" + data.username + "'";
			params = params + " and Bukrs eq '" + data.society + "'";
			params = params + " and Vkorg eq '" + data.salesOrg + "'";
			params = params + " and Vtweg eq '" + data.distributionChannel + "'";
			params = params + " and Spart eq '" + data.division + "'";
			params = params + " and Vkbur eq '" + data.salesOffice + "'";
			params = params + " and Cdage eq '" + data.agentCode + "'";
			model.service.ODataService.getProductAvailabilityData(params, success, error);
			return this._defer.promise;
            */
        }
	}
};
