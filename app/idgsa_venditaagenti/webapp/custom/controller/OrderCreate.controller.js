jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("utils.Collections");
jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.CustomerModel");
jQuery.sap.require("model.OrderModel");
jQuery.sap.require("model.CurrentModel");
jQuery.sap.require("model.RifOrderModel");
jQuery.sap.require("model.DestinationModel");

controller.AbstractController.extend("controller.OrderCreate", {
	/**
	 * @memberOf controller.OrderCreate
	 */
	
	
	
	
	onInit : function() {
		controller.AbstractController.prototype.onInit.apply(this, arguments);
		this.orderCreateModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(this.orderCreateModel, "orderCreateModel");
		this.orderCreateModelSelect = new sap.ui.model.json.JSONModel();
		this.getView().setModel(this.orderCreateModelSelect, "orderCreateModelSelect");
		this.newDestinationModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(this.newDestinationModel, "newDestinationModel");
		
		this.discountModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(this.discountModel, "d");

	},

	handleRouteMatched : function(evt) {
		if (!this._checkRoute(evt, "orderCreate"))
			return;

		controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
		this.uiModel.setProperty("/backButtonVisible", true);
		this.uiModel.setProperty("/isFromOrderList", false);
		this.goToOtherPage = false;
		// se presente, recupero l'ordine dalla sessione
		this.order = model.service.LocalStorageService.session.get("currentOrder");
		if(this.order && this.order.requestedDate && typeof(this.order.requestedDate) == "string")
        {
            this.order.requestedDate = new Date(this.order.requestedDate);
        }
		
		var orderFromOrderlist = model.service.LocalStorageService.session.get("orderFromOrderList");
		this.fromOrderListCustomer = orderFromOrderlist;
		var selectedOrganization = model.service.LocalStorageService.session.get("selectedOrganization");
		var userLogged = model.service.LocalStorageService.session.get("userLogged")[0];
		if (!!orderFromOrderlist && !!selectedOrganization && !!userLogged) {
			this.uiModel.setProperty("/isFromOrderList", true);
			var orderId = orderFromOrderlist.orderId;
			var customerId = orderFromOrderlist.customerId;
			var customerName = orderFromOrderlist.customerName;
			var customer = {
				'customerId' : customerId,
				'customerName' : customerName
			};
			this.orderCreateModel.setProperty("/customer", customer);

			var requestData = {
				customerId : customerId,
				salesOrg : selectedOrganization.salesOrgId,
				distributionChannel : selectedOrganization.distributionChannelId,
				division : selectedOrganization.divisionId,
				society : selectedOrganization.societyId,
				agentCode : userLogged.agentCode
			};
			this.getView().setBusy(true);
			model.CustomerModel.getCustomerDetail(requestData).then(function(result) {
				this.getView().setBusy(false);
				if (result) {
					model.service.LocalStorageService.session.save("currentCustomer", result);
					this.continueWithOrder(result, orderId);
				}
			}.bind(this), function(error) {
				this.getView().setBusy(false);
				sap.m.MessageBox.error(error, {
					title : this._getLocaleText("errorCustomerDetailMessageBoxTitle")
				});
			}.bind(this));

		} else {

			var customerData = model.service.LocalStorageService.session.get("currentCustomer");
			if (!!customerData) {
				var customer = {
					'customerId' : customerData.registry.customerId,
					'customerName' : customerData.registry.customerName
				};
			}

			this.orderCreateModel.setProperty("/customer", customer);
			var docNr = this.getView().byId("clientDocNr");
			if (!!docNr) {
				docNr.setValue("");
			}

			if (this.order) {
				this.orderCreateModel.setData(this.order);
				this.findDestinations(customerData.registry.salesOrg, customerData.registry.distributionChannel,
						customerData.registry.division);
				var customer = {
					'customerId' : this.order.customerId ? this.order.customerId : customerData.registry.customerId,
					'customerName' : this.order.customerName
							? this.order.customerName
							: customerData.registry.customerName
				};
				this.orderCreateModel.setProperty("/customer", customer);
				if (this.order.notes) {
					this.orderCreateModel.setProperty("/notes", this.order.notes);
				} else {
					this.orderCreateModel.setProperty("/notes", []);
				}
			} else {
				this.onResetPress();
				var inputData = this.createInputDataForDefaults(customerData);

				model.OrderModel.getCustomerDefaults(inputData).then(
						_.bind(function(result) {
							this.order.update(result);
							this.orderCreateModel.setData(this.order);
							var customer = {
								'customerId' : customerData.registry.customerId,
								'customerName' : customerData.registry.customerName
							};
							this.orderCreateModel.setProperty("/customer", customer);
							this.findDestinations(customer.customerId, inputData.salesOrg,
									inputData.distributionChannel, inputData.division);
							this.initializeEmptyOrder();

						}, this));
				this.orderCreateModel.setProperty("/notesList", []);

			}

			model.RifOrderModel.getRifOrder().then(_.bind(function(result) {
				var rifOrder = result.rifOrder;
				this.orderCreateModel.setProperty("/rifOrder", rifOrder);
			}, this));

			this.populateSelect();
			
			

		}

		// seleziono il primo tab
		var iconTabBar = this.getView().byId("idIconTabBarOrderCreate");
		var selectedIconTabKey = iconTabBar.getSelectedKey();
		var firstTab = iconTabBar.getItems()[0];
		if (selectedIconTabKey !== firstTab.getId()) {
			iconTabBar.setSelectedItem(firstTab);
		}

	},

	continueWithOrder : function(customerData, orderId) {
		/** ******************************* */

		/** ******************************* */

		this.onResetPress();
		var inputData = this.createInputDataForDefaults(customerData);

		model.OrderModel.getCustomerDefaults(inputData).then(
				_.bind(function(result) {
					this.order.update(result);
					this.orderCreateModel.setData(this.order);

					var customer = {
						'customerId' : this.fromOrderListCustomer.customerId,
						'customerName' : this.fromOrderListCustomer.customerName
					};
					this.orderCreateModel.setProperty("/customer", customer);
					this.findDestinations(customerData.customerId, inputData.salesOrg, inputData.distributionChannel,
							inputData.division);
					this.initializeEmptyOrder();

				}, this));
		this.orderCreateModel.setProperty("/notesList", []);
		model.RifOrderModel.getRifOrder().then(_.bind(function(result) {
			var rifOrder = result.rifOrder;
			this.orderCreateModel.setProperty("/rifOrder", rifOrder);
		}, this));

		this.populateSelect();
	},

	initializeEmptyOrder : function() {
		var defaultOrder = {
			basketType : "Ordine d'acquisto",
			paymentMethod : "Bonifico",
			incoterms : "Incoterms di tipo 2",
			meansShipping : "Mezzo Mittente",
			appointmentToDelivery : "Consegna Standard",
			deliveryType : "Normale",
			chargeTrasport : "Area trasporti 01",
			incoterms : "Franco vettore"
		};
		this.order.update(defaultOrder);
	},

	initializeComboBoxToFirstValue : function(propertyName) {
		if (!!this.order) {
			var comboBoxId = propertyName + "ComboBox";
			if (this.getView().byId(comboBoxId)) {
				if (this.getView().byId(comboBoxId).getSelectedKey().trim() === "")
					this.getView().byId(comboBoxId).setSelectedItem(this.getView().byId(comboBoxId).getItems()[0]);
			}
		}
	},

	createInputDataForDefaults : function(customerData) {
		var inputData = {
			codiceFiscale : customerData.registry.codiceFiscale,
			partitaIVA : customerData.registry.partitaIVA,
			society : customerData.registry.society,
			salesOrg : customerData.registry.salesOrg,
			distributionChannel : customerData.registry.distributionChannel,
			division : customerData.registry.division,
			agentCode : customerData.registry.agentCode,
			customerId : customerData.registry.customerId
		};
		return inputData;
	},

	findDestinations : function(customerId, salesOrg, distributionChannel, division) {
		var fSuccess = function(result) {
			var centroDiCarico = {
				id : "cc",
				destinationsName : "Centro di Carico"
			};

			var loggedUser = model.service.LocalStorageService.session.get("userLogged");

			if (!!loggedUser && Array.isArray(loggedUser)) {
				if (loggedUser.length > 0 && loggedUser[0].roleId === "BO") {
					if (!!result && result.length > 0) {
						result.push(centroDiCarico);
					}
				}
			}
			this.orderCreateModel.setProperty("/destinationsType", result);
			this.initializeComboBoxToFirstValue("destination");
			this.getView().setBusy(false);
		};
		var fError = function(error) {
			this.getView().setBusy(false);
			sap.m.MessageBox.error(error, {
				title : this._getLocaleText("errorDestinationsMessageBoxTitle")
			});
		};
		fSuccess = _.bind(fSuccess, this);
		fError = _.bind(fError, this);

		this.getView().setBusy(true);
		model.DestinationModel.getDestinations(customerId, salesOrg, distributionChannel, division).then(fSuccess,
				fError);
	},

	onDestinationTypeChange : function(evt) {
		var type = evt.getSource().getSelectedKey();
		var page = this.getView().byId("orderCreate");
		if (type === "cc") {
			if (!this.addDestinationDialog)
				this.addDestinationDialog = sap.ui.xmlfragment("view.fragment.dialog.AddNewDestination", this);
			page.addDependent(this.addDestinationDialog);
			this.newDestinationModel.setData(this.createNewDestination());
			this.addDestinationDialog.open();
		} else {
			this.initializeComboBoxToFirstValue("destination");
		}
	},

	createNewDestination : function() {
		var destination = {
			name : "",
			street : "",
			streetNumber : "",
			zipCode : "",
			city : "",
			prov : "",
			nation : "",
			tel : ""
		};
		return destination;
	},

	onNewDestinationReset : function() {
		this.newDestinationModel.setData(this.createNewDestination());

	},

	onInsertNewAddressCancel : function() {
		this.newDestinationModel.setData(this.createNewDestination());
		this.reorderSelectDestination();
		this.addDestinationDialog.close();

	},

	onInsertNewAddressSave : function() {
		// temp solo per la demo
		var streetInput = sap.ui.getCore().byId("streetInput");
		var streetNrInput = sap.ui.getCore().byId("streetNrInput");
		var cityInput = sap.ui.getCore().byId("cityInput");
		if (!!streetInput && !!streetNrInput && cityInput) {
			var streetValue = streetInput.getValue();
			var streetNrValue = streetNrInput.getValue();
			var cityValue = cityInput.getValue();
		}
		if (this.orderCreateModel.getProperty("/destinationsType")) {
			var destinations = this.orderCreateModel.getProperty("/destinationsType");
			if (Array.isArray(destinations) && destinations.length > 0) {
				if (!!streetValue && !!streetNrValue && !!cityValue) {
					if (streetValue.trim().length === 0 || streetNrValue.trim().length === 0
							|| cityValue.trim().length === 0) {
						this.reorderSelectDestination();
					} else {
						var newDestination = {
							id : destinations.length.toString(),
							destinationsName : "Via " + streetValue + " " + streetNrValue + ", " + cityValue
						};
						destinations.push(newDestination);
						this.orderCreateModel.setProperty("/destinationsType", destinations);
						this.reorderSelectDestination();
					}

				} else {
					this.reorderSelectDestination();
				}
			}
		}

		// temp solo per la demo
		this.addDestinationDialog.close();
	},

	reorderSelectDestination : function() {
		var destinationComboBox = this.getView().byId("destinationComboBox");
		if (this.orderCreateModel.getProperty("/destinationsType")) {
			var destinations = this.orderCreateModel.getProperty("/destinationsType");
			if (Array.isArray(destinations) && destinations.length > 0) {
				Array.prototype.move = function(old_index, new_index) {
					if (new_index >= this.length) {
						var k = new_index - this.length;
						while ((k--) + 1) {
							this.push(undefined);
						}
					}
					this.splice(new_index, 0, this.splice(old_index, 1)[0]);
					return this;
				};

				var oldIndex = destinations.findIndex(x >= x.id == "cc");
				destinations.move(oldIndex, (destinations.length) - 1);
				console.log(destinations);
				this.orderCreateModel.setProperty("/destinationsType", destinations);
				this.orderCreateModel.refresh(true);
				if (!!destinationComboBox)
					destinationComboBox.setSelectedItem(destinationComboBox.getItems()[0]);

			}
		}
	},

	onAddNotePress : function() {
		var noteSelect = this.getView().byId("idNoteSelect");
		var id = noteSelect.getSelectedKey();
		var note = _.find(this.orderCreateModelSelect.getProperty("/noteTypes"), {
			'id' : id
		});
		if (note) {
			var description = note.description;
		} else {
			var description = undefined;
		}
		var noteValue = this.orderCreateModel.getProperty("/textNote");
		if (id && description && noteValue) {
			var note = {
				'id' : id,
				'description' : description,
				'noteValue' : noteValue
			};
			var noteArray = this.orderCreateModel.getProperty("/notes");
			noteArray.push(note);
			this.orderCreateModel.setProperty("/notes", noteArray);
			noteSelect.setSelectedKey();
			this.orderCreateModel.setProperty("/textNote", "");
		}
	},

	onNotePress : function(evt) {
		var id = evt.getSource().getTitle();
		var note = _.find(this.orderCreateModel.getProperty("/notesList"), {
			'description' : id
		});
		this.orderCreateModel.setProperty("/textNote", note.noteValue);
		var noteSelect = this.getView().byId("idNoteSelect");
		noteSelect.setSelectedKey(note.id);
	},

	onSavePress : function() {
		var docNr = this.getView().byId("clientDocNr");
		if (!!docNr) {
			if (docNr.getValue().trim().length === 0) {
				sap.m.MessageBox.alert(this._getLocaleText("clientDocNumberMissing"), {
					title : this._getLocaleText("Alert")
				});
				return;
			}
		}
		sap.m.MessageBox.confirm(this._getLocaleText("saveConfirm"), {
			title : this._getLocaleText("saveConfirmTitle"),
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : _.bind(this.confirmSave, this)
		});
	},

	confirmSave : function(evt) {
		if (!evt || evt !== "NO") {
			// **
			model.service.LocalStorageService.local.remove("oldCustomerOrder");
			// **
			this.currentOrder = {};
			if (this.order) {
				var notes = this.orderCreateModel.getProperty("/notesList");
				if (!notes) {
					notes = [];
				}
				this.currentOrder.notesList = notes;
				for ( var i in this.order) {
					var property = i;
					if (property === "customerName" || property === "customerId") {
						if (this.orderCreateModel.getProperty("/customer")) {
							this.currentOrder[i] = this.orderCreateModel.getProperty("/customer")[property];
						} else {
							this.currentOrder[i] = this.orderCreateModel.getData()[property];
						}

					} else if (property !== "create" && property !== "getModel" && property !== "notesList") {
						this.currentOrder[i] = this.orderCreateModel.getProperty("/" + property);
					}
				}
			}
			if (this.goToOtherPage === false) {
				var orders = model.service.LocalStorageService.session.get("orders");
				if (!orders) {
					orders = [];
					var nextId = 1244;
				} else {
					// prendo l'ultimo ordine creato e aggiungo 1 all'id che ha
					// quell'ordine
					var ordersLength = orders.length;
					var lastOrder = orders[ordersLength - 1];
					var lastOrderId = parseInt(lastOrder.orderId);
					var nextId = lastOrderId + 1;
				}
				this.currentOrder.orderId = "0000" + nextId.toString();
				orders.push(this.currentOrder);
				model.service.LocalStorageService.session.save("orders", orders);
				model.service.LocalStorageService.session.remove("currentOrder");
				this.router.navTo("orderList");
			} else {
				model.CurrentModel.setOrder(this.currentOrder);
			}
		}
	},

	onResetPress : function() {
		var docNr = this.getView().byId("clientDocNr");
		if (!!docNr) {
			docNr.setValue("");
		}
		this.order = new model.OrderModel.createNewOrder();
		this.getView().getModel("orderCreateModel").refresh();
	},

	populateSelect : function() {
		var pToSelArr = [{
			"type" : "DocTypes"
		}, {
			"type" : "TransporterTypes"
		}, {
			"type" : "NoteTypes"
		}, {
			"type" : "IncotermsTypes"
		}, {
			"type" : "paymentConditions"
		},
		{
			"type": "priceGroupTypes"
		},
		{
			"type":"priceListTypes"
		}
		];

		_.map(pToSelArr, _.bind(function(item) {
			utils.Collections.getModel(item.type).then(_.bind(function(result) {
				var blankItem = {
					id : "",
					name : ""
				};
				var propertyName = item.type.substring(0, 1).toLowerCase() + item.type.substring(1);
				this.orderCreateModelSelect.setProperty("/" + propertyName, result.getData().items);
				switch (propertyName) {
					case "docTypes" :
						this.initializeComboBoxToFirstValue("docType");
						break;
					case "transporterTypes" :
						this.initializeComboBoxToFirstValue("transporter");
						break;
					case "incotermsTypes" :
						this.initializeComboBoxToFirstValue("incoterms");
						break;
					case "paymentConditions" :
						this.initializeComboBoxToFirstValue("paymentConditions");
						break;
				}
			}, this));
		}, this));
	},

	onAddProductsPress : function(evt) {
		var docNr = this.getView().byId("clientDocNr");
		if (!!docNr) {
			if (docNr.getValue().trim().length === 0) {
				sap.m.MessageBox.alert(this._getLocaleText("clientDocNumberMissing"), {
					title : this._getLocaleText("Alert")
				});
				return;
			}
		}
		this.goToOtherPage = true;
		this.confirmSave();
		model.service.LocalStorageService.session.save("viewCatalogFromOrder", true);
		this.router.navTo("productCatalog");
	},

	onNavBackPress : function() {
		this.router.navTo("launchpad");
	},

	returnToOrderList : function() {
		if (model.service.LocalStorageService.session.get("currentCustomer")) {
			model.service.LocalStorageService.session.remove("currentCustomer");
		}
		if (model.service.LocalStorageService.session.get("orderFromOrderList")) {
			model.service.LocalStorageService.session.remove("orderFromOrderList");
		}

		this.router.navTo("orderList");
	},

	onGoToCart : function() {
		var docNr = this.getView().byId("clientDocNr");
		if (!!docNr) {
			if (docNr.getValue().trim().length === 0) {
				sap.m.MessageBox.alert(this._getLocaleText("clientDocNumberMissing"), {
					title : this._getLocaleText("Alert")
				});
				return;
			}
		}

		this.goToOtherPage = true;
		this.confirmSave();
		this.loadBusyIndicatorBeforeCart();
		model.service.LocalStorageService.session.save("viewCatalogFromOrder", true);
		setTimeout(function() {
			this.router.navTo("cart", {
				from : "OC"
			});
		}.bind(this), 3000);

	},
	onPriceGroupChange : function(evt)
	{
		var src = evt.getSource();
		this._refreshHeaderDiscountValues();
		this._openHeaderDiscountDialog();
		
		
	},
	
	onHeaderDiscountPress:function(evt)
	{
		this._openHeaderDiscountDialog();
	}, 
	onDiscountDialogOK:function(evt)
	{
		this.headerDiscountDialog.close();
	},
	_refreshHeaderDiscountValues : function()
	{
		var priceGroup = this.orderCreateModel.getProperty("/priceGroup");
		var priceGroups = this.orderCreateModelSelect.getProperty("/priceGroupTypes");
		var priceGroupItem = _.find(priceGroups, {key:priceGroup});
		var headerDiscounts = [];
		if(priceGroupItem)
		{
			headerDiscounts = priceGroupItem.discounts;
			this.discountModel.setProperty("/discounts", headerDiscounts);
			
		}
		this.orderCreateModel.setProperty("/headerDiscounts", headerDiscounts);
	},
	
	_openHeaderDiscountDialog:function(evt)
	{
		if(!this.headerDiscountDialog)
			this.headerDiscountDialog = sap.ui.xmlfragment("view.fragment.dialog.PriceGroupDiscountDialog", this);
		
		var page = this.getView().byId("orderCreate");
		page.addDependent(this.headerDiscountDialog);
		this.headerDiscountDialog.open();
		
	},
});