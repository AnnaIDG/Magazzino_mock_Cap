jQuery.sap.declare("utils.UserSerializer");

utils.UserSerializer = {

	user: {
		/**
		 * @memberOf utils.UserSerializer.user
		 */
		fromSapItems : function(sapItems) {
			var results = [];
			if (sapItems && sapItems.results && sapItems.results.length > 0) {
				for (var i = 0; i < sapItems.results.length; i++) {
					results.push(this.fromSap(sapItems.results[i]));
				}
			}
			return results;
		},

		fromSap : function(sapData) {
			var u = {
				"orgData" : {}
			};

			u.userId = sapData.Uname ? sapData.Uname : "";
			u.userFullName = sapData.NameText ? sapData.NameText : "";
			u.alias = sapData.Ualias ? sapData.Ualias : "";
			u.roleId = sapData.Ustyp ? sapData.Ustyp : "";
			u.agentCode = sapData.Cdage ? sapData.Cdage : "";
			u.customerId = sapData.Kunnr ? sapData.Kunnr : "";
			u.email = sapData.SmtpAddr ? sapData.SmtpAddr : "";
			u.customerGroup = sapData.Kdgrp ? sapData.Kdgrp : "";

			var orgData = {};

			orgData.societyId = sapData.Bukrs ? sapData.Bukrs : "";
			orgData.societyName = sapData.Butxt ? sapData.Butxt : "";
			orgData.salesOrgId = sapData.Vkorg ? sapData.Vkorg : "";
			orgData.salesOrgName = sapData.VtextVkorg ? sapData.VtextVkorg : "";
			orgData.distributionChannelId = sapData.Vtweg ? sapData.Vtweg : "";
			orgData.distributionChannel = sapData.VtextVtweg ? sapData.VtextVtweg : "";
			orgData.description = sapData.Ltext ? sapData.Ltext : "";
			orgData.divisionId = sapData.Spart ? sapData.Spart : "";
			orgData.divisionNameId = sapData.VtextSpart ? sapData.VtextSpart : "";
            orgData.salesOffice = sapData.Vkbur ? sapData.Vkbur : "";
            orgData.salesGroup = sapData.Vkgrp ? sapData.Vkgrp : "";

			u.orgData = orgData;
			
			u.password = sapData.password ? sapData.password : "";

			return u;
		}
	}
};