jQuery.sap.require("controller.AbstractController");
jQuery.sap.require("model.NoticeModel");
jQuery.sap.require("model.NoticeStateModel");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("model.ComboBoxModel");
jQuery.sap.declare("controller.AbstractNoticeList");

controller.AbstractController.extend("controller.AbstractNoticeList", {
	/**
	 * @memberOf controller.AbstractNoticeList
	 */
	onInit: function () {
		controller.AbstractController.prototype.onInit.apply(this, arguments);
		//
		this.noticeListModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(this.noticeListModel, "noticeListModel");
		this.noticeListModel.setSizeLimit(1000);
		//
		this.getView().removeStyleClass("logoBackground");
	},

	handleRouteMatched: function (evt) {
		//
		// if (!this._checkRoute(evt, "noticeList") && !this._checkRoute(evt,
		// "noticeMobileList"))
		// return;
		//
		controller.AbstractController.prototype.handleRouteMatched.apply(this, arguments);
		this.uiModel.setProperty("/backButtonVisible", true);
		//-----To think about Filter to use----------------------------------
		//		this.statesByRole = model.NoticeStateModel._getNoticeStatesByRole(this._getUserLoggedRole());
		//		this.initialParams = {
		//			techPlace : this._getUserLogged().techPlace,
		//			states : this.statesByRole
		//		};
		var fromDate = new Date().setFullYear(new Date().getFullYear() - 1); // an year before today as default

		//commentato noticeType per mock
		this.initialParams =
		{
			noticeDateFrom: new Date(fromDate),
			noticeDateTo: new Date()//,
			//noticeType: "Z1"
		};
		//----------------------------------------------------------------------------
		// Initialize SearchField
		this.noticeListModel.setProperty("/searchValue", "");
		this._initializeFilter();
		this._getNoticeList(this.initialParams);
		//
		this.uiModel.setProperty("/noticeCreateVisible", false);
		//TODO visualizzo il bottone di creazione segnalazione solo se sono utente SAVE
		if (this._getUserLoggedRole() === '1' || this._getUserLoggedRole() === '2') {
			this.uiModel.setProperty("/noticeCreateVisible", true);
		}


		var eventBus = sap.ui.getCore().getEventBus();
		eventBus.subscribe("variabileAcaso", "variabileAcaso2", this._funzioneAppoggio, this);

	},
	_initializeFilter: function () {
		this.uiModel.setProperty("/searchNoticeById", "");
		this.uiModel.setProperty("/searchNoticeByDateFrom", this.initialParams.noticeDateFrom);
		this.uiModel.setProperty("/searchNoticeByDateTo", this.initialParams.noticeDateTo);
		this.uiModel.setProperty("/searchNoticeByState", "");
		this.uiModel.setProperty("/searchNoticeByPriority", "");
		model.ComboBoxModel.getPriorityList().then(function (result) {
			var noPriorityItem = { id: "nopriority", description: this._getLocaleText("noPriorityLabel") };
			result.push(noPriorityItem);
			this.uiModel.setProperty("/prioritySelectList", result);
			this.uiModel.refresh();
		}.bind(this), function (error) {
			sap.m.MessageBox.error(this.SAPMessageUtil.getErrorMessage(error), {
				title: this._getLocaleText("errorLoadingPriorityListMessageBoxTitle")
			});
		}.bind(this));
		this.uiModel.setProperty("/stateSelectList", model.NoticeStateModel._getNoticeStates());
		this.uiModel.refresh();
	},

	onSearchNotice: function () {
		//commentato noticeType per mock
		var params = {
			noticeId: this.uiModel.getProperty("/searchNoticeById"),
			noticeDateFrom: this.uiModel.getProperty("/searchNoticeByDateFrom"),
			noticeDateTo: this.uiModel.getProperty("/searchNoticeByDateTo"),
			noticeState: this.uiModel.getProperty("/searchNoticeByState"),
			priority: this.uiModel.getProperty("/searchNoticeByPriority"),
			techPlace: this._getUserLogged().techPlace,
			states: this.statesByRole//,
			//noticeType: "Z1"
		};
		this._getNoticeList(params);
	},

	_funzioneAppoggio: function (arg1, arg2, params) {
		this._getNoticeList(params);
	},

	_getNoticeList: function (params) {
		this.getView().setBusy(true);
		// ** mock time
		//		var newNoticeArray = model.service.LocalStorageService.session.get("newNoticeArray");
		// **

		model.NoticeModel.getNoticeList(params).then(function (result) {
			// ** mock time
			//			if (newNoticeArray) {
			//				for (var i = 0; i < newNoticeArray.length; i++) {
			//					if (!newNoticeArray[i].techPlaceDescr && newNoticeArray[i].equipmentDescr) {
			//						newNoticeArray[i].techPlaceDescr = newNoticeArray[i].equipmentDescr;
			//					}
			//				}
			//
			//				if (params.states && params.states.length !== 0) {
			//					var arr = [];
			//					for (var i = 0; i < params.states.length; i++) {
			//						arr = arr.concat(_.filter(newNoticeArray, function(o) {
			//							return o.noticeState === params.states[i].key;
			//						}));
			//					}
			//					newNoticeArray = arr;
			//				}
			//
			//				result = result.concat(newNoticeArray);
			//			}
			// **
			// **
			result = _.sortByOrder(result, function (o) {
				return parseInt(o.noticeId);
			}, ['desc']);
			// **
			this.noticeListModel.setProperty("/results", []);
			this.noticeListModel.setProperty("/results", result);
			this.noticeListModel.refresh();
			this.getView().setBusy(false);
		}.bind(this), function (error) {
			this.getView().setBusy(false);
			sap.m.MessageBox.error(this.SAPMessageUtil.getErrorMessage(error), {
				title: this._getLocaleText("errorLoadingNoticeListMessageBoxTitle")
			});
		}.bind(this));
	},

	onNoticePress: function (evt) {
		var path = parseInt(evt.getSource().getBindingContextPath().split("/")[2]);
		var element = this.getView().getModel("noticeListModel").getData().results[path];
		this.router.navTo("noticeDetail", {
			noticeId: element.noticeId
		});
	},

	onNavBackPress: function () {
		this.router.navTo("launchpad");
	},

	onCreateNoticePress: function () {
		this.router.navTo("noticeCreate");
	},
	onResetFields: function () {
		this._initializeFilter();
		this._getNoticeList(this.initialParams);
	}
});
