jQuery.sap.declare("utils.Collections");
jQuery.sap.require("utils.ComboBoxSerializer");

utils.Collections = {

	_isMock : icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
	//temp//
	_isMock:true,
	//-----//
	
	loadComboBoxData : function(set) {
		if (this._isMock) {
			var defer = Q.defer();
			var serializeNoticeTypes = _.bind(
					utils.ComboBoxSerializer.noticeType.fromSAP, this);
			var serializeTechPlaces = _.bind(
					utils.ComboBoxSerializer.techPlace.fromSAP, this);
			var serializeEquipments = _.bind(
					utils.ComboBoxSerializer.equipment.fromSAP, this);
			var serializePriorities = _.bind(
					utils.ComboBoxSerializer.priority.serializeSAPList2ModelList, this);
			var serializeEncodings = _.bind(
					utils.ComboBoxSerializer.encoding.fromSAP, this);
			var serializeRequesters = _.bind(
					utils.ComboBoxSerializer.requester.fromSAP, this);
			var serializeFailureTypes = _.bind(
					utils.ComboBoxSerializer.failureType.fromSAP, this);
            var serializeIssueTypes = _.bind(
					utils.ComboBoxSerializer.issueType.fromSAP, this);
            var serializeTaskTypes = _.bind(
					utils.ComboBoxSerializer.taskType.fromSAP, this);
            
			var capitalizeFirstLetter = function(string) {
				return string.charAt(0).toUpperCase() + string.slice(1);
			};
			var filename = capitalizeFirstLetter(set);
			$.getJSON("custom/model/mockData/" + filename + ".json")
					.success(
							function(result) {
								var i = 0;
								var obj = {
									results : []
								};

								switch (set) {
								case "noticeTypes":
									if (result.results
											&& result.results.length > 0) {
										for (i = 0; i < result.results.length; i++) {
											var data = serializeNoticeTypes(result.results[i]);
											obj.results.push(data);
										}
									}
									break;

								case "techPlaces":
									if (result.results
											&& result.results.length > 0) {
										for (i = 0; i < result.results.length; i++) {
											var data = serializeTechPlaces(result.results[i]);
											obj.results.push(data);
										}
									}
									break;

								case "equipments":
									if (result.results
											&& result.results.length > 0) {
										for (i = 0; i < result.results.length; i++) {
											var data = serializeEquipments(result.results[i]);
											obj.results.push(data);
										}
									}
									break;

								case "priorities":
									if (result.results
											&& result.results.length > 0) {
										for (i = 0; i < result.results.length; i++) {
											var data = serializePriorities(result.results[i]);
											obj.results.push(data);
										}
									}
									break;

								case "encodings":
									if (result.results
											&& result.results.length > 0) {
										for (i = 0; i < result.results.length; i++) {
											var data = serializeEncodings(result.results[i]);
											obj.results.push(data);
										}
									}
									break;

								case "requesters":
									if (result.results
											&& result.results.length > 0) {
										var genericUser = {
											id : "0",
											description : "User Fiori"
										};
										for (i = 0; i < result.results.length; i++) {
											var data = serializeRequesters(result.results[i]);
											obj.results.push(data);
										}
										obj.results.unshift(genericUser);
									}
									break;

								case "failureTypes":
									if (result.results
											&& result.results.length > 0) {
										for (i = 0; i < result.results.length; i++) {
											var data = serializeFailureTypes(result.results[i]);
											obj.results.push(data);
										}
									}
									break;
                                case "issueTypes":
									if (result.results
											&& result.results.length > 0) {
										for (i = 0; i < result.results.length; i++) {
											var data = serializeIssueTypes(result.results[i]);
											obj.results.push(data);
										}
									}
									break;
                                case "taskTypes":
									if (result.results
											&& result.results.length > 0) {
										for (i = 0; i < result.results.length; i++) {
											var data = serializeTaskTypes(result.results[i]);
											obj.results.push(data);
										}
									}
									break;

								}
								console.log("Data for " + set + " loaded");
								var model = new sap.ui.model.json.JSONModel(obj);
								defer.resolve(model);
							}.bind(this)).fail(function(err) {
						console.log("Error Loading Items for " + set);
						defer.reject(err);
					}.bind(this));

			return defer.promise;

		} else {
			var defer = Q.defer();
			// TODO odata call for loading all select and valueHelpDialogs data
		}
	}

};