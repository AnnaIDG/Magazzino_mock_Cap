jQuery.sap.declare("model.service.ODataService");
model.service.ODataService = {
    _serverUrl: icms.Component.getMetadata().getManifestEntry("sap.app").dataSources["SERVER"].url,
    _logoffUrl: icms.Component.getMetadata().getManifestEntry("sap.app").dataSources["LOGOFF"].url,
    _userDataService: "/User_DataSet",
    _customersList: "/CustomersListSet",
    _customerDetail: "/CustomerSet",
    _customerDefault: "/CustomizingDefaultSet",
    _catalogSet: "/CatalogoSet",
    _getOrdersList: "/SalesOrderGetListSet",
    _getOrdersBlock: "/SOBlocksSet",
    _printOdv: "/PrintOdVSet",
    _noteTypeList: "/F4_TdidSet",
    _orderDetail: "/SalesOrderHeaderSet",
    _destinationList: "F4_CustomerPartnerSet",
    _productPromotionService: "/CustomerCondSet",
    _deliveryList: "/SODeliverySet",
    _printDelivery: "/PrintDeliverySet",
    _printInvoice: "/PrintInvoiceSet",
    _customerOrgsService: "/Customer_DataSet",
    _F4_Inco: "/F4_Inco1Set",
    _F4_Vsart: "/F4_VsartSet",
    _F4_Zterm: "/F4_ZtermSet",
    _F4_Land1: "/F4_Land1Set",
    _CustomerCreditLimit: "/CustomerCreditLimitSet",
    _shopCartSet: "/ShopCartSet",
    _createCustomer: "/CustomerSet",
    _ShopCartSet: "/ShopCartSet",
    _getInvoicesList: "/InvoiceSet",
    /**
     * @memberOf model.service.ODataService
     */
    _getDataModel: function () {
        if (!this._dataModel) {
            this._dataModel = new sap.ui.model.odata.ODataModel(this._serverUrl, {skipMetadataAnnotationParsing: true, json: true});
        }
        return this._dataModel;
    },
    login: function (username, password, success, error) {
        $.ajax({
            url: this._serverUrl +"/?sap-client=200"+"&sap-language=" + (sessionStorage.getItem("language") ? sessionStorage.getItem("language") : "IT"),
            type: "GET",
            headers: {
                "Authorization": "Basic " + btoa(username + ":" + password)
            },
            context: this,
            success: function () {
                this._getDataModel().read(this._userDataService + "?$filter=Uname eq '" + username + "'", {
                    success: success,
                    error: error,
                    async: true
                });
            }.bind(this),
            error: error,
            async: false
        });

        //         $.ajax({
        //            url: this._serverUrl + "/?sap-language=" + (sessionStorage.getItem("language") ? sessionStorage.getItem("language") : "IT")
        //            , type: "GET"
        //             , username: username
        //             , password : password
        //
        //            , success: function () {
        //                this._getDataModel().read(this._userDataService + "?$filter=Uname eq '" + username + "'", {
        //                    success: success
        //                    , error: error
        //                    , async: true
        //                });
        //            }.bind(this)
        //            , error: error
        //            , async: false
        //        });
    },
    logout: function (success, error) {
        $.ajax({
            url: this._logoffUrl,
            type: "GET",
            context: this,
            success: success,
            error: error,
            async: false
        });
    }, // **************** CUSTOMER ********************
    getCustomersList: function (req, success, error) {
        var url = this._customersList;
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop])) continue;
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            url = url.concat(propString);
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getCustomerDetail: function (params, success, error) {
        this._getDataModel().read(this._customerDetail + params, {
            success: success,
            error: error
        });
    },
    getCustomerDefault: function (params, success, error) {
        this._getDataModel().read(this._customerDefault + params, {
            success: success,
            error: error
        });
    }, // ***************** CATALOG ********************
    getCatalogHierarchy: function (req, success, error) {
        var url = this._catalogSet;
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop])) continue;
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            if (prop == "Datefrom") {
                propString = prop + " eq datetime'" + req[prop] + "'";
            }
            if (prop == "Dateto") {
                propString = prop + " eq datetime'" + req[prop] + "'";
            }
            url = url.concat(propString);
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getProducts: function (req, success, error) {
        var url = this._catalogSet;
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop])) continue;
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            url = url.concat(propString);
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    }, // ***************** ORDER **********************
    getOrdersList: function (req, success, error) {
        var url = this._getOrdersList;
        if (req) {
            var isFirst = true;
            for (var prop in req) {
                if (_.isEmpty(req[prop])) continue;
                if (isFirst) {
                    url = url.concat("?$filter=");
                    isFirst = false;
                } else {
                    url = url.concat(" and ");
                }
                var propString = prop + " eq '" + req[prop] + "'";
                if (prop == "IAudat1") {
                    propString = prop + " eq datetime'" + req[prop] + "'";
                }
                if (prop == "IAudat2") {
                    propString = prop + " eq datetime'" + req[prop] + "'";
                }
                url = url.concat(propString);
            }
            if (url.indexOf("IAudat1") < 0) {
                url = url + "&$top=100";
            }
        } else {
            url = url + "?$top=100";
        }
        this._getDataModel().read(url, {
            success: success,
            error: error,
            async: true
        });
    },
    getNoteTypeList: function (req, success, error) {
        var url = this._noteTypeList;
        var isFirst = true;
        for (var prop in req) {
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            url = url.concat(propString);
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getOrderDetail: function (req, success, error) {
        var url = this._orderDetail;
        url = url + "(Vbeln='" + req + "')?$expand=SalesOrderItemSet,SalesOrderConditionSet,SalesOrderTextSet";
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getOrderBlock: function (req, success, error) {
        var url = this._getOrdersBlock;
        url = url + "(Vbeln='" + req + "')";
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getDestinations: function (params, success, error) {
        this._getDataModel().read(this._destinationList + params, {
            success: success,
            error: error
        });
    },
    createOrder: function (order, success, error) {
        var url = this._orderDetail;
        var entity = {};
        for (var prop in order) {
            if (!order[prop]) continue;
            entity[prop] = order[prop];
        }
        this._getDataModel().create(url, entity, {
            success: success,
            error: error
        });
    },
    getProductPromotion: function (params, success, error) {
        this._getDataModel().read(this._productPromotionService + params, {
            success: success,
            error: error
        });
    },
    getDeliveryOrInvoicesListForOrder: function (id, type, success, error) {
        var url = this._deliveryList + "?$filter=VbelnSo eq '" + id + "' and VbtypN eq '" + type + "'";
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    }, // Tendine ordine
    getShippingAndDelivery: function (success, error) {
        var url = this._F4_Vsart;
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getIncoterms: function (success, error) {
        var url = this._F4_Inco;
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getPaymentMethod: function (success, error) {
        var url = this._F4_Zterm;
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getNationsList: function (success, error) {
        var url = this._F4_Land1;
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getCustomerStatus: function (data, success, error) {
        var url = this._CustomerCreditLimit;
        url = url + "(MKunnr='" + data.customerId + "',MBukrs='" + data.society + "')";
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    },
    getGenericF4Set: function (f4Name, req, success, error) {
        var url = "/F4_" + f4Name + "Set";
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop])) continue;
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            url = url.concat(propString);
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    }, // historyCarts
    loadCarts: function (req, success, error) {
        var url = this._shopCartSet;
        var isFirst = true;
        for (var prop in req) {
            if (_.isEmpty(req[prop])) continue;
            if (isFirst) {
                url = url.concat("?$filter=");
                isFirst = false;
            } else {
                url = url.concat(" and ");
            }
            var propString = prop + " eq '" + req[prop] + "'";
            url = url.concat(propString);
        }
        this._getDataModel().read(url, {
            success: success,
            error: error
        });
    }, //********************************************************
    // Customers Create
    createCustomer: function (data, success, error) {
            var url = this._createCustomer;
            var entity = {};
            for (var prop in data) {
                if (!data[prop]) continue;
                entity[prop] = data[prop];
            }
            entity.Kunnr = "";
            this._getDataModel().create(url, entity, {
                success: success,
                error: error
            });
        }
        // order list

        ,
    loadBlockingOrderReasons: function (orderId, success, error) {
        var url = "SOBlocksSet?$filter=Vbeln eq '" + orderId + "'";
        this._getDataModel().read(url, {
            success: success,
            error: error,
            async: true
        });
    },
    saveCart: function (info, success, error) {
        var url = this._ShopCartSet;
        this._getDataModel().create(url, info, {
            success: success,
            error: error
        });
    },
    printOdV: function (orderId, success, error) {
        var url = this._printOdv;

        url = url + "(IVbeln='" + orderId + "')";

        this._getDataModel().read(url, {
            success: success,
            error: error,
            async: true
        });
    },
    getInvoicesList: function (req, success, error) {
        var url = this._getInvoicesList;
        if (req) {
            var isFirst = true;
            for (var prop in req) {
                if (_.isEmpty(req[prop])) continue;
                if (isFirst) {
                    url = url.concat("?$filter=");
                    isFirst = false;
                } else {
                    url = url.concat(" and ");
                }
                var propString = prop + " eq '" + req[prop] + "'";
                if (prop == "IFkdat1") {
                    propString = prop + " eq datetime'" + req[prop] + "'";
                }
                if (prop == "IFkdat2") {
                    propString = prop + " eq datetime'" + req[prop] + "'";
                }
                url = url.concat(propString);
            }
            url = url + "&$top=100";
        } else {
            url = url + "?$top=100";
        }
        this._getDataModel().read(url, {
            success: success,
            error: error,
            async: true
        });
    }

};
