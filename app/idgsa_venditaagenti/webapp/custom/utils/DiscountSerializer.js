jQuery.sap.declare("utils.DiscountSerializer");

utils.DiscountSerializer = {

discount:
  {
    fromSAP:function(sapData)
    {
      var d = {};
      d.productId = sapData.productId;
      
      d.agentDiscount = {};
      d.agentDiscount.unitVal = sapData.agentDiscount;
      d.firstLocDiscount = {};
      d.firstLocDiscount.unitVal = sapData.firstLocDiscount;
      d.secondLocDiscount={};
      d.secondLocDiscount.unitVal = sapData.secondLocDiscount;
      d.allegedCommRC={};
      d.allegedCommRC.unitVal = sapData.allegedCommRC;
      d.addTraspRC={};
      d.addTraspRC.unitVal = sapData.addTraspRC;
      d.addTraspAutomRC={};
      d.addTraspAutomRC.unitVal = sapData.addTraspAutomRC;
      d.IVA={};
      d.IVA.unitVal = sapData.IVA;
      d.thirdLocDiscount={};
      d.thirdLocDiscount.unitVal = sapData.thirdLocDiscount;
      d.currency = sapData.currency;
      return d;
    }

  },

    toSAP: {

    }
};
