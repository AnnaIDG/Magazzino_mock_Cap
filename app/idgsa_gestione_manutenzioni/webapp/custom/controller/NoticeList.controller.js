jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.NoticeModel");
jQuery.sap.require("model.NoticeStateModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("controller.AbstractNoticeList");

controller.AbstractNoticeList.extend("controller.NoticeList", {
	/**
	 * @memberOf controller.NoticeList
	 */
	handleRouteMatched : function(evt) {
		if (!this._checkRoute(evt, "noticeList"))
			return;
		
		controller.AbstractNoticeList.prototype.handleRouteMatched.apply(this, arguments);
        this.onResetListPress();
	},
	
	onTitlePress : function(evt) {
		var property = "description";
		this._showFullTextPopover(evt, "noticeListModel", property);
	},
	
	onTechPlacePress : function(evt) {
		var property = "techPlaceDescr";
		this._showFullTextPopover(evt, "noticeListModel", property);
	},
	
	onPriorityPress : function(evt) {
		var property = "priorityDescr";
		this._showFullTextPopover(evt, "noticeListModel", property);
	},
    
    onSearchNoticeIdOnList : function(evt)
    {
    	var src = evt.getSource();
        
        if(evt.getParameter("clearButtonPressed"))
        {
            this.onResetListPress();
            return;
        }
		var value = src.getValue();
		var list = this.getView().byId("noticeListModelTable");
		var properties = ["noticeId"];

		if (value) {
			var filterData = {};
			for (var i = 0; i < properties.length; i++) {
				filterData[properties[i]] = value;
			}
			var filters = [];
			for ( var prop in filterData) {
				var filter = new sap.ui.model.Filter(prop, sap.ui.model.FilterOperator.Contains, value);
				filters.push(filter);
			}
			list.getBinding("items").filter([new sap.ui.model.Filter({
				filters : filters,
				and : false
			})]);
	   }
        
    },
    	onResetListPress : function(evt) {
		var list = this.getView().byId("noticeListModelTable");
		list.getBinding("items").filter();
		//this.onResetFilterDialogPress();
	},
});