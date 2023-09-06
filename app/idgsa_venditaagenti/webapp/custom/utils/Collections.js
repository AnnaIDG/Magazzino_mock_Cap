jQuery.sap.declare("utils.Collections");

utils.Collections = {

    _defer: {},
    _collectionsModel: {},

    getById: function (collections, idCode) {
        return _.find(collections, {
            id: idCode
        });
    },
    
    getModel: function (collectionName) {
        if (this._defer[collectionName] && this._defer[collectionName].promise.isFulfilled()) {
            this._defer[collectionName].resolve(this._collectionsModel[collectionName]);
        } else {
            this._defer[collectionName] = Q.defer();
            var fSuccess = function (result) {
                this._collectionsModel[collectionName] = new sap.ui.model.json.JSONModel(result);

                this._defer[collectionName].resolve(this._collectionsModel[collectionName]);
            }
            fSuccess = _.bind(fSuccess, this);

            var fError = function (err) {
                this._collectionsModel[collectionName] = {};
                this._defer[collectionName].reject(err);
            }
            fError = _.bind(fError, this);
            //It wil be trasformed to the respective odata call
            $.getJSON("custom/model/mockData/" + collectionName + ".json")
                .success(fSuccess)
                .fail(fError);
        }
        return this._defer[collectionName].promise;
    }
};
