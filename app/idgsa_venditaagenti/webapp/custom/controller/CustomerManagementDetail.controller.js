jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.CustomerModel");

controller.AbstractController.extend("controller.CustomerManagementDetail", {
    /**
     * @memberOf controller.CustomerManagementDetail
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.customerDetailModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.customerDetailModel, "customerDetailModel");
    },

    handleRouteMatched: function (evt) {
		if (!this._checkRoute(evt, "customerManagementDetail") && !this._checkRoute(evt, "customerManagementDetailFromLaunchpad"))
			return;
		
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);

        this.uiModel.setProperty("/customerDetailVisible", false);
        this.uiModel.setProperty("/backButtonVisible", false);
        
//        if (!this._checkRoute(evt, "customerManagementDetail"))
//            return;

        this.customerId = evt.getParameter("arguments").customerId;
        if (this.customerId) {
            this.uiModel.setProperty("/customerDetailVisible", true);
            /* seleziono il primo tab */
            var iconTabBar = this.getView().byId("idCustomerIconTabBar");
            var selectedIconTabKey = iconTabBar.getSelectedKey();
            var firstTab = iconTabBar.getItems()[0];
            if (selectedIconTabKey !== firstTab.getId()) {
                iconTabBar.setSelectedItem(firstTab);
            }
            /**************************/

            if (model.service.LocalStorageService.session.get("currentCustomer").registry) {
                this.selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer").registry;
                this.uiModel.setProperty("/backButtonVisible", true);
            } else {
                this.selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer");
            }
//            this.selectedCustomer = model.service.LocalStorageService.session.get("currentCustomer");
            
            var requestData = {
                customerId: this.selectedCustomer.customerId, 
                salesOrg: this.selectedCustomer.salesOrg, 
                distributionChannel: this.selectedCustomer.distributionChannel, 
                division: this.selectedCustomer.division, 
                society: this.selectedCustomer.society, 
                agentCode: this.selectedCustomer.agentCode
            };
            this.getView().setBusy(true);
            model.CustomerModel.getCustomerDetail(requestData).then(
                function (result) {
                	this.getView().setBusy(false);
                    if (result) {
                        this.customerDetailModel.setProperty("/customer", result);
                    } else {
                        this.customerDetailModel.setProperty("/customer", {});
                    }
                }.bind(this),
                function (error) {
                    this.getView().setBusy(false);
                    sap.m.MessageBox.error(error, {
                        title: this._getLocaleText("errorCustomerDetailMessageBoxTitle")
                    });
                }.bind(this));
        }
    },
    
    onEditPress : function()
	{
        this.router.navTo("customerManagementEdit", {
            customerId: this.selectedCustomer.customerId
        });
	},

	onCreatePress:function(evt)
	{
		this.router.navTo("customerCreate");
	},

    /* Aggiunta funzione per tornare alla launchpad */
    onNavBackPress: function () {
        this.router.navTo("launchpad");
    },

    onStartSessionPress: function () {
        var isBlocked=this.customerDetailModel.getProperty("/customer/registry/isBlocked");
        if(isBlocked){
             sap.m.MessageBox.alert(this._getLocaleText("customerIsBlocked"), {
                        title: this._getLocaleText("Alert")                              
                    });
                    return;
        }
        model.service.LocalStorageService.session.save("currentCustomer", this.customerDetailModel.getProperty("/customer"));
        model.service.LocalStorageService.session.save("isSession", true);
        this.router.navTo("launchpad");
    }
});
