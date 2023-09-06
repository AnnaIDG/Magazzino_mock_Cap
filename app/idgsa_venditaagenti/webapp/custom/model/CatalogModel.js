jQuery.sap.declare("model.CatalogModel");
jQuery.sap.require("utils.CatalogSerializer");
jQuery.sap.require("sap.m.MessageToast");

model.CatalogModel = {

    /**
     * @memberOf model.CatalogModel
     */
    _isMock: icms.Component.getMetadata().getManifestEntry("sap.app").isMock,
    
    i18nmodel : new sap.ui.model.resource.ResourceModel({
			bundleUrl : "custom/i18n/i18n.properties"
		}),

    hierarchy: {
        "items": []
    },

    products: {
        "items": []
    },

    getHierarchy: function (req) {
        if (this._isMock) {
            var hDefer = Q.defer();
            if (!!req.Vkorg)
                var salesOrg = req.Vkorg;
            var fSuccess = function (result) {

                this.hierarchy.items = result;
                hDefer.resolve(this.hierarchy);
            };
            fSuccess = _.bind(fSuccess, this);
            var fError = function (err) {
                this.hierarchy.items = [];
                hDefer.reject(err);
            };
            fError = _.bind(fError, this);

            $.getJSON("custom/model/mockData/Hierarchy" + salesOrg + ".json").success(fSuccess).fail(fError);

            /*
             * model.service.ODataService.getCatalogHierarchy(req, fSuccess,
             * fError);
             */

            return hDefer.promise;
        } else {
            var hDefer = Q.defer();
            var fSuccess = function (result) {
                var r = utils.CatalogSerializer.Hierarchy.fromSapItems(result);
                this.hierarchy = r;
                hDefer.resolve(this.hierarchy);
            };
            fSuccess = _.bind(fSuccess, this);
            var fError = function (err) {
                this.hierarchy.items = [];
                hDefer.reject(err);
            };
            fError = _.bind(fError, this);
            model.service.ODataService.getCatalogHierarchy(req, fSuccess, fError);


            return hDefer.promise;
        }
    },

    getProducts: function (req) {
        var defer = Q.defer();
        if (!!req.Vkorg)
            var salesOrg = req.Vkorg;
        var fSuccess = function (result) {

            this.products.items = _.filter(result, {
                parentId: req.productId
            });

            defer.resolve(this.products);
            model.service.LocalStorageService.session.save("productsList", this.products);
        };
        fSuccess = _.bind(fSuccess, this);

        var fError = function (err) {
            this.products = [];
            model.service.LocalStorageService.session.save("productsList", this.products);
            defer.reject(err);
        };
        fError = _.bind(fError, this);

        $.getJSON("custom/model/mockData/ProductsMock" + salesOrg + ".json").success(fSuccess).fail(fError);

        return defer.promise;
    },

    loadFilteredProducts: function (reqOdata, req) {
        var defer = Q.defer();
        if (!!reqOdata)
            if (typeof reqOdata === 'string') {
                var productId = reqOdata;
            } else {
                //TODO
            }
        if (!!req.Vkorg)
            var salesOrg = req.Vkorg;
        var fSuccess = function (result) {

            if (!!productId) {
                this.products.items = _.filter(result, {
                    productId: productId,
                    level: "3"
                });
            } else {
                this.products.items = _.filter(result, {
                    level: "3"
                });
            }


            defer.resolve(this.products);
            model.service.LocalStorageService.session.save("productsList", this.products);
        };
        fSuccess = _.bind(fSuccess, this);

        var fError = function (err) {
            this.products = [];
            model.service.LocalStorageService.session.save("productsList", this.products);
            defer.reject(err);
        };
        fError = _.bind(fError, this);

        $.getJSON("custom/model/mockData/ProductsMock" + salesOrg + ".json").success(fSuccess).fail(fError);

        return defer.promise;
    },

    getProductsByLevel: function (level, parent, salesOrg) {
        var defer = Q.defer();
        var fSuccess = function (result) {

            this.products.items = _.filter(result, {
                level: level,
                parentId: parent
            });

            defer.resolve(this.products);
            model.service.LocalStorageService.session.save("productsList", this.products);
        };
        fSuccess = _.bind(fSuccess, this);

        var fError = function (err) {
            this.products = [];
            model.service.LocalStorageService.session.save("productsList", this.products);
            defer.reject(err);
        };
        fError = _.bind(fError, this);

        $.getJSON("custom/model/mockData/ProductsMock" + salesOrg + ".json").success(fSuccess).fail(fError);

        return defer.promise;
    },


};