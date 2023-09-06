jQuery.sap.declare("model.WorkingOrdersModel");
// jQuery.sap.require("utils.Util");

model.WorkingOrdersModel = {
    /**
     * @memberOf model.OrderModel
     */
    _isMock : icms.Component.getMetadata().getManifestEntry("sap.app").isMock,

    getWorkingOrdersList: function (req, success, error) {
        if (this._isMock) {
            $.getJSON("custom/model/mockData/WorkingOrders.json").success(function (result) {
                var results = [];
                if (Array.isArray(result) && result.length > 0) {
                    results = result;
                } else if (result.hasOwnProperty("results") && result.results) {
                    results = result.results;
                }
                if(results.length > 0 && req && req.hasOwnProperty("isOP") && req.isOP){
                    results = results.filter(function(obj){
                        return obj.orderStatus && obj.orderStatus === "01";
                    });
                }
                success(results);
            }.bind(this)).fail(function (err) {
                error(err);
            }.bind(this));
        } else {
            /*real call*/
        }
    },

    getWorkingOrderDetail: function (req, success, error) {
        if (this._isMock) {
            $.getJSON("custom/model/mockData/WorkingOrderDetailList.json").success(function (result) {
                success(result);
            }.bind(this)).fail(function (err) {
                error(err);
            }.bind(this));
        } else {
            /*real call*/
        }
    },

    getAllStatuses: function(success, error){
        if (this._isMock) {
            $.getJSON("custom/model/mockData/WorkingOrderStatuses.json").success(function (result) {
                success(result);
            }.bind(this)).fail(function (err) {
                error(err);
            }.bind(this));
        } else {
            /*real call*/
        }
    },

    // getFilteredInvoicesList: function (req, success, error) {
    //
    //         var success = function (result) {
    //             console.log(result);
    //             if (result && typeof result === 'object' && result.results) {
    //                 dDefer.resolve(result);
    //             } else {
    //                 dDefer.resolve({results: result});
    //             }
    //         }.bind(this);
    //         var error = function (err) {
    //             dDefer.reject(err);
    //         }.bind(this);
    //         var newReq = {};
    //         if (req) {
    //             for (var idx in req) {
    //                 if (!req.hasOwnProperty(idx)) continue;
    //                 if (idx === null || idx === undefined) {
    //                     continue;
    //                 }
    //                 if (idx === "clienti") {
    //                     if(req["clienti"] && req["clienti"].hasOwnProperty("codiceCliente")){
    //                         propertyName = "codiceClienteFornitore";
    //                         newReq[propertyName] = req["clienti"].codiceCliente;
    //                     }
    //                     if(req["clienti"] && req["clienti"].hasOwnProperty("ragioneSociale")){
    //                         propertyName = "ragioneSocialeCliente";
    //                         newReq[propertyName] = req["clienti"].ragioneSociale;
    //                     }
    //                 }
    //                 if (idx === "date") {
    //                     if(req["date"] && req["date"].hasOwnProperty("startDate") && req["date"].hasOwnProperty("endDate")){
    //                         var startDate = utils.Util.convertDate2yyyyMMddString(req["date"].startDate);
    //                         var endDate = utils.Util.convertDate2yyyyMMddString(req["date"].endDate);
    //                         if(startDate && endDate){
    //                             newReq["startDate"] = startDate;
    //                             newReq["endDate"] = endDate;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         model.service.DataWrapperService.as400.getFilteredInvoices(newReq, success, error);
    //         return dDefer.promise;
    //     } else {
    //         var mDefer = Q.defer();
    //         model.service.IDBManager.showOfflineData("invoices").then(
    //             function (result) {
    //                 var originalResults = [];
    //                 var filteredResults = [];
    //                 if (result.results) {
    //                     originalResults = result.results;
    //                 }
    //                 var propertyName;
    //                 var filterArrayFunction;
    //                 if (req) {
    //                     for (var idx in req) {
    //                         if (!req.hasOwnProperty(idx)) continue;
    //                         if (idx === null || idx === undefined) {
    //                             continue;
    //                         }
    //                         if (idx === "clienti") {
    //                             if(req["clienti"] && req["clienti"].hasOwnProperty("codiceCliente")){
    //                                 propertyName = "codiceClienteFornitore";
    //                                 filterArrayFunction = function (obj) {
    //                                     if (obj.listaFatture)
    //                                         return obj.listaFatture[0][propertyName] === req["clienti"].codiceCliente;
    //                                 };
    //                                 filteredResults = filteredResults.concat(originalResults.filter(filterArrayFunction));
    //                             }
    //                             if(req["clienti"] && req["clienti"].hasOwnProperty("ragioneSociale")){
    //                                 propertyName = "ragioneSocialeCliente";
    //                                 filterArrayFunction = function (obj) {
    //                                     if (obj.listaFatture)
    //                                         return obj.listaFatture[0][propertyName].indexOf(req["clienti"].ragioneSociale) > -1;
    //                                 };
    //                                 filteredResults = filteredResults.concat(originalResults.filter(filterArrayFunction));
    //                             }
    //                         }
    //                         if (idx === "date") {
    //                             if(req["date"] && req["date"].hasOwnProperty("startDate") && req["date"].hasOwnProperty("endDate")){
    //                                 var startDate = new Date(req["date"].startDate);
    //                                 var endDate = new Date(req["date"].endDate);
    //                                 propertyName = "dataFattura";
    //                                 filterArrayFunction = function (obj) {
    //                                     if (obj.listaFatture) {
    //                                         var dataFattura = utils.Util.convertyyyyMMddString2NewDate(obj.listaFatture[0][propertyName]);
    //                                         if(typeof dataFattura === 'object'){
    //                                             return startDate <= dataFattura && dataFattura <= endDate;
    //                                         }else{
    //                                             return false;
    //                                         }
    //                                     }else{
    //                                         return false;
    //                                     }
    //                                 };
    //                                 filteredResults = filteredResults.concat(originalResults.filter(filterArrayFunction));
    //                             }
    //                         }
    //                     }
    //                 }
    //                 mDefer.resolve({results: filteredResults});
    //             }.bind(this),
    //             function (err) {
    //                 mDefer.reject(err);
    //             }.bind(this)
    //         );
    //         return mDefer.promise;
    //     }
    // },

};
