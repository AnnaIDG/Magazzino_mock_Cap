jQuery.sap.declare("model.service.ODataService");

model.service.ODataService = {
  _serverUrl: icms.Component.getMetadata().getManifestEntry("sap.app").dataSources["SERVER"].url,
  _logoffUrl: icms.Component.getMetadata().getManifestEntry("sap.app").dataSources["LOGOFF"].url,
  _userDataService: "/User_DataSet",
  _customersList: "/CustomersListSet",
  _customerDetail: "/CustomerSet",
  _customerDefault: "/CustomerDefaultSet",
  _catalogSet: "/CatalogoSet",
  _getOrdersList: "/SalesOrderGetListSet",

  /**
   * @memberOf model.service.ODataService
   */
  _getDataModel: function () {
    if (!this._dataModel) {
      this._dataModel = new sap.ui.model.odata.ODataModel(this._serverUrl, true);
    }
    return this._dataModel;
  },

  login: function (username, password, success, error) {
    $.ajax({
      url: this._serverUrl,
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

  },

  // **************** CUSTOMER ********************
  getCustomersList: function (params, success, error) {
    this._getDataModel().read(this._customersList + params, {
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
  },

  // ***************** CATALOG ********************
  getCatalogHierarchy: function (req, success, error) {
    var url = this._catalogSet;

    var isFirst = true;
    for (var prop in req) {
      if (_.isEmpty(req[prop]))
        continue;

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

  // ***************** ORDER **********************

  getOrdersList: function (req, success, error) {
    var url = this._getOrdersList;

    var isFirst = true;
    for (var prop in req) {
      if (_.isEmpty(req[prop]))
        continue;

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
      error: error,
      async: true
    });
  }
};