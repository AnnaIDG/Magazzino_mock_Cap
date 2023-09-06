jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.NoticeModel");
jQuery.sap.require("model.NoticeStateModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("controller.AbstractNoticeList");

controller.AbstractNoticeList.extend("controller.NoticeMasterList", {
	/**
	 * @memberOf controller.NoticeMasterList
	 */
	handleRouteMatched : function(evt) {
		if (!this._checkRoute(evt, "noticeMobileList")
			/*&& (sap.ui.Device.system.desktop || (!this._checkRoute(evt, "noticeDetail") && !this._checkRoute(evt, "noticeMasterDetail")))*/)
			return;

		controller.AbstractNoticeList.prototype.handleRouteMatched.apply(this, arguments);
		
		var list = this.getView().byId("noticeMasterListId");
		if(list && list.getBinding("items")){
			list.getBinding("items").filter();
		}
	},

	onNoticePress : function(evt) {
		var path = parseInt(evt.getSource().getBindingContextPath().split("/")[2]);
		var element = this.getView().getModel("noticeListModel").getData().results[path];
		this.router.navTo("noticeMasterDetail", {
			noticeId : element.noticeId
		});
	},

	onFilterPress : function(evt) {
		this._openFilterDialog();
	},

	_openFilterDialog : function() {
		if (!this.filterDialog)
			this.filterDialog = sap.ui.xmlfragment("view.fragment.noticeList.NoticeListFilterDialog", this);

		var page = this.getView().byId("noticeMasterListPageId");
		page.addDependent(this.filterDialog);

		this.filterDialog.open();
	},

	onSearchNotice : function() {
		controller.AbstractNoticeList.prototype.onSearchNotice.apply(this);
		if (this.filterDialog && this.filterDialog.isOpen())
			this.filterDialog.close();
	},

	onCancelFilterDialogPress : function() {
		this.filterDialog.close();
	},

	onResetFilterDialogPress : function() {
		// this._cleanFilter();
		this._initializeFilter();
		this.onSearchNotice();

	},

	_cleanFilter : function() {
		this.uiModel.setProperty("/searchNoticeById", "");
		this.uiModel.setProperty("/searchNoticeByDateFrom", null);
		this.uiModel.setProperty("/searchNoticeByDateTo", null);
		this.uiModel.setProperty("/searchNoticeByState", "");
	},

	onResetListPress : function(evt) {
		var list = this.getView().byId("noticeMasterListId");
		list.getBinding("items").filter();
		this.onResetFilterDialogPress();
	},

	onFieldSearch : function(evt) {
		var src = evt.getSource();
		var value = src.getValue();
		var list = this.getView().byId("noticeMasterListId");
		var properties = ["noticeId", "noticeState", "techPlaceId", "techPlaceDescr", "requestUser", "description"];

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
});