jQuery.sap.declare("utils.RequestSerializer");

utils.RequestSerializer = {
    /**
     * @memberOf utils.RequestSerializer
     */
    Requests: {
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
            // for (var prop in sapData) {
            //     if (!sapData.hasOwnProperty(prop))
            //         continue;
            //     customer[prop] = sapData[prop];
            // }
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
            customer.rcType = sapData.Rctyp ? sapData.Rctyp : "";
            customer.isBlocked = customer.isBlocked = (sapData.Isblocked && sapData.Isblocked === 'X') ? true : false;
            customer.agentCode = sapData.Cdage ? sapData.Cdage : "";
            customer.agentName = sapData.CdageName1 ? sapData.CdageName1 : "";
            return customer;
        },
        toSap : function(data)
        {
            var result = {};
            
            result.Uname = data.username;
            result.Bukrs = data.society;
            result.Vkorg = data.salesOrg;
            result.Spart = data.division;
            result.Vtweg = data.distributionChannel;
            result.Vkbur = data.salesOffice;
            result.Cdage = data.agentCode;
            result.Name1 = data.customerName ? data.customerName : "";
            if(data.Kunnr){
            result.Kunnr = data.Kunnr;
            }
            return result;
        }
    },

    RequestDetail: {
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
            c.canChangeSelect = (sapData.Begru === "") ? false : true;
            c = {};
            c.customerId = sapData.Kunnr ? sapData.Kunnr : "";
            c.customerName = sapData.Name1 ? sapData.Name1 : "";
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
            c.rcType = sapData.Rctyp ? sapData.Rctyp : "";
            c.isBlocked = (sapData.Isblocked && sapData.Isblocked === 'X') ? true : false;
            c.Xispa = sapData.Xispa ? sapData.Xispa : "";
            c.agentCode = sapData.Cdage ? sapData.Cdage : "";
            c.agentName = sapData.CdageName1 ? sapData.CdageName1 : "";
            c.codiceFiscale = sapData.Stcd1 ? sapData.Stcd1 : "";
            /*c.codiceFiscale2 = sapData.Stcd2 ? sapData.Stcd2 : "";
            c.partitaIVA = sapData.Stceg ? sapData.Stceg : "";*/
            c.partitaIVA = sapData.Stcd2 ? sapData.Stcd2 : "";
            c.partitaIVAComunitaria = sapData.Stceg ? sapData.Stceg : "";
            c.isPriceViewEnabled = (sapData.Klabc && sapData.Klabc === 'N') ? false : true;
            c.typeOfUser = sapData.typeOfUser ? sapData.typeOfUser : "";
            c.email = sapData.SmtpAddr ? sapData.SmtpAddr : "";
            c.phone = sapData.TelNumber ? sapData.TelNumber : "";
            c.mobile = sapData.MobNumber ? sapData.MobNumber : "";
            c.note = sapData.note ? sapData.note : "";
            return c;
        },
        toSap: function (c) {
            var s = {};
            s.Kunnr = c.registry.id ? c.registry.id : "";
            s.Bukrs = c.registry.society;
            s.Vkorg = c.registry.salesOrg;
            s.Vtweg = c.registry.distributionChannel;
            s.Spart = c.registry.division;
            s.Cdage = c.registry.agentCode;
//            s.Vkbur = c.registry.areaManager;
//            s.Vkgrp = c.registry.territoryManager;
            s.Name1 = c.registry.customerName;
            s.Street = c.registry.street;
            s.HouseNum1 = c.registry.numAddr;
            s.PostCode1 = c.registry.postalCode;
            s.City1 = c.registry.city;
           // s.City2 = c.registry.village;
            s.Country = c.registry.country ? c.registry.country : "";
            s.Region = c.registry.prov;
            s.Stcd1 = c.registry.codiceFiscale;
            s.Stcd2 = c.registry.partitaIVA ? c.registry.partitaIVA.substring(2, c.registry.partitaIVA.length) : c.registry.partitaIVA;
            s.Stceg = c.registry.partitaIVA;
            //s.Katr6 = c.registry.segCode;
            s.TelNumber = c.contact.tel;
            s.MobNumber = c.contact.mobile;
            s.FaxNumber = c.contact.fax;
            s.SmtpAddr = c.contact.email;
            //** banca
            s.Banks = c.bank.bankNation;
            s.Bankl = c.bank.abcab;
            s.Bankn = c.bank.accountNum;
            s.Bkont = c.bank.cin;
            s.Bvtyp = c.bank.Bvtyp;
            s.Iban = c.bank.iban;
            return s;
            }
        }

};
