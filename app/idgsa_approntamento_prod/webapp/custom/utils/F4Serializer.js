jQuery.sap.declare("utils.F4Serializer");

utils.F4Serializer = {

	noteType : {
		fromSAP : function(sapData) {
			var o = {};

			o.id = sapData.Tdid ? sapData.Tdid : "";
			o.description = sapData.Tdtext ? sapData.Tdtext : "";
			o.Tdobject = sapData.Tdobject ? sapData.Tdobject : "";
			o.defaultValue = sapData.Zdefault ? sapData.Zdefault : "";

			return o;
		}
	},
    /*For now the scaleType is in mock data*/
    scaleType : {
		fromSAP : function(sapData) {
			var o = {};

			o.productId = sapData.Matnr ? sapData.Matnr : "";
			o.baseUM = sapData.Meins ? sapData.Meins : "";
			o.alternativeUM = sapData.Meinh ? sapData.Meinh : "";
			o.baseQuantity = sapData.Umrez ? sapData.Umrez : "";
			o.alternativeQuantity = sapData.Umren ? sapData.Umren : "";
			o.baseUMLang = sapData.Mseh3 ? sapData.Mseh3 : "";
			o.baseDescriptionLang = sapData.Msehl ? sapData.Msehl : "";
            
			return o;
		}
	}

};