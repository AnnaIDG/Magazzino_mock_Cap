jQuery.sap.declare("utils.MoveOrderSerializer");

utils.MoveOrderSerializer = {
    /**
     * @memberOf utils.MoveOrderSerializer
     */
    MoveOrders: {
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
            var moveOrder = {};
            moveOrder.moveOrderId = sapData.moveOrderId ? sapData.moveOrderId : "";
            moveOrder.moveOrderName = sapData.Name1 ? sapData.Name1 : "";
            moveOrder.username = sapData.Uname ? sapData.Uname : "";
            moveOrder.userAlias = sapData.Ualias ? sapData.Ualias : "";
            moveOrder.orderStatus = sapData.orderStatus ? sapData.orderStatus : "";
            moveOrder.availableDate = sapData.availableDate ? sapData.availableDate : "";
            moveOrder.agentCode = sapData.Cdage ? sapData.Cdage : "";
            moveOrder.agentName = sapData.CdageName1 ? sapData.CdageName1 : "";
            return moveOrder;
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
            result.Name1 = data.moveOrderName ? data.moveOrderName : "";
            if(data.Kunnr){
            result.Kunnr = data.Kunnr;
            }
            return result;
        }
    },

    MoveOrderDetail: {
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
            c.registry = {};
            c.registry.moveOrderId = sapData.moveOrderId ? sapData.moveOrderId : "";
            c.registry.moveOrderName = sapData.Name1 ? sapData.Name1 : "";
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
            c.registry.moveOrder = sapData.KunnrZr ? sapData.KunnrZr : "";
            c.registry.userType = sapData.Ustyp ? sapData.Ustyp : "";
            c.registry.rcType = sapData.Rctyp ? sapData.Rctyp : "";
            c.registry.isBlocked = (sapData.Isblocked && sapData.Isblocked === 'X') ? true : false;
            c.registry.Xispa = sapData.Xispa ? sapData.Xispa : "";
            c.registry.agentCode = sapData.Cdage ? sapData.Cdage : "";
            c.registry.agentName = sapData.CdageName1 ? sapData.CdageName1 : "";
            c.registry.codiceFiscale = sapData.Stcd1 ? sapData.Stcd1 : "";
            /*c.registry.codiceFiscale2 = sapData.Stcd2 ? sapData.Stcd2 : "";
            c.registry.partitaIVA = sapData.Stceg ? sapData.Stceg : "";*/
            c.registry.partitaIVA = sapData.Stcd2 ? sapData.Stcd2 : "";
            c.registry.partitaIVAComunitaria = sapData.Stceg ? sapData.Stceg : "";
            c.registry.isPriceViewEnabled = (sapData.Klabc && sapData.Klabc === 'N') ? false : true;
            c.sales = {};
            c.sales.transportZoneCode = sapData.Lzone ? sapData.Lzone : "";
            c.sales.transportZone = sapData.LzoneVtext ? sapData.LzoneVtext : ""; 
            c.sales.meansShippingCode = sapData.Msped ? sapData.Msped : ""; 
            c.sales.meansShipping = sapData.MspedName1 ? sapData.MspedName1 : ""; 
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
            c.sales.moveOrderGroupCode = sapData.Kdgrp ? sapData.Kdgrp : "";
            c.sales.moveOrderGroup = sapData.KdgrpKtext ? sapData.KdgrpKtext : "";
            c.sales.priceList = sapData.Pltyp ? sapData.Pltyp : "";
            c.sales.incoterms1 = sapData.Inco1 ? sapData.Inco1 : "";
            c.sales.incoterms1Description = sapData.Inco1Bezei ? sapData.Inco1Bezei : "";
            c.sales.incoterms2 = sapData.Inco2 ? sapData.Inco2 : "";
            c.sales.paymentConditions = sapData.ZtermArea ? sapData.ZtermArea : "";
            c.sales.paymentConditionsText = sapData.ZtermAreaText1 ? sapData.ZtermAreaText1 : "";
            c.sales.note = sapData.NotaZ001 ? sapData.NotaZ001 : "";
            c.sales.balance = sapData.Saldo ? sapData.Saldo : "";
            c.sales.ordered = sapData.Ordinato ? parseInt(sapData.Ordinato) : "";
            c.sales.shipped = sapData.Spedito ? parseInt(sapData.Spedito) : "";
            c.sales.inShipping = sapData.Inspedizione ? parseInt(sapData.Inspedizione) : "";
            c.sales.shippingType = sapData.Vsbed ? sapData.Vsbed : "";
            c.sales.shippingTypeDescr = sapData.VsbedVtext ? sapData.VsbedVtext : "";
            
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
            s.Name1 = c.registry.moveOrderName;
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
            //**
            
            //** parte info vendite Riello
//            s.Kdgrp = c.sales.clientType;
//            s.Zterm = c.sales.paymentCond; //maybe c.sales.paymentCond2
//            s.ZtermArea = c.sales.paymentCond;
//            s.Zwels = c.sales.billType;
//            s.Bzirk = c.sales.carrier;
//            s.Inco1 = c.sales.resa;
//            s.Inco2 = c.sales.incoterms2;
//            s.Perfk = c.sales.billFreq;
//            s.NotaZ001 = c.sales.notes;
            
            //s.Xispa = c.registry.isPublicAdministration ? "X" : "";
//            s.Zsl3Age="0";
//            s.Zsl3NoteAge="";
            
//            if(c.moveOrderDiscountConditions && c.moveOrderDiscountConditions.length > 0)
//            {
//            	var zsl3Cond = _.find(c.moveOrderDiscountConditions, {
//                    typeId: "ZSL3"
//                });
//            	if(zsl3Cond && zsl3Cond.value)
//            		s.Zsl3Age= zsl3Cond.value.toString();
//            	if(zsl3Cond && zsl3Cond.note)
//            		s.Zsl3NoteAge=zsl3Cond.note;
//            }
            return s;
            }
        },

       
    
    moveOrderStatus: {
        fromSAP: function (sapData) {
            var cs = {};
            cs.moveOrderId = sapData.MKunnr ? sapData.MKunnr : "";
            cs.society = sapData.MBukrs ? sapData.MBukrs : "";
            cs.creditPercentage = sapData.MKlprz ? parseFloat(sapData.MKlprz) : 0.00; //fido
            return cs;
        }
    }

};
