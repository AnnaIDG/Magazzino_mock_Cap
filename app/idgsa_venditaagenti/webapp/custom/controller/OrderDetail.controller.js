jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.OrderModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("model.service.LocalStorageService");

controller.AbstractController.extend("controller.OrderDetail", {
    /**
     * @memberOf controller.OrderDetail
     */
    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
        this.orderDetailModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.orderDetailModel, "orderDetailModel");
        this.enableModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.enableModel, "enableModel");
    },

    handleRouteMatched: function (evt) {
        if (!this._checkRoute(evt, "orderDetail"))
            return;

        this.userLogged = model.service.LocalStorageService.session.get("userLogged");
        this.uiModel.setProperty("/backButtonVisible", true);
        this.uiModel.setProperty("/visibleOnNotePress", false);

        this.enableModel.setProperty("/noteInput", false);

        if (this.userLogged) {
            controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
            var orderId = evt.getParameter("arguments").orderId;
            /* seleziono il primo tab */
            var iconTabBar = this.getView().byId("idOrderDetailIconTabBar");
            var selectedIconTabKey = iconTabBar.getSelectedKey();
            var firstTab = iconTabBar.getItems()[0];
            if (selectedIconTabKey !== firstTab.getKey()) {
                iconTabBar.setSelectedItem(firstTab);
            }
            /**************************/

            model.OrderModel.getOrderDetail(orderId).then(
                function (result) {
                    if (result) {
                        this.orderDetailModel.setProperty("/order", result);
                        /* pulisco gli input delle note */
                        this.orderDetailModel.setProperty("/noteDescription", "");
                        this.orderDetailModel.setProperty("/textNote", "");
                        /*************************************************************************/
                        this.orderDetailModel.setProperty("/notesList", result.notes.results);
                        this.orderDetailModel.setProperty("/bills", result.bills.results);
                        this.orderDetailModel.setProperty("/documents", result.documents.results);
                        /* aggiungo il campo della data per ogni posizione */
                        for (var j = 0; j < result.positions.results.length; j++) {
                            result.positions.results[j].availableDate = result.availableDate;
                        }
                        /***************************************************/
                        this.orderDetailModel.setProperty("/positions", result.positions.results);
                        this.unfilteredPositionList = result.positions.results;
                    } else if(model.service.LocalStorageService.session.get("orders")){
                    	var orders = model.service.LocalStorageService.session.get("orders");
                    	var order = _.find(orders, {
                            'orderId': parseInt(orderId)
                        });
                    	this.orderDetailModel.setProperty("/order", order);
                        this.orderDetailModel.setProperty("/noteDescription", "");
                        this.orderDetailModel.setProperty("/textNote", "");
                        this.orderDetailModel.setProperty("/notesList", order.notesList);
                        this.orderDetailModel.setProperty("/bills", []);
                        this.orderDetailModel.setProperty("/documents", []);
                        /* aggiungo il campo della data per ogni posizione */
                        for (var j = 0; j < order.productsList.length; j++) {
                        	order.productsList[j].availableDate = order.availableDate;
                        }
                        this.orderDetailModel.setProperty("/positions", order.productsList);
                        this.unfilteredPositionList = order.productsList;
                    } else {
                        this.orderDetailModel.setProperty("/order", {});
                        this.orderDetailModel.setProperty("/notesList", []);
                        this.orderDetailModel.setProperty("/positions", []);
                        this.orderDetailModel.setProperty("/bills", []);
                        this.orderDetailModel.setProperty("/documents", []);
                    }
                    var cartTotal = 0;
                    if (this.orderDetailModel.getProperty("/positions") && this.orderDetailModel.getProperty("/positions").length > 0) {
                        for (var ii = 0; ii < this.orderDetailModel.getProperty("/positions").length; ii++) {
                        	cartTotal = cartTotal + _.round((this.orderDetailModel.getProperty("/positions")[ii].quantity * 
                        			this.orderDetailModel.getProperty("/positions")[ii].unitListPrice), 2);
                        }
                    }
                    this.orderDetailModel.setProperty("/cartTotal", cartTotal);
                }.bind(this),
                function (error) {
                    this.getView().setBusy(false);
                    sap.m.MessageBox.error(error, {
                        title: this._getLocaleText("errorOrderDetailMessageBoxTitle")
                    });
                }.bind(this));
        } else {
            this.router.navTo("login");
        }
    },

    onNotePress: function (evt) {
        var idSelectedNote = evt.getSource().mProperties.description;
        this.uiModel.setProperty("/visibleOnNotePress", true);
        var noteSelected = _.find(this.orderDetailModel.getProperty("/notesList"), {
            'id': idSelectedNote
        });
        if (noteSelected) {
            this.orderDetailModel.setProperty("/noteDescription", noteSelected.description);
            this.orderDetailModel.setProperty("/textNote", noteSelected.text);
        }
    },
    
    onIconTabSelectionChange: function(evt){
        var src= evt.getSource();
        if(src.getSelectedKey() !== "notes"){
            this.uiModel.setProperty("/visibleOnNotePress", false);
        }
        
    },

    onFilterPositionList: function () {
        this.orderDetailModel.setProperty("/positions", this.unfilteredPositionList);
        var positionList = _.filter(this.orderDetailModel.getProperty("/positions"), function (o) {
            return ((o.positionId.toUpperCase().indexOf(this.uiModel.getProperty("/searchValue").toUpperCase()) > -1) || o.description.toUpperCase().indexOf(this.uiModel.getProperty("/searchValue").toUpperCase()) > -1);
        }.bind(this));
        this.orderDetailModel.setProperty("/positions", positionList);
        this.orderDetailModel.refresh();
    },

    onNavBackPress: function () {
        this.router.navTo("orderList");
    }
});
