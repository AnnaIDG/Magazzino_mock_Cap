jQuery.sap.declare("utils.CatalogSerializer");

utils.CatalogSerializer = {
  /**
   * @memberOf utils.CatalogSerializer
   */
  Hierarchy: {
    fromSapItems: function (sapItems) {
      var results = {
        "items": []
      };
      if (sapItems && sapItems.length > 0) {
        for (var i = 0; i < sapItems.length; i++) {
          results.items.push(this.fromSap(sapItems[i]));
        }
      } else {
        if (sapItems && sapItems.results && sapItems.results.length > 0) {
          for (var i = 0; i < sapItems.results.length; i++) {
            results.items.push(this.fromSap(sapItems.results[i]));
          }
        }
      }
      return results;
    },

    fromSap: function (sapData) {

      var h = {};
      h.society = sapData.Bukrs ? sapData.Bukrs : "";
      h.salesOrg = sapData.Vkorg ? sapData.Vkorg : "";
      h.distrCh = sapData.Vtweg ? sapData.Vtweg : "";
      h.division = sapData.Spart ? sapData.Spart : "";
      h.customerId = sapData.Kunnr ? sapData.Kunnr : "";
      h.last = sapData.Ultimo ? sapData.Ultimo : "";
      h.productId = sapData.Figlio ? sapData.Figlio : "";
      h.description = sapData.Ltext ? sapData.Ltext : "";
      h.parentId = sapData.Padre ? sapData.Padre : "";
      h.level = sapData.Livello ? sapData.Livello : "";
      h.Matnr = sapData.Matnr ? sapData.Matnr : "";
      h.matDescription = sapData.Vtext ? sapData.Vtext : "";
      h.matCategory = sapData.Attyp ? sapData.Attyp : "";
      h.currency = sapData.Currncy ? sapData.Currncy : "";
      h.priceNotFound = sapData.PriceNotFound ? sapData.PriceNotFound : "";
      h.unitListPrice = sapData.Condval ? parseFloat(sapData.Condval) : 0;
      h.scale = sapData.Meinh ? sapData.Meinh : "";
      h.promotion = sapData.Promozione ? sapData.Promozione : "";

      return h;

    }
  },


};