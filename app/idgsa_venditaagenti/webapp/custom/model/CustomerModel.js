jQuery.sap.declare("model.CustomerModel");
jQuery.sap.require("utils.CustomerSerializer");

model.CustomerModel = {
	/**
	 * @memberOf model.CustomerModel
	 */
	_isMock : icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
	
	getCustomers : function(data) {
		if (this._isMock) {
			this._defer = Q.defer();
			$.getJSON("custom/model/mockData/CustomersMock.json").success(function(result) {
				var customers = utils.CustomerSerializer.Customers.fromSapItems(result);
				var filteredCustomers = [];
				// chiamata che richiede le stesse proprietà dell'odata in input
				filteredCustomers = _.where(customers, {
					'username' : data.username,
					'userAlias' : data.alias,
					'society' : data.society,
					'salesOrg' : data.salesOrg,
					'distributionChannel' : data.distributionChannel,
					'division' : data.division,
					'salesOffice' : data.salesOffice,
					'salesGroup' : data.salesGroup,
					'agentCode' : data.agentCode
				});

				this._defer.resolve(filteredCustomers);
			}.bind(this)).fail(function(err) {
				this._defer.reject(err);
			}.bind(this));
			return this._defer.promise;
		} else {
			this._defer = Q.defer();			
			var success = function(result) {
				console.log(result);
				var customers = utils.CustomerSerializer.Customers.fromSapItems(result);
				this._defer.resolve(customers);
			}.bind(this);
			//
			var error = function(err) {
				this._defer.reject(err.statusText);
			}.bind(this);
			//
			var params = '?$filter=';
			params = params + "Uname eq '" + data.username + "'";
			params = params + " and Bukrs eq '" + data.society + "'";
			params = params + " and Vkorg eq '" + data.salesOrg + "'";
			params = params + " and Vtweg eq '" + data.distributionChannel + "'";
			params = params + " and Spart eq '" + data.division + "'";
			params = params + " and Vkbur eq '" + data.salesOffice + "'";
			params = params + " and Cdage eq '" + data.agentCode + "'";
			model.service.ODataService.getCustomersList(params, success, error);
			return this._defer.promise;
		}
	},

	getCustomerDetail : function(data) {
		if (this._isMock) {
			this._customerDefer = Q.defer();
			$.getJSON("custom/model/mockData/CustomerDetailMock.json").success(
					function(result) {
						var customers = utils.CustomerSerializer.Customer.fromSapItems(result);
						var newArray = _.filter(customers, function(el) {
							return el.registry.society === data.society && el.registry.salesOrg === data.salesOrg
									&& el.registry.distributionChannel === data.distributionChannel
									&& el.registry.division === data.division
									&& el.registry.agentCode === data.agentCode
									&& el.registry.customerId === data.customerId;
						});
						this._customerDefer.resolve(newArray[0]);
					}.bind(this)).fail(function(err) {
						this._customerDefer.reject(err);
					}.bind(this));
			return this._customerDefer.promise;
		} else {
			this._customerDefer = Q.defer();
			var success = function(result) {
				console.log(result);
				var customer = utils.CustomerSerializer.Customer.fromSap(result);
				this._customerDefer.resolve(customer);
			}.bind(this);
			//
			var error = function(err) {
				this._customerDefer.reject(err.statusText);
			}.bind(this);
			//
			var params = '(';
			params = params + "Bukrs='" + data.society + "',";
			params = params + "Vkorg='" + data.salesOrg + "',";
			params = params + "Vtweg='" + data.distributionChannel + "',";
			params = params + "Spart='" + data.division + "',";
			params = params + "Cdage='" + data.agentCode + "',";
			params = params + "Kunnr='" + data.customerId + "')";
			model.service.ODataService.getCustomerDetail(params, success, error);
			return this._customerDefer.promise;
		}
	},

	createNewCustomer : function(serializedData) {
		this.registry = {};
		if (serializedData && serializedData.registry) {
			this.registry = serializedData.registry;
		}
		this.contact = {};
		if (serializedData && serializedData.contact) {
			this.contact = serializedData.contact;
		}
		this.bank = {};
		if (serializedData && serializedData.bank) {
			this.bank = serializedData.bank;
		}
		this.sales = {};
		if (serializedData && serializedData.sales) {
			this.sales = serializedData.sales;
		}
		this.destinations = [];
		if (serializedData && serializedData.destinations) {
			this.destinations = serializedData.destinations;
		}
		this.customerStatus = {};
		if (serializedData && serializedData.customerStatus) {
			this.customerStatus = serializedData.customerStatus;
		}

		this.getModel = function() {
			var model = new sap.ui.model.json.JSONModel(this);
			return model;
		};
		return this;
	},

};
