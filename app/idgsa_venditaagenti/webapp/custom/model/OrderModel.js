jQuery.sap.declare("model.OrderModel");
jQuery.sap.require("model.CustomerModel");
jQuery.sap.require("utils.OrderDefaultsSerializer");
jQuery.sap.require("utils.OrderSerializer");

model.OrderModel = {
	/**
	 * @memberOf model.OrderModel
	 */
	_isMock : icms.Component.getMetadata().getManifestEntry("sap.app").isMock,

	getOrderList : function(req) {

		if (this._isMock) {
			this._orderDefer = Q.defer();
			$.getJSON("custom/model/mockData/OrdersListMock.json").success(function(result) {
				var filteredResult = [];
				if (!!req.Kunnr && req.Kunnr.length > 0)
					filteredResult = _.where(result, {
						'customerId' : req.Kunnr
					});
				if (filteredResult.length > 0) {
					this._orderDefer.resolve(filteredResult);
				} else {
					this._orderDefer.resolve(result);
				}

			}.bind(this)).fail(function(err) {
				this._orderDefer.reject(err);
			}.bind(this));
			return this._orderDefer.promise;
		} else {
			var orderListDefer = Q.defer();
			var fSuccess = function(result) {
				var ordersList = utils.OrderSerializer.OrdersList.fromSapItems(result);
				orderListDefer.resolve(ordersList);
			};
			var fError = function(err) {
				orderListDefer.reject(err.statusText);
			};

			fSuccess = _.bind(fSuccess, this);
			fError = _.bind(fError, this);

			model.service.ODataService.getOrdersList(req, fSuccess, fError);

			return orderListDefer.promise;
		}

	},

	getOrderDetail : function(orderId) {
		this._orderDefer = Q.defer();
		$.getJSON("custom/model/mockData/OrdersMock.json").success(function(result) {
			var order = _.find(result, {
				'orderId' : orderId
			});
			this._orderDefer.resolve(order);
		}.bind(this)).fail(function(err) {
			this._orderDefer.reject(err);
		}.bind(this));
		return this._orderDefer.promise;
	},

	getCustomerDefaults : function(data) {
		if (this._isMock) {
			this._defaultDefer = Q.defer();
			$.getJSON("custom/model/mockData/OrderDefaultsMock.json").success(function(result) {
				var customerOrderDefaultsMock = utils.OrderDefaultsSerializer.OrderDefault.fromSap(result);
				this._defaultDefer.resolve(customerOrderDefaultsMock);
			}.bind(this)).fail(function(err) {
				this._defaultDefer.reject(err);
			}.bind(this));
			return this._defaultDefer.promise;
		} else {
			this._defaultDefer = Q.defer();
			var success = function(result) {
				console.log(result);
				var customerOrderDefaults = utils.OrderDefaultsSerializer.OrderDefault.fromSap(result);
				this._defaultDefer.resolve(customerOrderDefaults);
			}.bind(this);
			//
			var error = function(err) {
				this._defaultDefer.reject(err.statusText);
			}.bind(this);
			var params = '(';
			params = params + "IStcd1='" + data.codiceFiscale + "',";
			params = params + "IStceg='" + data.partitaIVA + "',";
			params = params + "Bukrs='" + data.society + "',";
			params = params + "Vkorg='" + data.salesOrg + "',";
			params = params + "Vtweg='" + data.distributionChannel + "',";
			params = params + "Spart='" + data.division + "',";
			params = params + "Cdage='" + data.agentCode + "',";
			params = params + "Kunnr='" + data.customerId + "')";
			model.service.ODataService.getCustomerDefault(params, success, error);
			return this._defaultDefer.promise;
		}

	},

	createNewOrder : function(serializedData) {
		this.orderId = undefined;
		this.customerId = undefined;
		this.customerName = undefined;
		this.docType = undefined;
		this.nrDocCliente = undefined;
		this.modConsegna = undefined;
		this.rifOrder = undefined;
		this.basketType = undefined;
		this.destination = undefined;
		this.paymentMethod = undefined;
		this.paymentCondition = undefined;
		this.incoterms = undefined;
		this.meansShipping = undefined;
		this.totalEvasion = undefined;
		this.appointmentToDelivery = undefined;
		this.deliveryType = undefined;
		this.chargeTrasport = undefined;
		this.IVACode = undefined;
		this.validDateList = undefined;
		this.requestedDate = new Date();
		this.orderReason = undefined;
		this.notes = [];

		this.update = function(data) {
			for ( var prop in data) {
				this[prop] = data[prop];
			}
		};

		return this;
	},

	saveOrder : function() {

	},

	createOrderFromData : function(o) {
		for ( var prop in o) {
			this.prop = o[prop];
		}
		return this;
	}
};
