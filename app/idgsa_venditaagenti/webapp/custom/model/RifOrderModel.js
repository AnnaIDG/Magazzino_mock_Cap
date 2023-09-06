jQuery.sap.declare("model.RifOrderModel");

model.RifOrderModel = {
    /**
     * @memberOf model.RifOrderModel
     */
    getRifOrder: function () {
        this._noteDefer = Q.defer();
        $.getJSON("custom/model/mockData/RifOrderMock.json").success(function (result) {
            this._noteDefer.resolve(result);
        }.bind(this)).fail(function (err) {
            this._noteDefer.reject(err);
        }.bind(this));
        return this._noteDefer.promise;
    }
}