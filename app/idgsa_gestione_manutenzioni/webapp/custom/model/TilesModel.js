jQuery.sap.declare("model.TilesModel");

model.TilesModel = {
	/**
	 * @memberOf model.TilesModel
	 */
	getTiles : function(role, noPriorityNoticeCount) {
		this.model = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "custom/i18n/i18n.properties"

		});
		var tiles = [ 
            {
			"icon" : "documents",
			"title" : this.model.getProperty("noticeListTileTitle"),
			"url" : "noticeList",
			"role" : [ "1", "2", "3", "4", "5"],
			"visible" : sap.ui.Device.system.desktop,
			"noPriorityNotices": noPriorityNoticeCount ? noPriorityNoticeCount + " " + this.model.getProperty("noPriorityNoticesCount") : ""
		},
		{
			"icon" : "order-status",
			"title" : this.model.getProperty("noticeListTileTitle"),
			"url" : "noticeMobileList",
			"role" : [ "1", "2", "3", "4", "5"],
			"visible" : sap.ui.Device.system.tablet || sap.ui.Device.system.phone,
			"noPriorityNotices": noPriorityNoticeCount ? noPriorityNoticeCount + " " + this.model.getProperty("noPriorityNoticesCount") : ""
		},
	
		{
			"icon" : "alert",
			"title" : this.model.getProperty("noticeCreateTileTitle"),
			"url" : "noticeCreate",
			"role" : [ "1", "2"],
			"visible" : true
		},
		{
			"icon" : "bar-code",
			"title" : this.model.getProperty("rfidLoaderTileTitle"),
			"url" : "rfidLoader",
			"role" : [ "1", "4", "5" ],//Temp
			"visible" : true
		}
		];
		var tileFilteredByRole = [];
		if(role && role !==""){
			tileFilteredByRole = _.filter(tiles, function(tile) {
				return _.any(tile.role, function(r) {
					return _.contains(r, role);
				});
			});
		}
		return tileFilteredByRole;
	}

};