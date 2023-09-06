jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("utils.Collections");
jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.CustomerModel");
jQuery.sap.require("utils.Validator");
jQuery.sap.require("model.service.LocalStorageService");

controller.AbstractController.extend("controller.CustomerCreate", {

	onExit : function() {

	},

	onInit : function() {
		controller.AbstractController.prototype.onInit.apply(this, arguments);
	},

	handleRouteMatched : function(evt) {

		if (!this._checkRoute(evt, "customerCreate"))
			return;

		controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
		this.uiModel.setProperty("/backButtonVisible", true);

		this.user = model.service.LocalStorageService.session.get("userLogged");

		this.customer = model.CustomerModel.createNewCustomer();

		this.customerModel = this.customer.getModel();
		this.getView().setModel(this.customerModel, "c");
		this.populateSelect();
		this.getView().byId("regAlrtBtn").setVisible(false);
		this.getView().byId("ctAlrtBtn").setVisible(false);
		this.getView().byId("bkAlrtBtn").setVisible(false);
		// this.getView().byId("slsAlrtBtn").setVisible(false);

	},
	refreshView : function(data) {
		this.getView().setModel(data.getModel(), "c");
		// var masterCntrl =
		// this.getView().getModel("appStatus").getProperty("/masterCntrl");
		// masterCntrl.refreshList();
	},
	onSavePress : function() {
		var inputTaxCode = this.getView().byId("inputTaxCode");
		var inputVatNumber = this.getView().byId("inputVatNumber");

		if (!this.validateCheck()) {
			var failedControls = this.getFailedControls();
			_.forEach(failedControls, function(item) {
				var jqueryCntrl = $('#' + item.getId());
				var parents = jqueryCntrl.parents();
				var jqueryPanel = _.find(parents, function(obj) {
					return (obj.className === "sapMPanel");
				});
				var ui5Panel = sap.ui.getCore().byId(jqueryPanel.id);
				var hBar = ui5Panel.getHeaderToolbar();
				var icon = _.find(hBar.getContent(), _.bind(function(value) {
					var props = value.mProperties;
					return props.hasOwnProperty("icon");
				}, this));
				icon.setVisible(true);
			});

			sap.m.MessageToast.show(this._getLocaleText("clientCreationFailed"));
			return;
		}

		if (!!inputTaxCode && !!inputVatNumber) {
			// if(inputTaxCode.getValue().trim().length === 0 ||
			// inputVatNumber.getValue().trim().length === 0){
			if (inputTaxCode.getValue().trim().length === 0 && inputVatNumber.getValue().trim().length === 0) {
				sap.m.MessageBox.alert(this._getLocaleText("taxCodeOrVatNumberMissing"), {
					title : this._getLocaleText("Alert")
				});
				return;
			}
			// else if(inputTaxCode.getValue().trim().length > 0 &&
			// inputVatNumber.getValue().trim().length === 0){
			// sap.m.MessageBox.alert(this._getLocaleText("vatNumberMissing"), {
			// title: this._getLocaleText("Alert")
			// });
			// }else if(inputTaxCode.getValue().trim().length === 0 &&
			// inputVatNumber.getValue().trim().length > 0){
			// sap.m.MessageBox.alert(this._getLocaleText("taxCodeMissing"), {
			// title: this._getLocaleText("Alert")
			// });
			// }

			// }
			//            
		}

		// adding directly costumer to collections costumers -> to substitute
		// with create Entity and refresh collections
		model.CustomerModel.createNewCustomer(this.customer);
		sap.m.MessageToast.show(this._getLocaleText("clientCreationSuccessful"));
		this.router.navTo("launchpad");
	},
	onResetPress : function() {
		this.customer = model.CustomerModel.createNewCustomer();
		this.getView().getModel("c").refresh();
	},

	onNavBackPress : function() {
		this.router.navTo("launchpad");
	},

	populateSelect : function() {
		// HP1 : Maybe it's possible creating a mapping file on which every
		// collection has its params to select
		// HP2 : Every collections contains an array of params where a select is
		// needed
		var pToSelArr = [{
			"type" : "registryTypes",
			"namespace" : "rt"
		}, {
			"type" : "contactTypes",
			"namespace" : "ct"
		}, {
			"type" : "paymentConditions",
			"namespace" : "pc"
		}, {
			"type" : "places",
			"namespace" : "p"
		}, {
			"type" : "cities",
			"namespace" : "cities"
		}, {
			"type" : "regions",
			"namespace" : "regions"
		}, {
			"type" : "DiscountGroupTypes",
			"namespace" : "dct"
		},
		{
			"type" : "priceListTypes",
			"namespace" : "pl"
		}, {
			"type" : "IncotermsTypes",
			"namespace" : "IncotermsTypes"
		}, {
			"type" : "InvoiceFrequency",
			"namespace" : "InvoiceFrequency"
		}, {
			"type" : "registryTypes",
			"namespace" : "registryTypes"
		}, {
			"type" : "MeansShippingTypes",
			"namespace" : "MeansShippingTypes"
		}, {
			"type" : "ChargeTransportTypes",
			"namespace" : "ChargeTransportTypes"
		}
		];

		_.map(pToSelArr, _.bind(function(item) { 
			// It could be abstracted internally with a method that get the respective
			// odata from the type received
			utils.Collections.getModel(item.type)
			.then(_.bind(function(result) {
				this.getView().setModel(result, item.namespace);

			}, this));
		}, this));
	},

	// *****************CheckInputFields************************///////
	_checkingValues : [],

	setElementsToValidate : function() {
		var inputsId = _.chain($('input')).map(function(item) {
			var innerIndex = item.id.indexOf("-inner");
			if (innerIndex)
				return item.id.substring(0, innerIndex);
			return item.id;
		}).value();

		var controls = _.map(inputsId, function(item) {
			return sap.ui.getCore().byId(item);
		});
		// console.log("controls" +controls);

		this._checkingValues = _.compact(controls);
		for (var i = 0; i < this._checkingValues.length; i++) {
			this._checkingValues[i].attachChange(null, this.checkInputField, this);
		}

	},
	clearValueState : function() {
		if (this._checkingValues) {
			for (var i = 0; i < this._checkingValues.length; i++) {
				this._checkingValues[i].setValueState("None");
			}
		}

	},

	validateCheck : function() {
		var result = true;
		if (!this._checkingValues || this._checkingValues.length === 0)
			return true;

		for (var i = 0; i < this._checkingValues.length; i++) {
			if (!this.checkInputField(this._checkingValues[i])) {
				if (this._checkingValues[i].data("req") === "true") {
					result = false;
				}
			}
		}
		return result;
	},

	checkInputField : function(evt) {

		var control = evt.getSource ? evt.getSource() : evt;
		var infoControl = control.data("req");
		var typeControl = control.data("input");
		var correct = true;
		if (infoControl === "true" || control.getValue() !== "") {
			switch (typeControl) {

				default :
					correct = utils.Validator.required(control);
					break;

			}
		}

		return correct;

	},
	getFailedControls : function() {
		var result = [];
		_.forEach(this._checkingValues, _.bind(function(item) {
			if (!this.checkInputField(item)) {
				result.push(item);
			}
		}, this));
		return result;
	}

// onStartSessionPress : function()
// {
// model.Persistence.session.save("customerSession", true);
// model.Persistence.session.save("currentCustomer", this.customer);
// this.router.navTo("launchpad");
// }

});
