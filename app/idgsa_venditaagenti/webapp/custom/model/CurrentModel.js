jQuery.sap.declare("model.CurrentModel");
jQuery.sap.require("model.CustomerModel");
jQuery.sap.require("model.OrderModel");
jQuery.sap.require("model.service.LocalStorageService");

model.CurrentModel = (function () {
    /**
     * @memberOf model.CurrentModel
     */
    var customer;
    var order;

    var getCurrentModelCustomer = function () {
        if (!customer) {
            var customerData = model.service.LocalStorageService.session.get("currentCustomer");
            if (customerData) {
                customer = new model.CustomerModel(customerData);
            } else {
                customer = null;
            }
        }
        return customer;
    };

    var setCurrentModelOrder = function (order) {
        model.service.LocalStorageService.session.save("currentOrder", order);
    };

    var getCurrentModelOrder = function () {
        if (!order) {
            var orderData = model.service.LocalStorageService.session.get("currentOrder");
            if (orderData) {
                order = new model.OrderModel(orderData);
            } else {
                order = null;
            }
        }
        return order;
    };

    return {
        setOrder: setCurrentModelOrder,
        getCustomer: getCurrentModelCustomer,
        getOrder: getCurrentModelOrder
    };
})();
