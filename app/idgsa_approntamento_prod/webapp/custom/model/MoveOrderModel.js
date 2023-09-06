jQuery.sap.declare("model.MoveOrderModel");
jQuery.sap.require("utils.MoveOrderSerializer");
jQuery.sap.require("utils.Iban");
model.MoveOrderModel = {
    /**
     * @memberOf model.MoveOrderModel
     */
    _isMock: icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
    
     boxList: {
        "results": [
            {
                "id": "0",
                "name": "STANDARD"
    },
            {
                "id": "1",
                "name": "PERSONALIZZATA"
    }

  ]
    },

 getBoxList: function () {
        return this.boxList;
    },
    
    getMoveOrders: function (data) {
        if (this._isMock) {
            this._defer = Q.defer();
            $.getJSON("custom/model/mockData/MoveOrders.json").success(function (result) {
                //var moveOrders = utils.MoveOrderSerializer.MoveOrders.fromSapItems(result);
                var filteredMoveOrders = [];
                // chiamata che richiede le stesse proprietà dell'odata in input
                filteredMoveOrders = _.where(result, {
                   'agentCode': data.agentCode
                });
                this._defer.resolve(filteredMoveOrders);
            }.bind(this)).fail(function (err) {
                this._defer.reject(err);
            }.bind(this));
            return this._defer.promise;
        } else {
            this._defer = Q.defer();
            var success = function (result) {
                console.log(result);
                var MoveOrders = utils.MoveOrderSerializer.Packings.fromSapItems(result);
                this._defer.resolve(moveOrders);
            }.bind(this);
            //
            var error = function (err) {
                this._defer.reject(err.statusText);
            }.bind(this);
            var data = utils.MoveOrderSerializer.Packings.toSap(data);
            model.service.ODataService.getPackingsList(data, success, error);
            return this._defer.promise;
        }
    },
    getMoveOrderDetail: function (id) {
        if (this._isMock) {
            this._moveOrderDefer = Q.defer();
            $.getJSON("custom/model/mockData/MoveOrderDetailMock.json").success(function (result) {
               // var moveOrders = utils.MoveOrderSerializer.MoveOrderDetail.fromSapItems(result);
                var moveOrder = _.find(result.results, { "moveOrderId" : id });
                this._moveOrderDefer.resolve(moveOrder);
            }.bind(this)).fail(function (err) {
                this._moveOrderDefer.reject(err);
            }.bind(this));
            return this._moveOrderDefer.promise;
        } else {
            //TODO
        }
    },
    
   

    getPlants: function () {
        if (this._isMock) {
            var defer = Q.defer();
            $.getJSON("custom/model/mockData/Plants.json").success(function (result) {
                defer.resolve(result);
            }.bind(this)).fail(function (err) {
                defer.reject(err);
            }.bind(this));
            return defer.promise;
        } else {
            //TODO
        }
    }, 
    getSites: function () {
        if (this._isMock) {
            var defer = Q.defer();
            $.getJSON("custom/model/mockData/Sites.json").success(function (result) {
                defer.resolve(result);
            }.bind(this)).fail(function (err) {
                defer.reject(err);
            }.bind(this));
            return defer.promise;
        } else {
            //TODO
        }
    },
    
    
    

    getWorksCenter: function (p) {
        if (this._isMock) {
            var defer = Q.defer();
            $.getJSON("custom/model/mockData/WorksCenterMock.json").success(function (result) {

                var filteredResults = _.filter(result.items, {
                    "idPlant": p
                });

                defer.resolve(filteredResults);
            }.bind(this)).fail(function (err) {
                defer.reject(err);
            }.bind(this));
            return defer.promise;
        } else {
            //TODO
        }
    }


};
