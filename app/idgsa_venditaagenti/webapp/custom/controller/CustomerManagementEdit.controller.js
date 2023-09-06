jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("utils.Collections");
jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.CustomerModel");
jQuery.sap.require("utils.Validator");
jQuery.sap.require("model.service.LocalStorageService");

controller.AbstractController.extend("controller.CustomerManagementEdit", {
	/**
	 * @memberOf controller.CustomerManagementEdit
	 */
	onExit: function () {

	},

	onInit: function () {

		controller.AbstractController.prototype.onInit.apply(this, arguments);
		this.customerDetailModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(this.customerDetailModel, "c");
		


	},

	handleRouteMatched: function (evt) {

		if (!this._checkRoute(evt, "customerManagementEdit"))
			return;

		controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);

		this.customerId = evt.getParameter("arguments").customerId;
		if (this.customerId) {
			/* seleziono il primo tab */
			var iconTabBar = this.getView().byId("idCustomerIconTabBar");
			var selectedIconTabKey = iconTabBar.getSelectedKey();
			var firstTab = iconTabBar.getItems()[0];
			if (selectedIconTabKey !== firstTab.getId()) {
				iconTabBar.setSelectedItem(firstTab);
			}
			/** *********************** */
			if (this.selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer").registry) {
				this.selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer").registry;
			} else {
				this.selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer");
			}
			this.openCustomerDetail(this.customerId);

		}

	},

	refreshView: function (data) // Could it be abstracted?
	{
		var enable = {
			"editable": false
		};
		var page = this.getView().byId("customerManagementEdit");

		var clone = _.cloneDeep(data);
		var clonedModel = new sap.ui.model.json.JSONModel(clone);
		this.getView().setModel(clonedModel, "c");
		enable.editable = true;
		// var toolbar = sap.ui.xmlfragment("view.fragment.editToolbar", this);
		// page.setFooter(toolbar);
		// Maybe to parameterize
		this.populateSelect();
		// -----------------------
		var enableModel = new sap.ui.model.json.JSONModel(enable);
		this.getView().setModel(enableModel, "en");

	},

	onSavePress: function () {
		var editedCustomer = this.getView().getModel("c").getData("");
		this.getView().setModel(this.getView().getModel("c"), "customerDetailModel");		


		this.router.navTo("customerManagementDetail", {
			customerId: this.selectedCustomer.customerId
		});

	},

	// onSavePress: function () {
	// 	// Prendo i dati di editedCustomer
	// 	var editedCustomer = this.getView().getModel("c").getData();

	// 	// Leggo il contenuto del file
	// 	funzione che carica il file

	// 	// Parsa il contenuto del file come oggetto JSON
	// 	var jsonContent = JSON.parse(fileContent);

	// 	// Trova l'oggetto che vuoi aggiornare
	// 	var index = jsonContent.findIndex(function (customer) {
	// 	  return customer.customerId === editedCustomer.customerId;
	// 	});

	// 	// Aggiorna l'oggetto trovato con i nuovi dati
	// 	jsonContent[index] = editedCustomer;

	// 	// Converti il contenuto modificato in formato JSON
	// 	var jsonData = JSON.stringify(jsonContent);

	// 	// Sovrascrivi il file JSON esistente con i nuovi dati
	// 	sap.ui.core.util.File.save(
	// 	  jsonData,
	// 	  "CustomerDetailMock.json",
	// 	  "json",
	// 	  "application/json",
	// 	  undefined,
	// 	  false
	// 	);

	// 	// Naviga alla vista "customerManagementDetail"
	// 	this.router.navTo("customerManagementDetail", {
	// 	  customerId: this.selectedCustomer.customerId
	// 	});
	//   },

	// onSavePress: function () {
	// 	var editedCustomer = this.getView().getModel("c").getProperty("/");
	// 	var customerDetailModel = this.getView().getModel("customerDetail");
	// 	var customerId = editedCustomer.customerId;

	// 	// Aggiorna il modello "customerDetail" con i nuovi dati
	// 	customerDetailModel.setProperty("/" + customerId, editedCustomer);

	// 	// Salva il modello "customerDetail" nel file CustomerDetailMock.json
	// 	var jsonData = JSON.stringify(customerDetailModel.getData());
	// 	sap.ui.core.util.File.save(
	// 		jsonData,
	// 		"./model/mockData/CustomerDetailMock.json",
	// 		"json",
	// 		"application/json",
	// 		undefined,
	// 		false
	// 	);

	// 	// Naviga alla vista "customerManagementDetail"
	// 	this.router.navTo("customerManagementDetail", {
	// 		customerId: this.selectedCustomer.customerId
	// 	});
	// },
	
	

	onBackPress: function () {
		var editedCustomer = this.getView().getModel("c").getData();
		this.router.navTo("customerManagementDetail", {
			customerId: this.selectedCustomer.customerId
		});
	},

	onResetPress: function () {
		this.openCustomerDetail(this.customerId);
		// this.getView().getModel("c").setData(this.initialCustomerData);
		// this.getView().rerender();
	},

	populateSelect: function () {
		var pToSelArr = [{
			"type": "registryTypes",
			"namespace": "rt"
		}, {
			"type": "contactTypes",
			"namespace": "ct"
		}, {
			"type": "incotermsTypes",
			"namespace": "ic"
		}, {
			"type": "places",
			"namespace": "p"
		},
		{
			"type": "priceListTypes",
			"namespace": "pl"
		}];

		_.map(pToSelArr, _.bind(function (item) {
			utils.Collections.getModel(item.type).then(_.bind(function (result) {
				this.getView().setModel(result, item.namespace);

			}, this));
		}, this));

	},

	openCustomerDetail: function (id) {

		var requestData = {
			customerId: this.selectedCustomer.customerId,
			salesOrg: this.selectedCustomer.salesOrg,
			distributionChannel: this.selectedCustomer.distributionChannel,
			division: this.selectedCustomer.division,
			society: this.selectedCustomer.society,
			agentCode: this.selectedCustomer.agentCode
		};
		this.getView().setBusy(true);
		model.CustomerModel.getCustomerDetail(requestData).then(function (result) {
			this.getView().setBusy(false);
			if (result) {
				this.customer = result;
				this.initialCustomerData = _.cloneDeep(result);
				this.refreshView(result);
				// this.customerDetailModel.setData(result);
			} else {
				this.customerDetailModel.setData({});
			}
		}.bind(this), function (error) {
			this.getView().setBusy(false);
			sap.m.MessageBox.error(error, {
				title: this._getLocaleText("errorCustomerDetailMessageBoxTitle")
			});
		}.bind(this));
	},

});
