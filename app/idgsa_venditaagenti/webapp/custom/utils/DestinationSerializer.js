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
            destination.customerId = sapData.Kunnr ? sapData.Kunnr : "";
            destination.salesOrg = sapData.Vkorg ? sapData.Vkorg : "";
            destination.distributionChannel = sapData.Vtweg ? sapData.Vtweg : "";
            destination.division = sapData.Spart ? sapData.Spart : "";
            destination.destinationsName = sapData.Name1 ? sapData.Name1 : "";
            return destination;
        }
    },

    toSAP: {

    }
};
