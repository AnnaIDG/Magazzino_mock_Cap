jQuery.sap.declare("model.InterventionDatesModel");

model.InterventionDatesModel = {
	/**
	 * @memberOf model.InterventionDatesModel
	 * @returns {Object}
	 */
    _isMock : icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
    
	getInterventionDates : function(key) {
        if (true) {
            this._defer = Q.defer();
            $.getJSON("custom/model/mockData/InterventionDates.json").success(function(result) {
                    var res = _.find(result, {
                        key : key
                    });
                var now = new Date();
                var future = new Date();
                future.setDate(future.getDate() + 15);
                var defaultRes ={
                    key: "0",
                    startInterventionDate: now,
                    endInterventionDate: future
                };
                if(!!res && !!res.startInterventionDate && !!res.endInterventionDate){
                    res.startInterventionDate= new Date(res.startInterventionDate);
                    res.endInterventionDate= new Date(res.endInterventionDate);
                }else{
                    res = defaultRes;
                }
                this._defer.resolve(res);
            }.bind(this)).fail(function(err) {
                this._defer.reject(err);
            }.bind(this));
            return this._defer.promise;
        } else {
            //TODO
        }
	},

};