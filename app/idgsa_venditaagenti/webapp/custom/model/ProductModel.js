jQuery.sap.declare("model.ProductModel");

model.ProductModel = {
	getProductDetail : function(productId, salesOrg) {
		this._defer = Q.defer();
		$.getJSON("custom/model/mockData/ProductsMock"+salesOrg+".json").success(function(result) {
			var product = _.find(result, {
				'productId' : productId
			});
			this._defer.resolve(product);

		}.bind(this)).fail(function(err) {
			this._defer.reject(err);
		}.bind(this));
		return this._defer.promise;

	}
};
