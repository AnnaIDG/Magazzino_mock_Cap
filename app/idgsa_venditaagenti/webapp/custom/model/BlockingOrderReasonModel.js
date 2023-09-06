
jQuery.sap.declare("model.BlockingOrderReasonModel");

model.BlockingOrderReasonModel = {
    
    _isMock : icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
    
	loadBlockingOrderReasons : function(orderId) {
        if (this._isMock) {
        
            this._defer = Q.defer();
            $.getJSON("custom/model/mockData/BlockingOrderReasons.json").success(function(result) {
                var filterArrayFunction = function(order) {
                  return order.orderId === orderId;
                };
                var items = result.filter(filterArrayFunction);
//                var order = _.find(result, {
//                    'orderId' : orderId
//                });
//                this._defer.resolve(order);
                this._defer.resolve({items:items});
            }.bind(this)).fail(function(err) {
                this._defer.reject(err);
            }.bind(this));
            return this._defer.promise;
        }else{
            //TODO
        }

	}
};


