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
      h.society = sapData.Bukrs;
      h.salesOrg = sapData.Vkorg;
      h.distrCh = sapData.Vtweg;
      h.division = sapData.Spart;
      h.last = sapData.Ultimo;
      h.productId = sapData.Figlio ? sapData.Figlio : "";
      h.salesOrg = sapData.salesOrg ? sapData.salesOrg : "";
      h.distrCh = sapData.distrCh ? sapData.distrCh : "";
      h.division = sapData.division ? sapData.division : "";
      h.description = sapData.Ltext ? sapData.Ltext : "";
      h.parentId = sapData.Padre ? sapData.Padre : "";
      h.level = sapData.Livello ? sapData.Livello : "";
      h.currency = sapData.Currncy ? sapData.Currncy : "";
      h.priceNotFound = sapData.PriceNotFound ? sapData.PriceNotFound : "";
      h.unitListPrice = parseFloat(sapData.Condval) ? parseFloat(sapData.Condval) : 0;
      h.scale = sapData.Meinh ? sapData.Meinh : "";
      h.description = sapData.Ltext ? sapData.Ltext : "";

      return h;

    }
  },


};