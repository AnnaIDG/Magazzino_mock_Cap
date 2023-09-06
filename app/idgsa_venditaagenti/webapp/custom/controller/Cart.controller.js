jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.DiscountModel");
jQuery.sap.require("model.ProductAvailability");
jQuery.sap.require("utils.Collections");

controller.AbstractController.extend("controller.Cart", {
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.cartModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.cartModel, "cartModel");
        
        this.selectModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.selectModel, "selectModel");
//        this.selectModel.setProperty("/positionTypes", [{key:"", name:""}]);
    },

    handleRouteMatched: function (evt) {
        controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
        var routeName = evt.getParameter("name");
        if (routeName !== "cart") {
            return;
        }
        
        
        this.currentOrder = model.service.LocalStorageService.session.get("currentOrder");
        if (typeof (this.currentOrder.requestedDate) === "string") {
            try {
                this.currentOrder.requestedDate = new Date(this.currentOrder.requestedDate);
            } catch (e) {
                console.log(e);
            }
        }
        if (!!this.currentOrder && this.currentOrder.productsList && this.currentOrder.productsList.length > 0) {
            for (var ii = 0; ii < this.currentOrder.productsList.length; ii++) {
                if (!!(this.currentOrder.productsList[ii].requestedDate) && typeof (this.currentOrder.productsList[ii].requestedDate) === "string") {
                    this.currentOrder.productsList[ii].requestedDate = new Date(this.currentOrder.productsList[ii].requestedDate);
                } else {
                    if (this.currentOrder.requestedDate) {
                        this.currentOrder.productsList[ii].requestedDate = this.currentOrder.requestedDate;
                    } else {
                        this.currentOrder.productsList[ii].requestedDate = new Date();
                    }
                }
            }
        }

//        this.cartModel.setData(this.currentOrder);
        var cartTotal = 0;
        if (!!this.currentOrder && this.currentOrder.productsList && this.currentOrder.productsList.length > 0) {
            for (var ii = 0; ii < this.currentOrder.productsList.length; ii++) {
            	cartTotal = cartTotal + _.round((this.currentOrder.productsList[ii].quantity * 
            								this.currentOrder.productsList[ii].unitListPrice), 2);
            }
        }
        this.cartModel.setProperty("/cartTotal", cartTotal);
        this.uiModel.setProperty("/backButtonVisible", false);
        if (evt.getParameter("arguments").from === "OC") {
            this.uiModel.setProperty("/backButtonVisible", true);
        }
        
        this.populateSelect()
        .then(_.bind(function(res){
        	this.cartModel.setData(this.currentOrder);
        	this.uiModel.refresh();
        }, this))
    },

    onChangeQuantity: function (evt) {
        var quantity = parseInt(evt.getParameters().value);
        var index = parseInt(evt.getParameters().id.split("cartTable-")[1]);
        var manualListPrice = parseFloat(this.cartModel.getProperty("/productsList")[index].manualListPrice);
        var totalListPrice = 0;
        if(manualListPrice && !isNaN(manualListPrice) && manualListPrice>0){
        	totalListPrice = _.round((quantity * manualListPrice), 2);
        } else {
            var unitListPrice = parseFloat(this.cartModel.getProperty("/productsList")[index].unitListPrice);
            totalListPrice = _.round((quantity * unitListPrice), 2);
        }
        var productId = this.cartModel.getProperty("/productsList")[index].productId;
        this.cartModel.getProperty("/productsList")[index].totalListPrice = totalListPrice;
        this.requestAvailabilityForProduct(index, productId, quantity);
        this.cartModel.refresh();
    },

    onChangeManualListPrice: function (evt) {
        var price = parseInt(evt.getParameters().value);
        var index = parseInt(evt.getParameters().id.split("cartTable-")[1]);
        var quantity = parseFloat(this.cartModel.getProperty("/productsList")[index].quantity);
        var totalListPrice = 0;
        if(price && !isNaN(price) && price>0){
	        totalListPrice = _.round((quantity * price), 2);
        } else {
        	var unitListPrice = parseFloat(this.cartModel.getProperty("/productsList")[index].unitListPrice);
        	totalListPrice = _.round((quantity * unitListPrice), 2);
        }
        this.cartModel.getProperty("/productsList")[index].totalListPrice = totalListPrice;
        this.cartModel.refresh();
    },

    onNavBackToCatalog: function () {
        model.service.LocalStorageService.session.save("viewCatalogFromOrder", true);
        this.router.navTo("productCatalog");
    },

    onSavePress: function () {
        sap.m.MessageBox.confirm(
            this._getLocaleText("saveConfirm"), {
                title: this._getLocaleText("saveConfirmTitle"),
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: _.bind(this.confirmSave, this)
            });
    },

    confirmSave: function (evt) {
        if (evt === "YES") {
            var orders = model.service.LocalStorageService.session.get("orders");
            if (!orders) {
                orders = [];
                var nextId = 1244;
            } else {
                // prendo l'ultimo ordine creato e aggiungo 1 all'id che ha quell'ordine
                var ordersLength = orders.length;
                var lastOrder = orders[ordersLength - 1];
                var lastOrderId = parseInt(lastOrder.orderId);
                var nextId = lastOrderId + 1;
            }
            this.currentOrder.orderId = "0000" + nextId.toString();

            var productsList = this.cartModel.getProperty("/productsList");
            this.currentOrder.productsList = productsList;
            orders.push(this.currentOrder);
            model.service.LocalStorageService.session.save("orders", orders);
            model.service.LocalStorageService.session.remove("currentOrder");
            this.router.navTo("orderList");
        }
    },

    onOrderHeaderPress: function (evt) {
        this.router.navTo("orderCreate");
    },

    onChangePositionRequestedDate: function (evt) {
        model.service.LocalStorageService.session.save("currentOrder", this.currentOrder);
    },

    onSetDiscountPress: function (evt) {
        var src = evt.getSource();
        var position = src.getBindingContext("cartModel").getObject();
        var discount = new model.DiscountModel();
        discount.initialize(position);
        this.currentPosition = position;
        position.discount = discount;
        var discountModel = discount.getModel();
        var page = this.getView().byId("cartPage");
        if (!this.discountDialog)
            this.discountDialog = sap.ui.xmlfragment("view.fragment.dialog.DiscountDialog", this);
        this.discountDialog.setModel(discountModel, "d");
        page.addDependent(this.discountDialog);

        this.discountDialog.open();
    },

    onDiscountDialogClose: function (evt) {
        this.discountDialog.close();

    },
    onDiscountDialogOK: function (evt) {

        console.log(this.order);
        this.discountDialog.close();

    },

    requestAvailabilityForProduct: function (index, productId, reqQuantity) {

        model.ProductAvailability.getAvailabilityByProductId(productId, reqQuantity)
            .then(_.bind(function (res) {
                console.log(res);
                this.cartModel.getProperty("/productsList")[index].available = res.available;
                this.cartModel.refresh();
            }, this));


    },

    onResetDiscountPress: function (evt) {
        var discount = new model.DiscountModel();
        discount.initialize(this.currentPosition);
        var discountModel = discount.getModel();
        this.discountDialog.setModel(discountModel, "d");
    },

    onCancelRowPress: function (evt) {
        var index = parseInt(evt.getParameters().listItem.sId.split("cartTable-")[1]);
        this.cartModel.getProperty("/productsList").splice(index, 1);
        this.cartModel.refresh();
        this.currentOrder.productsList = this.cartModel.getProperty("/productsList");
        model.service.LocalStorageService.session.save("currentOrder", this.currentOrder);
    },

    onHomePress: function () {
        this.router.navTo("launchpad");
    },

    onNavBackPress: function () {
        this.router.navTo("orderCreate");
    },
    
    populateSelect : function() {
    	
    	var allDefer = Q.defer();
		var pToSelArr = [
		{
			"type" : "positionTypes"
		}];

		_loadSelectModel = function(item)
		{
			var defer = Q.defer();
			utils.Collections.getModel(item.type).then(_.bind(function(result) {
				var blankItem = {
					id : "",
					name : ""
				};
				var propertyName = item.type.substring(0, 1).toLowerCase() + item.type.substring(1);
				this.selectModel.setProperty("/" + propertyName, result.getData().items);
				defer.resolve();}
			, this))
				
			return defer.promise;
			
		};
		
		
		var promises = [];
		for(var i = 0; i< pToSelArr.length ;i++)
		{
			var loadFunc = _.bind(_loadSelectModel, this, pToSelArr[i]);
			promises.push(loadFunc());
		}
		Q.all(promises)
		.spread(_.bind(function(res){
			allDefer.resolve();
		}, this))
		
		return allDefer.promise;
	},



});