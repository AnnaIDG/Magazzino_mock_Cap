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
//            c.customerId = sapData.Kunnr ? sapData.Kunnr : "";
//            c.customerName = sapData.Name1 ? sapData.Name1 : "";
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
            c.transportZoneCode = sapData.Lzone ? sapData.Lzone : "";
            c.transportZone = sapData.LzoneVtext ? sapData.LzoneVtext : ""; 
            c.paymentTerms = sapData.Zterm ? sapData.Zterm : "";
            c.ownPaymentTerms = sapData.ZtermText1 ? sapData.ZtermText1 : "";
            c.paymentMethods = sapData.Zwels ? sapData.Zwels : "";
            c.paymentMethodsText = sapData.ZwelsText1 ? sapData.ZwelsText1 : "";
            c.salesDistrict = sapData.Bzirk ? sapData.Bzirk : "";
            c.districtName = sapData.BzirkBztxt ? sapData.BzirkBztxt : "";
            c.priceGroup = sapData.Konda ? sapData.Konda : "";
            c.priceGroupDescription = sapData.KondaVtext ? sapData.KondaVtext : "";
            c.salesOffice = sapData.Vkbur ? sapData.Vkbur : "";
            c.salesOfficeDescription = sapData.VkburBezei ? sapData.VkburBezei : "";
            c.salesGroup = sapData.Vkgrp ? sapData.Vkgrp : "";
            c.salesGroupDescription = sapData.VkgrpBezei ? sapData.VkgrpBezei : "";
            c.customerGroup = sapData.Kdgrp ? sapData.Kdgrp : "";
            c.priceList = sapData.Pltyp ? sapData.Pltyp : "";
            c.incoterms = sapData.Inco1 ? sapData.Inco1 : "";
            c.incotermsDescription = sapData.Inco1Bezei ? sapData.Inco1Bezei : "";
            c.incoterms2 = sapData.Inco2 ? sapData.Inco2 : "";
            c.paymentConditions = sapData.ZtermArea ? sapData.ZtermArea : "";
            c.paymentConditionsText = sapData.ZtermAreaText1 ? sapData.ZtermAreaText1 : "";
            c.note = sapData.NotaZ001 ? sapData.NotaZ001 : "";
            c.bankCountry = sapData.Banks ? sapData.Banks : "";
            c.bankNumber = sapData.Bankl ? sapData.Bankl : "";
            c.bankName = sapData.Banka ? sapData.Banka : "";
            c.bankAccount = sapData.Bankn ? sapData.Bankn : "";
            c.controlKey = sapData.Bkont ? sapData.Bkont : "";
            c.iban = sapData.Iban ? sapData.Iban : "";
            c.tel = sapData.TelNumber ? sapData.TelNumber : "";
            c.mobile = sapData.MobNumber ? sapData.MobNumber : "";
            c.email = sapData.SmtpAddr ? sapData.SmtpAddr : "";
            c.fax = sapData.FaxNumber ? sapData.FaxNumber : "";
            c.address = sapData.Adrnr ? sapData.Adrnr : "";
            c.invoicingDate = sapData.Perfk ? sapData.Perfk : "";
            c.rcType = sapData.Rctyp ? sapData.Rctyp : "";
            c.isBlocked = sapData.Isblocked ? sapData.Isblocked : "";
            c.Xispa = sapData.Xispa ? sapData.Xispa : "";
            c.Xanag = sapData.Xanag ? sapData.Xanag : "";
            c.Xcont = sapData.Xcont ? sapData.Xcont : "";
            c.Xbank = sapData.Xbank ? sapData.Xbank : "";
            c.Xvend = sapData.Xvend ? sapData.Xvend : "";
            
            //Temp-Mapping to adapt order fields//
            c.orderId = sapData.orderId ? sapData.orderId : undefined;
            c.customerId = sapData.Kunnr ? sapData.Kunnr : "";
            c.customerName = sapData.Name1 ? sapData.Name1 : "";
            c.paymentMethod = sapData.Zwels ? sapData.Zwels : "";
            c.paymentCondition = sapData.Zterm ? sapData.Zterm : "";
            c.chargeTrasport = sapData.transportZoneCode ? sapData.transportZoneCode : "";
            c.IVACode = sapData.Stceg ? sapData.Stceg : "";
            c.docType = sapData.docType ? sapData.docType : "";
            c.nrDocCliente = sapData.nrDocCliente ? sapData.nrDocCliente : "";
            c.modConsegna = sapData.modConsegna ? sapData.modConsegna : "";
            //Temp-Mapping to adapt order fields//

            return c;
        },

        toSAP: {

        }
    }
};
