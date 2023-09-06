jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("utils.Message");
jQuery.sap.require("sap.m.MessageBox");

jQuery.sap.declare("controller.AbstractCustomerManagement");

controller.AbstractController.extend("controller.AbstractCustomerManagement", {
    /**
     * @memberOf controller.CustomerManagementDetail
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);


        this.newDestinationModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.newDestinationModel, "newDestinationModel");

    },

    handleRouteMatched: function (evt) {

        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        this.uiModel.setProperty("/accountGroupVisible", true);
//        this.uiModel.setProperty("/customerDetailVisible", false);
//        this.uiModel.setProperty("/backButtonVisible", false);
//
////        if (!this._checkRoute(evt, "customerManagementDetail"))
////            return;
//
//        this.customerId = evt.getParameter("arguments").customerId;
//        if (this.customerId) {
//            this.uiModel.setProperty("/customerDetailVisible", true);
//            /* seleziono il primo tab */
//            var iconTabBar = this.getView().byId("idCustomerIconTabBar");
//            var selectedIconTabKey = iconTabBar.getSelectedKey();
//            var firstTab = iconTabBar.getItems()[0];
//            if (selectedIconTabKey !== firstTab.getId()) {
//                iconTabBar.setSelectedItem(firstTab);
//            }
//            /**************************/
//
//            if (model.service.LocalStorageService.session.get("currentCustomer").registry) {
//                this.selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer").registry;
//                this.uiModel.setProperty("/backButtonVisible", true);
//            } else {
//                this.selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer");
//            }
////            this.selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer");
//
//            var requestData = {
//                customerId: this.selectedCustomer.customerId,
//                salesOrg: this.selectedCustomer.salesOrg,
//                distrCh: this.selectedCustomer.distrCh,
//                division: this.selectedCustomer.division,
//                society: this.selectedCustomer.society,
//                agentCode: this.selectedCustomer.agentCode
//            };
//            /* Initialize New Destination Form */
//            //this.onNewDestinationReset();
//
//
//            /*************************************/
//
//            this.getView().setBusy(true);
//            model.CustomerModel.getCustomerDetail(requestData).then(
//                function (result) {
//                	this.getView().setBusy(false);
//                    if (result) {
//
//                        this.customerDetailModel.setProperty("/customer", result);
//                        this._loadDestination();
//                    } else {
//                        this.customerDetailModel.setProperty("/customer", {});
//                    }
//                }.bind(this),
//                function (error) {
//                    this.getView().setBusy(false);
//                    sap.m.MessageBox.error(error, {
//                        title: this._getLocaleText("errorCustomerDetailMessageBoxTitle")
//                    });
//                }.bind(this));
//        }
    },



    /* Aggiunta funzione per tornare alla launchpad */
    onNavBackPress: function () {
        this.router.navTo("launchpad");
    },




  /* -START - Add Other Destination */

  onNewDestinationReset: function (evt) {

  	this.newDestinationModel.setProperty("/name", "");
  	this.newDestinationModel.setProperty("/street", "");
  	this.newDestinationModel.setProperty("/streetNumber", "");
  	this.newDestinationModel.setProperty("/zipCode", "");
  	this.newDestinationModel.setProperty("/city", "");
  	this.newDestinationModel.setProperty("/prov", "");
  	this.newDestinationModel.setProperty("/nation", "");
  	this.newDestinationModel.setProperty("/tel", "");
  	this.newDestinationModel.setProperty("/accountsGroup", "");

      this.getView().getModel("newDestinationModel").refresh();
    },

    onInsertNewAddressCancel: function () {
      //this.onInsertNewAddressReset();
      this.insertNewAddressDialog.close();
    },

    _onAddDestination: function (page) {
      if (!this.insertNewAddressDialog) {
        this.insertNewAddressDialog = sap.ui.xmlfragment("view.fragment.dialog.AddNewDestination", this);
        var page = this.getView().byId(page);
        page.addDependent(this.insertNewAddressDialog);
      }
      this.onNewDestinationReset();
      this.insertNewAddressDialog.open();
    },

    onInsertNewAddressSave: function () {


      var destination = this.newDestinationModel.getData();
      this.getView().setBusy(true);
      var fSuccess = function () {
        //utils.Busy.hide();

    	this.getView().setBusy(false);
        if (this.insertNewAddressDialog) {
          this.insertNewAddressDialog.close();
        }
        this._loadDestination()
      }
      var fError = function (err) {
        //utils.Busy.hide();
        if (this.insertNewAddressDialog) {
          this.insertNewAddressDialog.close();
        }
        sap.m.MessageBox.alert(utils.Message.getError(err));
        this.getView().setBusy(false);
      };
      fSuccess = _.bind(fSuccess, this);
      fError = _.bind(fError, this);

      model.DestinationModel.addDestination(this.customerIntro, destination).then(fSuccess,fError);




    },

    onAddDestCountryChange : function(evt)
    {
  	  var country = evt.getSource().getSelectedKey();
		var regionItem = {
				"type":"Regio",
				"namespace" : "destRegions",
				"params":{
					"Land1": country

				}
			};

		utils.Collections.getOdataSelect(regionItem.type, regionItem.params).then(_.bind(function(result) {

			result.setSizeLimit(500);
			this.getView().setModel(result, regionItem.namespace);
			var data = result.getData();
			var destination = this.getView().getModel("newDestinationModel").getData();
			if(destination && destination.prov)
			{
				if(!_.find(data.results, {Regio : destination.prov}))
					destination.prov = "";

				this.getView().getModel("newDestinationModel").refresh();

			}
		}, this));

    },



  /*	-END- Add Other Destination */

    /* START Load Destination */
    _loadDestination : function(evt)
    {
  	  var _defer = Q.defer();
  	  var fSuccess = function(res)
  	  {
//  		  this.customerDetailModel.setProperty("/customer/destinations", res);
//  		  this.customerDetailModel.refresh();
  		  var viewName = this.getView().getViewName();
  		  var prop = "";
  		  switch(viewName){
  		  	case "view.CustomerManagementEdit":
  		  		prop = "/destinations";
  		  		break;
  		  	case "view.CustomerManagementDetail":
  		  		prop = "/customer/destinations";
  		  		break;

  		  	default:
  		  		prop = "/customer/destinations";
		  		break;

  		  }
  		  this.mainModel.setProperty(prop, res);
  		  this.mainModel.refresh();
  		 _defer.resolve(res);
  	  }
        fSuccess=_.bind(fSuccess, this);

        var fError = function(err)
        {
      	  sap.m.MessageToast.show("Error Loading Destinations");
      	  _defer.reject(err);
        }

        fError = _.bind(fError, this);
  	  model.DestinationModel.loadDestinations(this.customerIntro)
  	  .then(fSuccess, fError);

  	  return _defer.promise;
    }

    /*END Load Destination */

});