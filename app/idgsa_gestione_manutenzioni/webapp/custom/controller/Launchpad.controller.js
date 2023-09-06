jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.TilesModel");
jQuery.sap.require("model.NoticeModel");

controller.AbstractController.extend("controller.Launchpad", {
	/**
	 * @memberOf controller.Launchpad
	 */
	onInit : function() {
		controller.AbstractController.prototype.onInit.apply(this, arguments);
		//
		this.tileModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(this.tileModel, "tiles");
		this.getView().addStyleClass("launchpadPageBackground");
	},

	handleRouteMatched : function(evt) {
		controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
		//
		if (!this._checkRoute(evt, "launchpad"))
			return;
		//
		this.uiModel.setProperty("/backButtonVisible", false);
		
		//
		if(this._getUserLogged().isRtt==="X"){
			this.getView().setBusy(true);
			var fromDate = new Date().setFullYear(new Date().getFullYear()-1); // an year before today as default
			var params =
			{
					noticeDateFrom: new Date(fromDate),
					noticeDateTo: new Date(),
					noticeType : "Z1",
					priority : "nopriority"
			};
			model.NoticeModel.getNoticeList(params).then(function(result) {
				this.getView().setBusy(false);
				this._initLaunchpad(result.length);
			}.bind(this), function(error) {
				this.getView().setBusy(false);
				this._initLaunchpad();
			}.bind(this));
		} else {
			this._initLaunchpad();
		}
		
	},
	
	_initLaunchpad : function(noPriorityNoticeCount){
		this.tileModel.setData(model.TilesModel.getTiles(this._getUserLoggedRole(), noPriorityNoticeCount));
		this.tileModel.refresh();
		this.getView().rerender();
		this._loadNetworkStatusSet();
		this._cleanSession();
	},

	onTilePress : function(evt) {
		var route = evt.getSource().data().tileUrl;
		this.router.navTo(route);
	},

	_cleanSession : function() {
		model.service.LocalStorageService.session.remove("techPlaceHierarchy");
		model.service.LocalStorageService.session.remove("equipmentHierarchy");
	},
    
    onPressUserDetail: function () {
        this.router.navTo("userDetail");
    }
});
