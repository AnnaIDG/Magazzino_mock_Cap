jQuery.sap.declare("utils.CustomerSerializer");

utils.CustomerSerializer = {
    /**
     * @memberOf utils.CustomerSerializer
     */
    Customers: {
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
            var customer = {};
            customer.customerId = sapData.Kunnr ? sapData.Kunnr : "";
            customer.customerName = sapData.Name1 ? sapData.Name1 : "";
            customer.username = sapData.Uname ? sapData.Uname : "";
            customer.userAlias = sapData.Ualias ? sapData.Ualias : "";
            customer.society = sapData.Bukrs ? sapData.Bukrs : "";
            customer.distributionChannel = sapData.Vtweg ? sapData.Vtweg : "";
            customer.division = sapData.Spart ? sapData.Spart : "";
            customer.salesOrg = sapData.Vkorg ? sapData.Vkorg : "";
            customer.salesOffice = sapData.Vkbur ? sapData.Vkbur : "";
            customer.salesGroup = sapData.Vkgrp ? sapData.Vkgrp : "";
            customer.street = sapData.Stras ? sapData.Stras : "";
            customer.postalCode = sapData.Pstlz ? sapData.Pstlz : "";
            customer.country = sapData.Land1 ? sapData.Land1 : "";
            customer.city = sapData.Ort01 ? sapData.Ort01 : "";
            customer.prov = sapData.Regio ? sapData.Regio : "";
            customer.userType = sapData.Ustyp ? sapData.Ustyp : "";
            customer.rcType = sapData.Rctyp ? sapData.Rctyp : ""
            if(!!sapData.Isblocked && sapData.Isblocked ==="X"){
                customer.isBlocked = true;
            }else{
                customer.isBlocked = false;
            }
            customer.agentCode = sapData.Cdage ? sapData.Cdage : "";
            customer.agentName = sapData.CdageName1 ? sapData.CdageName1 : "";
            return customer;
        }
    },

    Customer: {
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
            c.registry = {};
            c.registry.customerId = sapData.Kunnr ? sapData.Kunnr : "";
            c.registry.customerName = sapData.Name1 ? sapData.Name1 : "";
            c.registry.username = sapData.Uname ? sapData.Uname : "";
            c.registry.userAlias = sapData.Ualias ? sapData.Ualias : "";
            c.registry.society = sapData.Bukrs ? sapData.Bukrs : "";
            c.registry.distributionChannel = sapData.Vtweg ? sapData.Vtweg : "";
            c.registry.division = sapData.Spart ? sapData.Spart : "";
            c.registry.salesOrg = sapData.Vkorg ? sapData.Vkorg : "";
            c.registry.street = sapData.Street ? sapData.Street : "";
            c.registry.numAddr = sapData.HouseNum1 ? sapData.HouseNum1 : "";
            c.registry.postalCode = sapData.PostCode1 ? sapData.PostCode1 : "";
            c.registry.city = sapData.City1 ? sapData.City1 : "";
            c.registry.district = sapData.City2 ? sapData.City2 : "";
            c.registry.country = sapData.Country ? sapData.Country : "";
            c.registry.prov = sapData.Region ? sapData.Region : "";
            c.registry.customer = sapData.KunnrZr ? sapData.KunnrZr : "";
            c.registry.userType = sapData.Ustyp ? sapData.Ustyp : "";
            c.registry.rcType = sapData.Rctyp ? sapData.Rctyp : "";
            if(!!sapData.Isblocked && sapData.Isblocked === "X"){
                c.registry.isBlocked = true;
            }else{
                c.registry.isBlocked = false;
            }
//            c.registry.isBlocked = sapData.Isblocked ? sapData.Isblocked : "";
            c.registry.Xispa = sapData.Xispa ? sapData.Xispa : "";
            c.registry.agentCode = sapData.Cdage ? sapData.Cdage : "";
            c.registry.agentName = sapData.CdageName1 ? sapData.CdageName1 : "";
            c.registry.codiceFiscale = sapData.Stcd1 ? sapData.Stcd1 : "";
            c.registry.codiceFiscale2 = sapData.Stcd2 ? sapData.Stcd2 : "";
            c.registry.partitaIVA = sapData.Stceg ? sapData.Stceg : "";
            c.registry.discountGroup = sapData.discountGroup ? sapData.discountGroup : "";
            c.sales = {};
            c.sales.transportZoneCode = sapData.Lzone ? sapData.Lzone : "";
            c.sales.transportZone = sapData.LzoneVtext ? sapData.LzoneVtext : ""; 
            c.sales.zoneCode = sapData.zoneCode ? sapData.zoneCode : ""; 
            c.sales.macroZone = sapData.macroZone ? sapData.macroZone : ""; 
            c.sales.zone = sapData.zone ? sapData.zone : ""; 
            c.sales.modConsegna = sapData.modConsegna ? sapData.modConsegna : ""; 
            c.sales.modConsegnaDesc = sapData.modConsegnaDesc ? sapData.modConsegnaDesc : ""; 
            c.sales.listino = sapData.listino ? sapData.listino : ""; 
            c.sales.sconto1 = sapData.sconto1 ? sapData.sconto1 : ""; 
            c.sales.sconto2 = sapData.sconto2 ? sapData.sconto2 : ""; 
            c.sales.paymentTerms = sapData.Zterm ? sapData.Zterm : "";
            c.sales.ownPaymentTerms = sapData.ZtermText1 ? sapData.ZtermText1 : "";
            c.sales.paymentMethods = sapData.Zwels ? sapData.Zwels : "";
            c.sales.paymentMethodsText = sapData.ZwelsText1 ? sapData.ZwelsText1 : "";
            c.sales.salesDistrict = sapData.Bzirk ? sapData.Bzirk : "";
            c.sales.districtName = sapData.BzirkBztxt ? sapData.BzirkBztxt : "";
            c.sales.priceGroup = sapData.Konda ? sapData.Konda : "";
            c.sales.priceGroupDescription = sapData.KondaVtext ? sapData.KondaVtext : "";
            c.sales.salesOffice = sapData.Vkbur ? sapData.Vkbur : "";
            c.sales.salesOfficeDescription = sapData.VkburBezei ? sapData.VkburBezei : "";
            c.sales.salesGroup = sapData.Vkgrp ? sapData.Vkgrp : "";
            c.sales.salesGroupDescription = sapData.VkgrpBezei ? sapData.VkgrpBezei : "";
            c.sales.customerGroup = sapData.Kdgrp ? sapData.Kdgrp : "";
            c.sales.priceList = sapData.Pltyp ? sapData.Pltyp : "";
            c.sales.incoterms = sapData.Inco1 ? sapData.Inco1 : "";
            c.sales.incotermsDescription = sapData.Inco1Bezei ? sapData.Inco1Bezei : "";
            c.sales.incoterms2 = sapData.Inco2 ? sapData.Inco2 : "";
            c.sales.paymentConditions = sapData.ZtermArea ? sapData.ZtermArea : "";
            c.sales.paymentConditionsText = sapData.ZtermAreaText1 ? sapData.ZtermAreaText1 : "";
            c.sales.note = sapData.NotaZ001 ? sapData.NotaZ001 : "";
            c.bank = {};
            c.bank.bankCountry = sapData.Banks ? sapData.Banks : "";
            c.bank.bankNumber = sapData.Bankl ? sapData.Bankl : "";
            c.bank.bankName = sapData.Banka ? sapData.Banka : "";
            c.bank.bankAccount = sapData.Bankn ? sapData.Bankn : "";
            c.bank.controlKey = sapData.Bkont ? sapData.Bkont : "";
            c.bank.iban = sapData.Iban ? sapData.Iban : "";
            c.contact = {};
            c.contact.tel = sapData.TelNumber ? sapData.TelNumber : "";
            c.contact.mobile = sapData.MobNumber ? sapData.MobNumber : "";
            c.contact.email = sapData.SmtpAddr ? sapData.SmtpAddr : "";
            c.contact.fax = sapData.FaxNumber ? sapData.FaxNumber : "";
            c.registry.address = sapData.Adrnr ? sapData.Adrnr : "";
            /* poi bisognerà cambiare il nome proveniente da sap dei seguenti 3 campi */
            c.registry.shipped = sapData.shipped ? sapData.shipped : "";
            c.registry.inShipping = sapData.inShipping ? sapData.inShipping : "";
            c.registry.inOrder = sapData.inOrder ? sapData.inOrder : "";
            
            c.sales.priceListType = sapData.priceListType;
            c.sales.priceListTypeDescr = sapData.priceListTypeDescr;
            
            return c;
        },

        toSAP: {

        }
    }
};
