jQuery.sap.declare("model.PartnersModel");
jQuery.sap.require("utils.PartnersSerializer");


model.PartnersModel = {
    _isMock: icms.Component.getMetadata().getManifestEntry("sap.app").isMock,

    getList: function () {
        var defer = Q.defer();



        var fSuccess = function (res) {
            var result = utils.PartnersSerializer.fromSapItems(res);

            defer.resolve(result);
        }
        var fError = function (err) {
            defer.reject(err);
        }
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);

        if (this._isMock) {
            defer.resolve([]);
        } else {
            model.service.ODataService.getPartnersList(fSuccess, fError);
        }
        return defer.promise;
    }
};