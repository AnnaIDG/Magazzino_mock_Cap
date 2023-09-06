jQuery.sap.declare("utils.DestinationSerializer");

utils.DestinationSerializer = {
    /**
     * @memberOf utils.DestinationSerializer
     */
    Destinations: {
        fromSapItems: function (sapItems) {
            var results = [];
            if (sapItems && sapItems.length > 0) {
                for (var i = 0; i < sapItems.length; i++) {
                    results.push(this.fromSap(sapItems[i]));
                }
            } else {
                if (sapItems && sapItems.results && sapItems.results.length > 0) {
                    for (var i = 0; i < sapItems.results.length; i++) {
                        results.push(this.fromSap(sapItems.results[i]));
                    }
                }
            }
            return results;
        },

        fromSap: function (sapData) {
            var destination = {};
            destination.salesOrg = sapData.Vkorg ? sapData.Vkorg : "";
            destination.distributionChannel = sapData.Vtweg ? sapData.Vtweg : "";
            destination.division = sapData.Spart ? sapData.Spart : "";
            destination.destinationName = sapData.Name1 ? sapData.Name1 : "";
            destination.street = sapData.Street ? sapData.Street : "";
            destination.streetCode = sapData.HouseNum1 ? sapData.HouseNum1 : "";
            destination.postCode = sapData.PostCode1 ? sapData.PostCode1 : "";
            destination.city = sapData.City1 ? sapData.City1 : "";
            destination.country = sapData.Country ? sapData.Country : "";
            destination.telNumber = sapData.TelNumber ? sapData.TelNumber : "";
            destination.customer = sapData.KunnrAg ? sapData.KunnrAg : "";
            destination.destinationCode = sapData.KunnrWe ? sapData.KunnrWe : "";
            return destination;
        }
    },

    
};
