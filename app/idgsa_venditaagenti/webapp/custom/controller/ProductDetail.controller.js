jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.ProductModel");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("utils.Collections");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("model.ProductAvailability");

controller.AbstractController.extend("controller.ProductDetail", {
    /**
     * @memberOf controller.ProductDetail
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.productDetailModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.productDetailModel, "productDetailModel");
        this.scaleSelectModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(this.scaleSelectModel, "scaleSelectModel");
    },

    handleRouteMatched: function (evt) {
      
        
  
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        this.uiModel.setProperty("/backButtonVisible", false);
        this.uiModel.setProperty("/productDetailVisible", false);
        this.uiModel.setProperty("/checkATPTriggered", false);
        this.productDetailModel.setProperty("/panelExpanded", false);
        
        if (!this._checkRoute(evt, "productDetail")) return;
        
        if(model.service.LocalStorageService.session.get("viewCatalogFromOrder")){
        	this.uiModel.setProperty("/isFromOrder", true);
        } else {
        	this.uiModel.setProperty("/isFromOrder", false);
        }
        
        this.currentOrder = model.service.LocalStorageService.session.get("currentOrder");
        
        this.reqModel = new sap.ui.model.json.JSONModel({
            "reqDate": new Date(),
        });
        this.getView().setModel(this.reqModel, "req");

        this.resModel = new sap.ui.model.json.JSONModel({
            "available": false,
            "warning": false
        });
        this.getView().setModel(this.resModel, "res");

        var productId = evt.getParameter("arguments").productId;
        if (productId) {
            var req = this._getOrgData();
            var salesOrg = req.Vkorg;
            this.getView().setBusy(true);
            model.ProductModel.getProductDetail(productId, salesOrg).then(function (result) {
                this.productDetailModel.setData(result);
                if(!!this.currentOrder && this.currentOrder.requestedDate){
                    this.currentOrder.requestedDate = new Date(this.currentOrder.requestedDate);
                    this.reqModel.setProperty("/reqDate", this.currentOrder.requestedDate);
                }else{
                    this.reqModel.setProperty("/reqDate", new Date());
                }
                
                this.productDetailModel.setProperty("/reqQty",1);
                this.uiModel.setProperty("/productDetailVisible", true);
                if(!!result.scale && result.scale.length > 0){
                    this.initializeScaleToDefault(result.scale);
                }
                if(!!result.unitListPrice && result.unitListPrice.length > 0){
                    this.price = result.unitListPrice;
                }
                this.onRequestAvailabilityPress();
                this.getView().setBusy(false);
                this.productDetailModel.setProperty("/panelExpanded", true);
            }.bind(this), function (error) {
                this.getView().setBusy(false);
                sap.m.MessageBox.error(error, {
                    title: this._getLocaleText("errorProductDetailMessageBoxTitle")
                });
            }.bind(this));
        }
        var requestAvailabilityPanel = this.getView().byId("requestProductAvailabilityPanel");
        if (!!requestAvailabilityPanel && requestAvailabilityPanel.getExpanded())
            requestAvailabilityPanel.setExpanded(false);
        
        this.populateSelect();
    },

    onAvailabilityButtonPress: function (evt) {
        var src = evt.getSource();
        var panel = src.getParent().getParent();
        if (panel.getExpanded())
            panel.setExpanded(false);
        else {
            panel.setExpanded(true);
        }

    },
    
    initializeScaleToDefault: function (defaultValue) {
          var comboBoxId ="scaleComboBox";
          if (this.getView().byId(comboBoxId)) {
            if (this.getView().byId(comboBoxId).getSelectedKey().trim() === "")
              this.getView().byId(comboBoxId).setSelectedKey(defaultValue);
          }
        
      },
    
    onScaleValueChange: function(evt){
        var scaleValue = evt.getSource().getSelectedKey();
        var price = parseInt(this.price);
        var newValue;
        if(!!price && !!scaleValue){
            switch(scaleValue){
                case "CART": 
                    newValue = price * 6;
                    this.getView().getModel("productDetailModel").setProperty("/unitListPrice", newValue.toString());
                    break;
                case "KG": 
                    newValue = price * 2;
                    this.getView().getModel("productDetailModel").setProperty("/unitListPrice", newValue.toString());
                    break;
                case "LT": 
                    newValue = price * 1.5;
                    this.getView().getModel("productDetailModel").setProperty("/unitListPrice", newValue.toString());
                    break;
                default:
                    return;
            }
        }
        
        
    },
    
    simulateATPCheckPressButton: function(){
        var reqQty = this.productDetailModel.getData().reqQty;
        var inputField = this.getView().byId("atpCheckInputQuantity");
         if(isNaN(parseInt(reqQty)))
        {
            inputField.setValueState("Error");
            inputField.setValueStateText(this._getLocaleText("numberInputNeeded"));
            return;
        }else{
            inputField.setValueState("None");
            inputField.setValueStateText("");
            this.uiModel.setProperty("/checkATPTriggered", true);
            this.onRequestAvailabilityPress();
        }
        
    },
    
    liveChangeATPCheck: function(evt){
        var src = evt.getSource();
        var reqQty = src.getValue();
        if(!!evt && isNaN(parseInt(reqQty)))
        {
            src.setValueState("Error");
            src.setValueStateText(this._getLocaleText("numberInputNeeded"));
            this.uiModel.setProperty("/checkATPTriggered", false);
        }else{
            src.setValueState("None");
            src.setValueStateText("");
            this.uiModel.setProperty("/checkATPTriggered", false);
        }
    },
    
    onRequestAvailabilityPress: function () {
//    var reqDate = this.getView().getModel("req").getData().reqDate;
    var reqQty = this.productDetailModel.getData().reqQty;
    var productId = this.productDetailModel.getData().productId;
    var availableButton = this.getView().byId("availabilityCheckButton");
    

    model.ProductAvailability.getAvailabilityByProductId(productId, reqQty) //forceReload
        .then(_.bind(function (res) {
            console.log(res);
            var temp = {};
            temp.available = res.available;
            temp.warning = res.warning;
            if(res.available === false && res.warning === false){
                availableButton.removeStyleClass("availableButton");
                availableButton.removeStyleClass("availabilityWarningButton");
                availableButton.addStyleClass("notAvailableButton");
            }
            if(res.available === true && res.warning === true){
                availableButton.removeStyleClass("notAvailableButton");
                availableButton.removeStyleClass("availableButton");
                availableButton.addStyleClass("availabilityWarningButton");
            }
            if(res.available === true && res.warning === false){
                availableButton.removeStyleClass("notAvailableButton");
                availableButton.removeStyleClass("availabilityWarningButton");
                availableButton.addStyleClass("availableButton");
            }
            this.getView().getModel("res").setData({
                "available": temp.available,
                "warning": temp.warning
            });
        }, this));

},

    onConfirmCheckPress: function (evt) {
        var productId = this.productDetailModel.getProperty("/productId");
        var description = this.productDetailModel.getProperty("/description");
        var scale = this.productDetailModel.getProperty("/scale");
        var unitListPrice = parseFloat(this.productDetailModel.getProperty("/unitListPrice"));
        var currency = this.productDetailModel.getProperty("/currency");
        var quantity = parseFloat(this.productDetailModel.getProperty("/reqQty"));
        var free = this.productDetailModel.getProperty("/free");
        if(!!(this.getView().getModel("res").getData().available)){
            var available = this.getView().getModel("res").getData().available;
        }
        var totalListPrice = _.round((unitListPrice * quantity), 2);
        if(!!(this.getView().getModel("res").getData().reqDate)){
            var requestedDate = this.getView().getModel("res").getData().reqDate;
        }
        
        if(requestedDate && typeof requestedDate === 'object'){
	        var year = requestedDate.getFullYear();
	        var month = requestedDate.getMonth() + 1;
	        if (month < 10)
	            month = "0" + month;
	        var day = requestedDate.getDate();
	        if (day < 10)
	            day = "0" + day;
	        requestedDate = day + "/" + month + "/" + year;
        }
        var currentOrder = model.service.LocalStorageService.session.get("currentOrder");
        if (currentOrder) {
            var productsList = currentOrder.productsList;
            if (!productsList) {
                productsList = [];
            }
            var productToAdd = {
                'productId': productId,
                'description': description,
                'scale': scale,
                'unitListPrice': unitListPrice,
                'currency': currency,
                'quantity': quantity,
                'free': free,
                'available': available,
                'totalListPrice': totalListPrice,
                'requestedDate': requestedDate,
                "positionType":"pt01"
            };
            productsList.push(productToAdd);
            currentOrder.productsList = productsList;
            model.service.LocalStorageService.session.save("currentOrder", currentOrder);
            model.service.LocalStorageService.session.save("viewCatalogFromOrder", true);
            //this.productDetailModel.setProperty("/panelExpanded", false);
            //this.router.navTo("productCatalog");
            sap.m.MessageToast.show(this._getLocaleText("addProductToCartSuccessMsg"));
        }
    },
    
    populateSelect : function() {
		var pToSelArr = [{
			"type" : "ScaleTypes"
		}];

		_.map(pToSelArr, _.bind(function(item) {
			utils.Collections.getModel(item.type).then(_.bind(function(result) {
				var propertyName = item.type.substring(0, 1).toLowerCase() + item.type.substring(1);
				this.scaleSelectModel.setProperty("/" + propertyName, result.getData().items);
			}, this));
		}, this));
	},
});
