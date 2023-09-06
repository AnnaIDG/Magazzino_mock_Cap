jQuery.sap.declare("utils.OrderDefaultsSerializer");

utils.OrderDefaultsSerializer = {
    /**
     * @memberOf utils.OrderDefaultsSerializer
     */

    OrderDefault: {
        fromSapItems: function (sapItems) {
            var results = [];
            if (sapItems && sapItems.length > 0) {
                for (var i = 0; i < sapItems.length; i++) {
                    results.push(this.fromSap(sapItems[i]));
                }
            }else{
                if (sapItems && sapItems.results && sapItems.results.length > 0) {
                    for (var i = 0; i < sapItems.results.length; i++) {
                        results.push(this.fromSap(sapItems.results[i]));
                    }
                }
            }
            return results;
        },

        fromSap: function (sapData) {
            var c = {};
            c.username = sapData.Uname ? sapData.Uname : "";
            c.userAlias = sapData.Ualias ? sapData.Ualias : "";
            c.society = sapData.Bukrs ? sapData.Bukrs : "";
            c.distributionChannel = sapData.Vtweg ? sapData.Vtweg : "";
            c.division = sapData.Spart ? sapData.Spart : "";
            c.salesOrg = sapData.Vkorg ? sapData.Vkorg : "";
            c.street = sapData.Street ? sapData.Street : "";
            c.numAddr = sapData.HouseNum1 ? sapData.HouseNum1 : "";
            c.postalCode = sapData.PostCode1 ? sapData.PostCode1 : "";
            c.city = sapData.City1 ? sapData.City1 : "";
            c.district = sapData.City2 ? sapData.City2 : "";
            c.country = sapData.Country ? sapData.Country : "";
            c.prov = sapData.Region ? sapData.Region : "";
            c.customer = sapData.KunnrZr ? sapData.KunnrZr : "";
            c.userType = sapData.Ustyp ? sapData.Ustyp : "";
            c.agentCode = sapData.Cdage ? sapData.Cdage : "";
            c.agentName = sapData.CdageName1 ? sapData.CdageName1 : "";
            c.codiceFiscale = sapData.Stcd1 ? sapData.Stcd1 : "";
            c.codiceFiscale2 = sapData.Stcd2 ? sapData.Stcd2 : "";
            c.partitaIVA = sapData.Stceg ? sapData.Stceg : "";
//            c.transportZoneCode = sapData.Lzone ? sapData.Lzone : "";
//            c.transportZone = sapData.LzoneVtext ? sapData.LzoneVtext : ""; 
//            c.salesDistrict = sapData.Bzirk ? sapData.Bzirk : "";
//            c.districtName = sapData.BzirkBztxt ? sapData.BzirkBztxt : "";
//            c.priceGroup = sapData.Konda ? sapData.Konda : "";
//            c.priceGroupDescription = sapData.KondaVtext ? sapData.KondaVtext : "";
//            c.salesOffice = sapData.Vkbur ? sapData.Vkbur : "";
//            c.salesOfficeDescription = sapData.VkburBezei ? sapData.VkburBezei : "";
//            c.salesGroup = sapData.Vkgrp ? sapData.Vkgrp : "";
//            c.salesGroupDescription = sapData.VkgrpBezei ? sapData.VkgrpBezei : "";
//            c.customerGroup = sapData.Kdgrp ? sapData.Kdgrp : "";
//            c.priceList = sapData.Pltyp ? sapData.Pltyp : "";
//            c.note = sapData.NotaZ001 ? sapData.NotaZ001 : "";
            
            //Temp-Mapping to adapt order fields//
            c.orderId = sapData.orderId ? sapData.orderId : undefined;
            c.customerId = sapData.Kunnr ? sapData.Kunnr : "";
            c.customerName = sapData.Name1 ? sapData.Name1 : "";
            //Temp-Mapping to adapt order fields//
            
            c.orderType = sapData.Auart ? sapData.Auart : "";
            c.orderTypeDescr = sapData.AuartBezei ? sapData.AuartBezei : "";
            c.rifOrder = sapData.Bstkd ? sapData.Bstkd : "";
    		c.paymentMethod = sapData.Zterm ? sapData.Zterm : "";
    		c.paymentMethodDescr = sapData.Vtext ? sapData.Vtext : "";
    		c.incoterms1 = sapData.Inco1 ? sapData.Inco1 : "";
    		c.incoterms1Descr = sapData.Inco1Bezei ? sapData.Inco1Bezei : "";
    		c.incoterms2 = sapData.Inco2 ? sapData.Inco2 : "";
            c.shippingType = sapData.Vsbed ? sapData.Vsbed : "";
            c.shippingTypeDescr = sapData.VsbedText ? sapData.VsbedText : "";
    		c.meansShipping = sapData.Vsart ? sapData.Vsart : "";
    		c.meansShippingDescr = sapData.Bezei ? sapData.Bezei : "";


            return c;
        },

        toSAP: {

        }
    }
};
