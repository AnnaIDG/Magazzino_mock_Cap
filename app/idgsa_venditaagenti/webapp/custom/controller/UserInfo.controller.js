jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("utils.Util");

controller.AbstractController.extend("controller.UserInfo", {

    onInit: function () {
        controller.AbstractController.prototype.onInit.apply(this, arguments);
    },

    handleRouteMatched: function (evt) {

        if (!this._checkRoute(evt, "userInfo"))
			return;
        if(model.service.LocalStorageService.session.get("userLogged")[0])
        this.userModel.setProperty("/userLogged", model.service.LocalStorageService.session.get("userLogged")[0]);

    },

    navBack: function () {
        utils.Util.myNavBack();
    },

});