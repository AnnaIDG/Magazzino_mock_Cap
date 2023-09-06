jQuery.sap.declare("model.CurrentModel");

jQuery.sap.require("model.service.LocalStorageService");

model.CurrentModel = (function () {
    /**
     * @memberOf model.CurrentModel
     */
    var customer;
    var order;

    var getCurrentModelCustomer = function () {

        var customerData = model.service.LocalStorageService.session.get("currentCustomer");

        return customerData;
    };
    var setCurrentModelCustomer = function (c) {
        model.service.LocalStorageService.session.save("currentCustomer", c);
        return true;
    };

    var setCurrentModelOrder = function (order) {

        var currentCustomer = model.service.LocalStorageService.session.get("currentCustomer");
        var currentUser = model.service.LocalStorageService.session.get("userLogged") ? model.service.LocalStorageService.session.get("userLogged")[0] : "";


        var customerId = currentCustomer ? (currentCustomer.registry ? currentCustomer.registry.customerId : currentCustomer.customerId) : "";
        var agentCode = currentUser ? currentUser.agentCode : "";
        var name = "order_";


        model.service.LocalStorageService.session.save(name + customerId + "_" + agentCode, order);
        model.service.LocalStorageService.local.save(name + customerId + "_" + agentCode, order);

    };

    var getCurrentModelOrder = function () {


        var currentCustomer = model.service.LocalStorageService.session.get("currentCustomer");
        var currentUser = model.service.LocalStorageService.session.get("userLogged") ? model.service.LocalStorageService.session.get("userLogged")[0] : "";


        var customerId = currentCustomer ? (currentCustomer.registry ? currentCustomer.registry.customerId : currentCustomer.customerId) : "";
        var agentCode = currentUser ? currentUser.agentCode : "";
        var name = "order_";

        var order = model.service.LocalStorageService.session.get(name + customerId + "_" + agentCode);

        if (order) {

            order = utils.SessionDataAdapter.getModelObject(order);
            //  order = model.OrderModel.getOrderModel(order);
        } else {
            order = model.service.LocalStorageService.local.get(name + customerId + "_" + agentCode);
            if (order) {
                order = utils.SessionDataAdapter.getModelObject(order);
            }
        }




        return order;
    };

    var removeCurrentModelOrder = function (isOffer) {
        var currentCustomer = model.service.LocalStorageService.session.get("currentCustomer");
        var currentUser = model.service.LocalStorageService.session.get("userLogged") ? model.service.LocalStorageService.session.get("userLogged")[0] : "";


        var customerId = currentCustomer ? (currentCustomer.registry ? currentCustomer.registry.customerId : currentCustomer.customerId) : "";
        var agentCode = currentUser ? currentUser.agentCode : "";

        var name = "order_";

        model.service.LocalStorageService.session.remove(name + customerId + "_" + agentCode)
        model.service.LocalStorageService.local.remove(name + customerId + "_" + agentCode)

    };


    var setPrinted = function (orderId, type) {

        //var currentCustomer = model.service.LocalStorageService.session.get("currentCustomer");
        var currentUser = model.service.LocalStorageService.session.get("userLogged") ? model.service.LocalStorageService.session.get("userLogged")[0] : "";


        //var customerId = currentCustomer ? (currentCustomer.registry ? currentCustomer.registry.customerId : currentCustomer.customerId) : "";
        var agentCode = currentUser ? currentUser.agentCode : "";
        var name = type + "_";


        model.service.LocalStorageService.session.save(name + orderId + "_" + agentCode, true);
        model.service.LocalStorageService.local.save(name + orderId + "_" + agentCode, true);

    };

    var getPrintedValue = function (orderId, type) {

        var currentUser = model.service.LocalStorageService.session.get("userLogged") ? model.service.LocalStorageService.session.get("userLogged")[0]: "";

        var agentCode = currentUser ? currentUser.agentCode : "";
        var name = type + "_";

        var val = model.service.LocalStorageService.session.get(name + orderId + "_" + agentCode);

        if (!val) {
            val = model.service.LocalStorageService.local.get(name + orderId + "_" + agentCode);
        }
        return val;
    };

    var removePrintedValue = function (orderId, type) {

        var currentUser = model.service.LocalStorageService.session.get("userLogged") ? model.service.LocalStorageService.session.get("userLogged")[0] : "";

        var agentCode = currentUser ? currentUser.agentCode : "";

        var name = type + "_";

        model.service.LocalStorageService.session.remove(name + orderId + "_" + agentCode)
        model.service.LocalStorageService.local.remove(name + orderId + "_" + agentCode)

    };



    return {
        getOrder: getCurrentModelOrder,
        setOrder: setCurrentModelOrder,
        removeOrder: removeCurrentModelOrder,
        getCustomer: getCurrentModelCustomer,
        setCustomer: setCurrentModelCustomer,
        setPrinted: setPrinted,
        getPrinted: getPrintedValue,
        removePrinted: removePrintedValue

    };
})();
