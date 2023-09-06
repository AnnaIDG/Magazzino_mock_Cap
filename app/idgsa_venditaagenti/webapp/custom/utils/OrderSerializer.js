jQuery.sap.declare("utils.OrderSerializer");

utils.OrderSerializer = {
  /**
   * @memberOf utils.OrderSerializer
   */
  OrdersList: {
    fromSapItems: function (sapItems) {
      var results = [];
      if (sapItems && sapItems.length > 0) {
        for (var i = 0; i < sapItems.length; i++) {
          results.push(this.fromSap(sapItems[i]));
        }
      } else {
        if (sapItems && sapItems.results && sapItems.results.length > 0) {
          for (var i = 0; i < sapItems.results.length; i++) {
            results.push(this.fromSap(sapItems.results[i]));
          }
        }
      }
      return results;
    },

    fromSap: function (sapData) {
      var o = {};
      o.orderId = sapData.Vbeln; // ? sapData.Vbeln : "";
      o.customerId = sapData.Kunnr; // ? sapData.Kunnr : "";
      o.customerName = sapData.Name1; // ? sapData.Name1 : "";
      o.requestedDate = sapData.requestedDate; // ? sapData.requestedDate : "";
      o.deliveryDate = sapData.deliveryDate; // ? sapData.deliveryDate : "";
      o.orderStatus = sapData.orderStatus; // ? sapData.orderStatus : "";

      o.orderDate = sapData.Audat;
      o.orderCreationDate = sapData.Erdat;
      o.society = sapData.BukrsVf;
      o.salesOrg = sapData.Vkorg;
      o.distrCh = sapData.Vtweg;
      o.division = sapData.Spart;
      o.agentCode = sapData.Cdage;
      o.agentName = sapData.Name1Cdage;
      o.customerId = sapData.Kunnr;
      o.customerName = sapData.Name1Kunnr;
      o.orderType = sapData.Auart;
      o.orderTypeDescr = sapData.BezeiAuart;
      o.orderReason = sapData.Augru;
      o.orderReasonDescr = sapData.BezeiAugru;
      o.validDateList = sapData.Erdat;
      o.shippmentDate = ((sapData.Dtcon === null) || (!sapData.Dtcon) || (parseInt(sapData.Dtcon) == 0)) ? "" : sapData.Dtcon;
      o.orderStatus = sapData.Stato;
      o.orderStatusDescr = sapData.StatoDef;
      o.Dtcon = sapData.Dtcon;
      o.rifOrder = sapData.Bstnk;
      o.Bstdk = sapData.Bstdk;

      return o;
    }
  },


};