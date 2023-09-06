jQuery.sap.declare("model.DiscountModel");
jQuery.sap.require("model.i18n");
jQuery.sap.require("utils.DiscountSerializer");
jQuery.sap.require("sap.m.MessageToast");

model.DiscountModel = (function () {

  DiscountModel = function (serializedData) {

    //proprietà dell'oggetto discount
    //I suppose every element ( with exception of productId, orderId, positionId) an object composed by name, unitVal, scale, totValue, currency
    this.orderId = "";
    this.positionId = "";
    this.productId = "";
    this.price = {};
    this.currency = "EUR";
    this.scale = "%";
    
    this.price.currency = this.currency;
    this.price.scale = "EUR";
    
    this.agentDiscount = {};
    this.agentDiscount.currency = this.currency;
    this.agentDiscount.scale = this.scale;
    
    this.firstLocDiscount = {};
    this.firstLocDiscount.currency=this.currency;
    this.firstLocDiscount.scale = this.scale;
    

    this.price.name = model.i18n._getLocaleText("unitListPrice");

    this.agentDiscount.name = model.i18n._getLocaleText("agentDiscount");

    this.firstLocDiscount.name = model.i18n._getLocaleText("firstLocDiscount");
    
    this.secondLocDiscount = {};
    this.secondLocDiscount.currency=this.currency;
    this.secondLocDiscount.scale = this.scale;
    
    this.secondLocDiscount.name = model.i18n._getLocaleText("secondLocDiscount");
    
    this.allegedCommRC = {};
    this.allegedCommRC.name = model.i18n._getLocaleText("allegedCommRC");
    
    this.addTraspRC = {};
    this.addTraspRC.name = model.i18n._getLocaleText("AddTranspRC");
    
    this.addTraspAutomRC = {};
    this.addTraspAutomRC.name = model.i18n._getLocaleText("AddTranspAutomRC");
    
    this.IVA = {};
    this.IVA.name = model.i18n._getLocaleText("IVA");
    
    this.thirdLocDiscount = {};
    this.thirdLocDiscount.currency = this.currency;
    this.thirdLocDiscount.scale = this.scale;
    
    this.thirdLocDiscount.name = model.i18n._getLocaleText("ThirdLocDiscount");
    this.quantity = 0;
    

    var calculateValues = function (quantity) {

      //Maybe it's not needed
      if (quantity)
        this.quantity = quantity;

      if (!this.quantity)
        this.quantity = 0;

      this.price.totValue = parseFloat(this.price.unitVal) * parseInt(this.quantity);
      this.agentDiscount.totValue = this.price.totValue * (parseFloat(this.agentDiscount.unitVal) / 100);
      this.firstLocDiscount.totValue = (this.price.totValue - this.agentDiscount.totValue) * (parseFloat(this.firstLocDiscount.unitVal) / 100);
      this.secondLocDiscount.totValue = (this.price.totValue - this.agentDiscount.totValue - this.firstLocDiscount.totValue) * (parseFloat(this.secondLocDiscount.unitVal) / 100);
      this.thirdLocDiscount.totValue = (this.price.totValue - this.agentDiscount.totValue - this.firstLocDiscount.totValue - this.secondLocDiscount.totValue) * (parseFloat(this.thirdLocDiscount.unitVal) / 100);

    };

    this.initialize = function (position) {

//      this.orderId = orderId;
//      this.positionId = position.positionId;
      this.productId = position.productId;
      this.quantity = position.quantity;
      this.price.unitVal = position.unitListPrice;

      var defer = Q.defer();

      //It will be placed in a corresponding odata File as loadDiscount
      var fSuccess = function (result) {
        var data = {};
        if (result && result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            data = utils.DiscountSerializer.discount.fromSAP(result[i]);
            if (data.productId === this.productId)
              break;
          }
          if (data.productId !== this.productId)
            defer.reject();
          else {
            this.update(data);
            var calculate = _.bind(calculateValues, this);
            calculate();
            defer.resolve(this);
          }
        } else {
          defer.reject();
        }


      };
      fSuccess = _.bind(fSuccess, this);

      var fError = function (err) {
        sap.m.MessageToast.show("Error loading Discount Data");
        defer.reject(err);
      }
      fError = _.bind(fError, this);

      $.getJSON("custom/model/mockData/Discount.json")
        .success(fSuccess)
        .fail(fError);

      return defer.promise;
      //--------------------------------------------------------------------------


    };

    //This model is adapted to conform Discount Dialog
    this.getModel = function () {

      var model = new sap.ui.model.json.JSONModel();

      var values = [];
      values.push(this.price);
      values.push(this.firstLocDiscount);
      values.push(this.secondLocDiscount);
      values.push(this.thirdLocDiscount);
      values.push(this.agentDiscount);
      model.setData({
        "values": values,
        "ref": this
      });


      return model;

    };

    this.refreshModel = function (quantity) {
      var calculate = _.bind(calculateValues, this);
      calculate(quantity);
      return this.getModel();
    };

    this.update = function (data) {
      for (var prop in data) {
        if (_.isObject(this[prop])) {
          _.merge(this[prop], data[prop]);
        } else {
          this[prop] = data[prop];
        }
      }
    };
    //
    if (serializedData) {
      this.update(serializedData);

    }

    return this;
  };
  return DiscountModel;


})();