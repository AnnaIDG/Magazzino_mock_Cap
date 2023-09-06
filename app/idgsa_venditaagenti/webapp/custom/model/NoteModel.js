jQuery.sap.declare("model.NoteModel");

model.NoteModel = {
    /**
     * @memberOf model.NoteModel
     */
    getNotes: function () {
        this._noteDefer = Q.defer();
        $.getJSON("custom/model/mockData/NotesMock.json").success(function (result) {
            this._noteDefer.resolve(result);
        }.bind(this)).fail(function (err) {
            this._noteDefer.reject(err);
        }.bind(this));
        return this._noteDefer.promise;
    }
}