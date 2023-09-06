jQuery.sap.declare("model.DestinationModel");
jQuery.sap.require("utils.DestinationSerializer");

model.DestinationModel = {
    /**
     * @memberOf model.DestinationModel
     */
    getDestinations: function (customerId, salesOrg, distributionChannel, division) {
        this._destinationDefer = Q.defer();
        $.getJSON("custom/model/mockData/DestinationsMock.json").success(function (result) {
            var destinations = utils.DestinationSerializer.Destinations.fromSapItems(result);
            var destination = _.where(destinations, {
                'customerId': customerId,
                'salesOrg': salesOrg,
                'distributionChannel': distributionChannel,
                'division': division,
            });
            /**Temp Code to assign a default destination if json have no match of the current destination**/
            //START OF TEMP CODE
            if(!destination || destination.length === 0){
            	var defaultDestination = {
            			salesOrg: salesOrg,
                        distributionChannel: distributionChannel,
                        division : division,
                        destinationsName : "Via San Crispino 82, PD"
                };
            	this._destinationDefer.resolve([defaultDestination]);
            }else{
            	this._destinationDefer.resolve(destination);
            }
            //END OF TEMP CODE
//            this._destinationDefer.resolve(destination);
        }.bind(this)).fail(function (err) {
            this._destinationDefer.reject(err);
        }.bind(this));
        return this._destinationDefer.promise;
    }
};
