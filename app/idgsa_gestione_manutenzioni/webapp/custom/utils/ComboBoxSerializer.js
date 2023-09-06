jQuery.sap.declare("utils.ComboBoxSerializer");

utils.ComboBoxSerializer = {

	noticeType : {
		fromSAP : function(sapData) {
			var o = {};

			o.id = sapData.id ? sapData.id : "";
			o.description = sapData.description ? sapData.description : "";

			return o;
		},

		toSAP : function(obj) {
			var toSAPData = {};

			return toSAPData;
		}
	},

	techPlace : {
		fromSAP : function(sapData) {
			var o = {};

			o.id = sapData.id ? sapData.id : "";
			o.description = sapData.description ? sapData.description : "";
            o.ultimo = sapData.ultimo ? sapData.ultimo : "";

			return o;
		},

		toSAP : function(obj) {
			var toSAPData = {};

			return toSAPData;
		}
	},

	equipment : {
		fromSAP : function(sapData) {
			var o = {};

			o.id = sapData.id ? sapData.id : "";
			o.description = sapData.description ? sapData.description : "";

			return o;
		},

		toSAP : function(obj) {
			var toSAPData = {};

			return toSAPData;
		}
	},

	priority : {
		serializeSAPList2ModelList : function(list) {
			var priorities = [];
			for (var i = 0; i < list.length; i++){
				var priority = {};
				priority.id = list[i].Priok;
				priority.description = list[i].Priokx;
				priorities.push(priority);
			}
			return priorities;
		}
	},

	encoding : {
		fromSAP : function(sapData) {
			var o = {};

			o.id = sapData.id ? sapData.id : "";
			o.description = sapData.description ? sapData.description : "";

			return o;
		},

		toSAP : function(obj) {
			var toSAPData = {};

			return toSAPData;
		}
	},

	requester : {
		fromSAP : function(sapData) {
			var o = {};

			o.id = sapData.id ? sapData.id : "";
			o.description = sapData.description ? sapData.description : "";

			return o;
		},

		toSAP : function(obj) {
			var toSAPData = {};

			return toSAPData;
		}
	},

	failureType : {
		fromSAP : function(sapData) {
			var o = {};

			o.id = sapData.id ? sapData.id : "";
			o.description = sapData.description ? sapData.description : "";

			return o;
		},

		toSAP : function(obj) {
			var toSAPData = {};

			return toSAPData;
		}
	},

	issueType : {
		fromSAP : function(sapData) {
			var o = {};

			o.id = sapData.id ? sapData.id : "";
			o.description = sapData.description ? sapData.description : "";
            o.issueTypeTextDescription = sapData.issueTypeTextDescription ? sapData.issueTypeTextDescription : "";
           

			return o;
		},

		toSAP : function(obj) {
			var toSAPData = {};

			return toSAPData;
		}
	},

	taskType : {
		fromSAP : function(sapData) {
			var o = {};

			o.id = sapData.id ? sapData.id : "";
			o.description = sapData.description ? sapData.description : "";
			o.issueId = sapData.issueId ? sapData.issueId : "";
			o.objectId = sapData.objectId ? sapData.objectId : "";

			return o;
		},

		toSAP : function(obj) {
			var toSAPData = {};

			return toSAPData;
		}
	}
};