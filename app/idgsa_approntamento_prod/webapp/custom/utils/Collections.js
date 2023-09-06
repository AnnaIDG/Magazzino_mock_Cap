jQuery.sap.declare("utils.Collections");
jQuery.sap.require("utils.F4Serializer");
jQuery.sap.require("model.service.ODataService");

utils.Collections = {

    _isMock: icms.Component.getMetadata().getManifestEntry("sap.app").isMock,

    loadF4Data: function (set, orgDataForSapReq) {
        if (this._isMock) {
            var defer = Q.defer();
            var serializeNoteTypes = _.bind(
                utils.F4Serializer.noticeType.fromSAP, this);

            var capitalizeFirstLetter = function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            };
            var filename = capitalizeFirstLetter(set);

            $.getJSON("custom/model/mockData/" + filename + ".json")
                .success(
                    function (result) {
                        var i = 0;
                        var obj = {
                            results: []
                        };

                        switch (set) {
                        case "noteTypes":
                            if (result.results && result.results.length > 0) {
                                for (i = 0; i < result.results.length; i++) {
                                    var data = serializeNoticeTypes(result.results[i]);
                                    obj.results.push(data);
                                }
                            }
                            break;

                        }
                        console.log("Data for " + set + " loaded");
                        var model = new sap.ui.model.json.JSONModel(obj);
                        defer.resolve(model);
                    }.bind(this)).fail(function (err) {
                    console.log("Error Loading Items for " + set);
                    defer.reject(err);
                }.bind(this));

            return defer.promise;

        } else {
            var defer = Q.defer();
            var serializeNoteTypes = _.bind(utils.F4Serializer.noteType.fromSAP, this);
            var serializeScaleTypes = _.bind(utils.F4Serializer.scaleType.fromSAP, this);
            var f4CollectionName = "";
            switch(set){
                case "noteTypes":
                    f4CollectionName = "Tdid";
                    break;
                case "scaleTypes":
                    f4CollectionName = "UM";
                    break;
                default:
                    f4CollectionName = set;
            }

            var success = function (result) {
                var i = 0;
                var obj = {
                    results: []
                };
                switch (set) {
                case "noteTypes":
                    
                    if (result.results && result.results.length > 0) {
                        for (i = 0; i < result.results.length; i++) {
                            var data = serializeNoteTypes(result.results[i]);
                            obj.results.push(data);
                        }
                    }
                    break;
                case "scaleTypes":
                    
                    if (result.results && result.results.length > 0) {
                        for (i = 0; i < result.results.length; i++) {
                            var data = serializeScaleTypes(result.results[i]);
                            obj.results.push(data);
                        }
                    }
                    break;
                    default:
                     if (result.results && result.results.length > 0) {
                        for (i = 0; i < result.results.length; i++) {
                            //var data = serializeNoteTypes(result.results[i]);
                            var data = result.results[i];
                            obj.results.push(data);
                        }
                    }   
     
                }
                console.log("Data for " + set + " loaded");
                var model = new sap.ui.model.json.JSONModel(obj);
                defer.resolve(model);
            }.bind(this);

            var error = function (err) {
                console.log("Error Loading Items for " + set);
                defer.reject(err);
            }.bind(this);

            model.service.ODataService.getGenericF4Set(f4CollectionName, orgDataForSapReq, success, error);

            return defer.promise;
        }
    },
    
     getOdataSelect: function( f4CollectionName, filtro)
      {
        var defer = Q.defer();
        var fSuccess = function(result)
        {
          //console.log(property+" loaded");
          var model  = new sap.ui.model.json.JSONModel(result);
          defer.resolve(model);
        };
        fSuccess = _.bind(fSuccess, this);

        var fError = function(err)
        {
          sap.m.MessageToast.show("Error Loading Select "+ property);
          defer.reject(err);
        }
        fError = _.bind(fError, this);

        model.service.ODataService.getGenericF4Set(f4CollectionName, filtro, fSuccess, fError);
        return defer.promise;

      }
    

};