jQuery.sap.declare("model.PackingModel");
  
jQuery.sap.require("utils.OrderDefaultsSerializer");
jQuery.sap.require("utils.OrderSerializer");
model.PackingModel = {
    /**
     * @memberOf model.PackingModel
     */
    _isMock: icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
    getPackingList: function (req) {
        if (this._isMock) {
            this._orderDefer = Q.defer();
            $.getJSON("custom/model/mockData/OrdersListMock.json").success(function (result) {
                var filteredResult = [];
                if (!!req.Kunnr && req.Kunnr.length > 0) filteredResult = _.where(result, {
                    'customerId': req.Kunnr
                });
                if (filteredResult.length > 0) {
                    this._orderDefer.resolve(filteredResult);
                } else {
                    this._orderDefer.resolve(result);
                }
            }.bind(this)).fail(function (err) {
                this._orderDefer.reject(err);
            }.bind(this));
            return this._orderDefer.promise;
        } else {
            //**
            if (req.Bukrs) {
                req.BukrsVf = _.clone(req.Bukrs);
                delete req.Bukrs;
            }
            if (req && req.fromDate && req.toDate) {
                req.fromDate = req.fromDate.toISOString();
                req.toDate = req.toDate.toISOString();
                req.IAudat1 = req.fromDate.substr(0, req.fromDate.length - 1);
                req.IAudat2 = req.toDate.substr(0, req.toDate.length - 1);
                delete req.fromDate;
                delete req.toDate;
            }
            //**
            var orderListDefer = Q.defer();
            var fSuccess = function (result) {
                var ordersList = utils.OrderSerializer.OrdersList.fromSapItems(result);
                orderListDefer.resolve(ordersList);
            };
            var fError = function (err) {
                orderListDefer.reject(err.statusText);
            };
            fSuccess = _.bind(fSuccess, this);
            fError = _.bind(fError, this);
            model.service.ODataService.getOrdersList(req, fSuccess, fError);
            return orderListDefer.promise;
        }
    },
    getPackingDetail: function (packingId) {
        if (this._isMock) {
            this._orderDefer = Q.defer();
            $.getJSON("custom/model/mockData/PackingListDetail.json").success(function (result) {
                var packingList = _.find(result.results, {
                    'packingListId': packingId
                });
                this._orderDefer.resolve(packingList);
            }.bind(this)).fail(function (err) {
                this._orderDefer.reject(err);
            }.bind(this));
            return this._orderDefer.promise;
        } else {
            var orderDetailDefer = Q.defer();
            var fSuccess = function (result) {
                var order = utils.OrderSerializer.orderDetail.fromSap(result);
                orderDetailDefer.resolve(order);
            };
            var fError = function (err) {
                orderDetailDefer.reject(err.statusText);
            };
            fSuccess = _.bind(fSuccess, this);
            fError = _.bind(fError, this);
            model.service.ODataService.getOrderDetail(orderId, fSuccess, fError);
            return orderDetailDefer.promise;
        }
    },
    getCustomerDefaults: function (data) {
        if (this._isMock) {
            this._defaultDefer = Q.defer();
            $.getJSON("custom/model/mockData/OrderDefaultsMock.json").success(function (result) {
                var customerOrderDefaultsMock = utils.OrderDefaultsSerializer.OrderDefault.fromSap(result);
                this._defaultDefer.resolve(customerOrderDefaultsMock);
            }.bind(this)).fail(function (err) {
                this._defaultDefer.reject(err);
            }.bind(this));
            return this._defaultDefer.promise;
        } else {
            this._defaultDefer = Q.defer();
            var success = function (result) {
                console.log(result);
                var customerOrderDefaults = utils.OrderDefaultsSerializer.OrderDefault.fromSap(result);
                this._defaultDefer.resolve(customerOrderDefaults);
            }.bind(this);
            //
            var error = function (err) {
                this._defaultDefer.reject(err.statusText);
            }.bind(this);
            var params = '(';
            //			params = params + "IStcd1='" + data.codiceFiscale + "',";
            //			params = params + "IStceg='" + data.partitaIVA + "',";
            params = params + "Bukrs='" + data.society + "',";
            params = params + "Vkorg='" + data.salesOrg + "',";
            params = params + "Vtweg='" + data.distributionChannel + "',";
            params = params + "Spart='" + data.division + "',";
            //            params = params + "Cdage='" + data.agentCode + "',";
            params = params + "Kunnr='" + data.customerId + "')";
            model.service.ODataService.getCustomerDefault(params, success, error);
            return this._defaultDefer.promise;
        }
    },
    createNewOrder: function (serializedData) {
        this.orderId = undefined;
        this.customerId = undefined;
        this.customerName = undefined;
        this.rifOrder = undefined;
        this.orderType = undefined;
        this.destination = undefined;
        this.paymentMethod = undefined;
        this.incoterms1 = undefined;
        this.incoterms2 = undefined;
        this.meansShipping = undefined;
        this.shippingType = undefined;
        this.validDateList = undefined;
        this.requestedDate = new Date();
        this.notesList = {
            "items": []
        };
        this.update = function (data) {
            for (var prop in data) {
                this[prop] = data[prop];
            }
        };
        return this;
    },
    createOrderFromData: function (o) {
        for (var prop in o) {
            this.prop = o[prop];
        }
        return this;
    },
    saveOrder: function (order) {
        var defer = Q.defer();
        order.Simula = "";
        var sapOrder = utils.OrderSerializer.order.toSAP(order);
        var fSuccess = function (result) {
            defer.resolve(result);
        };
        fSuccess = _.bind(fSuccess, this);
        var fError = function (err) {
            defer.reject(err);
        };
        fError = _.bind(fError, this);
        model.service.ODataService.createOrder(sapOrder, fSuccess, fError);
        return defer.promise;
    },
    simulateOrder: function (order) {
        var defer = Q.defer();
        order.Simula = "X";
        var sapOrder = utils.OrderSerializer.order.toSAP(order);
        sapOrder.Vbeln = "";
        var fSuccess = function (result) {
            var sapOrder = utils.OrderSerializer.SimulatedOrder.fromSap(result);
            defer.resolve(sapOrder);
        };
        fSuccess = _.bind(fSuccess, this);
        var fError = function (err) {
            defer.reject(err);
        };
        fError = _.bind(fError, this);

        model.service.ODataService.createOrder(sapOrder, fSuccess, fError);

        return defer.promise;
    },
    getDelivery: function (req, type) {
        var defer = Q.defer();
        var deliveryList = [];
        var fSuccess = function (result) {
            if (result && result.results && result.results[0] && result.results[0].VbtypN === "J") {
                deliveryList = utils.OrderSerializer.order_deliveryList.fromSapItems(result);
            }
            defer.resolve(deliveryList);
        };
        var fError = function (err) {
            defer.reject(utils.Message.getError(err));
        };
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.service.ODataService.getDeliveryOrInvoicesListForOrder(req, type, fSuccess, fError);
        return defer.promise;
    },
    getOrderByVbeln: function (req) {
        //**
        if (req.Bukrs) {
            req.BukrsVf = _.clone(req.Bukrs);
            delete req.Bukrs;
        }
        //**
        var orderDefer = Q.defer();
        var fSuccess = function (result) {
            var order = utils.OrderSerializer.OrdersList.fromSapItems(result);
            orderDefer.resolve(order);
        };
        var fError = function (err) {
            orderDefer.reject(err.statusText);
        };
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);
        model.service.ODataService.getOrdersList(req, fSuccess, fError);
        return orderDefer.promise;
    },

    printOdV: function (orderId) {
        var defer = Q.defer();
        var fSuccess = function (res) {
            var url = model.service.ODataService._serverUrl + model.service.ODataService._printOdv;
            url = url + "(IVbeln='" + orderId + "')/$value";
            defer.resolve(url);
        }
        fSuccess = _.bind(fSuccess, this);

        var fError = function (err) {
            defer.reject(utils.Message.getError(err));
        };
        fError = _.bind(fError, this);

        model.service.ODataService.printOdV(orderId, fSuccess, fError);

        return defer.promise;
    },

    setQuantityToZero: function (o) {
        if (o && o.productsList) {
            var p = o.productsList;
            for (var i = 0; i < p.length; i++) {
                p[i].quantity = 0;
            }
        }
        return o;

    },
    getInvoicesList: function (req) {
        var defer = Q.defer();
        var fSuccess = function (result) {
            var invoicesList = utils.OrderSerializer.order_invoicesList.fromSapItems(result);
            defer.resolve(invoicesList);
        };
        var fError = function (err) {
            defer.reject(err);
        };
        fSuccess = _.bind(fSuccess, this);
        fError = _.bind(fError, this);

        var oggi = new Date();
        var timeZoneOffset = oggi.getTimezoneOffset();
        if (req && req.fromDate && req.toDate) {

            if (req.fromDate && typeof (req.fromDate) === "object") {
                if (req.fromDate.getHours() === 0 && req.fromDate.getMinutes() === 0) {
                    //req.fromDate.setUTCDate(req.fromDate.getDate());
                    req.fromDate.setHours((oggi.getHours() - (timeZoneOffset / 60)));
                    req.fromDate.setMinutes(oggi.getMinutes());
                }
            }

            if (req.toDate && typeof (req.toDate) === "object") {
                if (req.toDate.getHours() === 0 && req.toDate.getMinutes() === 0) {
                    //req.toDate.setUTCDate(req.toDate.getDate());
                    req.toDate.setHours((oggi.getHours() - (timeZoneOffset / 60)));
                    req.toDate.setMinutes(oggi.getMinutes());
                }
            }

            req.fromDate = req.fromDate.toISOString();
            req.toDate = req.toDate.toISOString();
            req.IFkdat1 = req.fromDate.substr(0, req.fromDate.length - 1);
            req.IFkdat2 = req.toDate.substr(0, req.toDate.length - 1);
            delete req.fromDate;
            delete req.toDate;
        }

        model.service.ODataService.getInvoicesList(req, fSuccess, fError);
        return defer.promise;
    }
};
