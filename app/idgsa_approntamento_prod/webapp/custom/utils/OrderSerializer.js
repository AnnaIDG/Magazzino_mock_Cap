jQuery.sap.declare("utils.OrderSerializer");
jQuery.sap.require("utils.DiscountSerializer");
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
            o.orderId = sapData.Vbeln ? sapData.Vbeln : "";
            o.customerId = sapData.Kunnr ? sapData.Kunnr : "";
            o.customerName = sapData.Name1 ? sapData.Name1 : "";

            //date
            o.orderDate = sapData.Audat ? sapData.Audat : "";
            o.orderCreationDate = sapData.Erdat ? sapData.Erdat : "";
            o.validDateList = sapData.Erdat ? sapData.Erdat : null;
            o.shippmentDate = ((sapData.Dtcon === null) || (!sapData.Dtcon) || (parseInt(sapData.Dtcon) == 0)) ? "" : sapData.Dtcon;
            //
            o.society = sapData.BukrsVf ? sapData.BukrsVf : "";
            o.salesOrg = sapData.Vkorg ? sapData.Vkorg : "";
            o.distrCh = sapData.Vtweg ? sapData.Vtweg : "";
            o.division = sapData.Spart ? sapData.Spart : "";
            o.agentCode = sapData.Cdage ? sapData.Cdage : "";
            o.agentName = sapData.Name1Cdage ? sapData.Name1Cdage : "";
            o.customerId = sapData.Kunnr ? sapData.Kunnr : "";
            o.customerName = sapData.Name1Kunnr ? sapData.Name1Kunnr : "";
            o.orderType = sapData.Auart ? sapData.Auart : "";
            o.orderTypeDescr = sapData.AuartBezei ? sapData.AuartBezei : "";
            o.orderReason = sapData.Augru ? sapData.Augru : "";
            o.orderReasonDescr = sapData.AugruBezei ? sapData.AugruBezei : "";
            o.orderStatus = sapData.Stato ? sapData.Stato : "";
            o.orderStatusDescr = sapData.StatoDef ? sapData.StatoDef : "";
            //            o.Dtcon = sapData.Dtcon ? sapData.Dtcon : "";
            o.rifOrder = sapData.Bstnk ? sapData.Bstnk : "";
            o.Bstdk = sapData.Bstdk ? sapData.Bstdk : ""
            o.shippingType = sapData.Vsbed ? sapData.Vsbed : "";
            o.shippingTypeDescr = sapData.VsbedText ? sapData.VsbedText : "";
            o.meansShipping = sapData.Vsart ? sapData.Vsart : "";
            o.meansShippingDescr = sapData.Bezei ? sapData.Bezei : "";
            o.bolle = sapData.Bolle ? sapData.Bolle : "";
            return o;
        }
    },
    orderDetail: {
        fromSap: function (sapData) {
            var o = {};
            //-----------Price Voices-------------------------
            o.netPrice = sapData.Netwr ? parseFloat(sapData.Netwr) : "";
            o.ivaPrice = sapData.Mwsbp ? parseFloat(sapData.Mwsbp) : "";
            o.transportPrice = sapData.SoTranspTot ? parseFloat(sapData.SoTranspTot) : "";
            o.totalPrice = sapData.SoTot ? parseFloat(sapData.SoTot) : "";
            o.currency = sapData.Waerk ? sapData.Waerk : "";
            //------------------------------------------------
            o.orderId = sapData.Vbeln ? sapData.Vbeln : "";
            o.guid = sapData.Guid ? sapData.Guid : "";
            o.rifOrder = sapData.Bstkd ? sapData.Bstkd : "";
            o.salesOrg = sapData.Vkorg ? sapData.Vkorg : "";
            o.society = sapData.Bukrs ? sapData.Bukrs : "";
            o.distrCh = sapData.Vtweg ? sapData.Vtweg : "";
            o.division = sapData.Spart ? sapData.Spart : "";
            o.areaManager = sapData.Vkbur ? sapData.Vkbur : "";
            o.territoryManager = sapData.Vkgrp ? sapData.Vkgrp : "";
            o.customerId = sapData.KunnrAg ? sapData.KunnrAg : "";
            o.customerName = sapData.KunnrAgName ? sapData.KunnrAgName : "";
            o.companyName = sapData.KunnrAgName ? sapData.KunnrAgName : "";
            o.orderType = sapData.Auart ? sapData.Auart : "";
            o.orderTypeDescr = sapData.AuartBezei ? sapData.AuartBezei : "";
            o.destination = sapData.KunnrWe ? sapData.KunnrWe : "";
            o.destinationName = sapData.KunnrWeName ? sapData.KunnrWeName : "";
            o.paymentMethod = sapData.Zlsch ? sapData.Zlsch : "";
            o.paymentMethodDescr = sapData.ZlschText1 ? sapData.ZlschText1 : "";
            o.paymentTerms = sapData.Zterm ? sapData.Zterm : "";
            o.paymentTermsDescr = sapData.ZtermText1 ? sapData.ZtermText1 : "";
            o.incoterms1 = sapData.Inco1 ? sapData.Inco1 : "";
            o.incoterms1Descr = sapData.Inco1Bezei ? sapData.Inco1Bezei : "";
            o.incoterms2 = sapData.Inco2 ? sapData.Inco2 : "";
            o.layout = sapData.LayoutFattura ? sapData.LayoutFattura : "";
            o.layoutDescr = sapData.LayoutFatturaDesc ? sapData.LayoutFatturaDesc : "";
            o.shippingType = sapData.Vsbed ? sapData.Vsbed : "";
            o.shippingTypeDescr = sapData.VsbedText ? sapData.VsbedText : "";
            o.destinationCode = sapData.KunnrWe ? sapData.KunnrWe : "";
            //**
            o.meansShipping = sapData.Vsart ? sapData.Vsart : ""; //sapData.Vsbed;
            o.meansShippingDescr = sapData.VsartBezei ? sapData.VsartBezei : ""; //sapData.VsbedText;    
            //**
            o.transportArea = sapData.Bzirk ? sapData.Bzirk : "";
            o.transportAreaDescr = sapData.BzirkBztxt ? sapData.BzirkBztxt : "";
            o.appointmentToDelivery = sapData.Sdabw ? sapData.Sdabw : "";
            o.appointmentToDeliveryDescr = sapData.SdabwBezei ? sapData.SdabwBezei : "";
            o.IVACode = sapData.Taxk1 ? sapData.Taxk1 : "";
            o.IVACodeDescr = sapData.Taxk1Vtext ? sapData.Taxk1Vtext : "";
            o.promoCode = sapData.Promo ? sapData.Promo : "";
            o.orderReason = sapData.Augru ? sapData.Augru : "";
            o.orderReasonDescr = sapData.AugruBezei ? sapData.AugruBezei : "";
            //**date
            o.requestedDate = sapData.Edatu ? sapData.Edatu : "";
            o.validDateList = sapData.Prsdt ? sapData.Prsdt : "";
            o.ordAcqDate = sapData.Bstdk ? sapData.Bstdk : null;
            //**
            o.destination = {};
            o.destination.city = sapData.WeCity ? sapData.WeCity : "";
            o.destination.country = sapData.WeCountry ? sapData.WeCountry : "";
            o.destination.name = sapData.WeName1 ? sapData.WeName1 : "";
            o.destination.cap = sapData.WePostCode1 ? sapData.WePostCode1 : "";
            o.destination.street = sapData.WeStreet ? sapData.WeStreet : "";
            o.destination.tel = sapData.WeTelnum ? sapData.WeTelnum : "";
            //sapData.KunnrWe;
            o.positions = [];
            if (sapData.SalesOrderItemSet && sapData.SalesOrderItemSet.results) {
                o.positions = utils.OrderSerializer.order_item.fromSAPItems(sapData.SalesOrderItemSet);
            }
            o.notesList = [];
            if (sapData.SalesOrderTextSet && sapData.SalesOrderTextSet.results) {
                o.notesList = utils.OrderSerializer.order_notes.fromSAPItems(sapData.SalesOrderTextSet);
            }
            o.discountArray = [];
            if (sapData.SalesOrderConditionSet && sapData.SalesOrderConditionSet.results) {
                o.discountArray = utils.DiscountSerializer.discount.fromSAPItems(sapData.SalesOrderConditionSet);
            }
            if (o.discountArray && o.discountArray.results[0]) {
                for (var i = 0; i < o.discountArray.results.length; i++) {
                    o.discountArray.results[i].currency = (o.positions && o.positions.items && o.positions.items[0].currency) ? o.positions.items[0].currency : "";
                }
            }
            //utils.DiscountSerializer
            return o;
        }
    },
    order_item: {
        toSAPItems: function (items) {
            var ret = {
                Items: []
            };
            for (var i = 0; i < items.length; i++) {
                var oItem = this.toSap(items[i]);
                ret.Items.push(oItem);
            }
            return ret;
        },
        fromSAPItems: function (results) {
            var ret = {
                items: []
            };
            if (results.hasOwnProperty("results")) {
                var l = results.results.length;
                for (var i = 0; i < l; i++) {
                    var oItem = this.fromSAP(results.results[i]);
                    if (oItem !== undefined) {
                        ret.items.unshift(oItem);
                    }
                }
            }
            return ret;
        },
        fromSAP: function (sapData) {
            var oi = {};
            //oi.orderId = sapData.Vbeln;
            oi.positionId = sapData.Posex;
            oi.quantity = sapData.Kwmeng ? parseInt(sapData.Kwmeng) : 0;
            oi.totalNetPrice = parseFloat(sapData.Netwr);
            oi.totalTaxPrice = parseFloat(sapData.Mwsbp);
            //**
            oi.totalListPriceIVA = (sapData.ItemTot && oi.quantity > 0) ? parseFloat(sapData.ItemTot) / oi.quantity : parseFloat(sapData.ItemTot);
            oi.totalListPriceXpositionIVA = oi.totalListPriceIVA * oi.quantity;
            oi.totalListPriceNET = (sapData.Netwr && oi.quantity > 0) ? parseFloat(sapData.Netwr) / oi.quantity : parseFloat(sapData.Netwr);
            oi.unitListPrice = Math.round((oi.totalListPriceNET) * 100) / 100;
            oi.totalListPriceXpositionNET = oi.totalListPriceNET * oi.quantity;
            oi.totalListPrice = Math.round((oi.totalListPriceXpositionNET) * 100) / 100;
            //**
            oi.totalTransport = sapData.ItemTransp ? parseFloat(sapData.ItemTransp) : 0;
            oi.productId = sapData.Matnr ? sapData.Matnr : "";
            oi.scale = sapData.Vrkme;
            oi.scaleDescr = sapData.Mseht;
            oi.currency = sapData.Waers;
            oi.description = sapData.Maktx;
            oi.shippmentDate = sapData.Edatu ? sapData.Edatu : null;
            oi.isKit = (sapData.Kit == "X");
            oi.definitiveDate = sapData.Fixmg ? sapData.Fixmg : null;
            oi.catPosition = sapData.Pstyv;
            oi.catPositionDescr = sapData.PstyvVtext;
            oi.isGift = (oi.catPosition === "ZOMA") ? "X" : "";

            return oi;
        }
    },
    order_notes: {
        fromSAPItems: function (results) {
            var ret = {
                items: []
            };
            if (results.hasOwnProperty("results")) {
                var l = results.results.length;
                for (var i = 0; i < l; i++) {
                    var oItem = this.fromSAP(results.results[i]);
                    if (oItem !== undefined) {
                        ret.items.push(oItem);
                    }
                }
            }
            return ret;
        },
        fromSAP: function (sapData) {
            var on = {};
            on.id = sapData.TextId;
            on.description = "";
            on.noteValue = sapData.Text;
            return on;
        }
    },
    orderBlocks: {
        fromSAPItems: function (results) {
            var ret = {
                items: []
            };
            if (results.hasOwnProperty("results")) {
                var l = results.results.length;
                for (var i = 0; i < l; i++) {
                    var oItem = this.fromSAP(results.results[i]);
                    if (oItem !== undefined) {
                        ret.items.push(oItem);
                    }
                }
            }
            return ret;
        },
        fromSAP: function (sapData) {
            var on = {};
            on.orderId = sapData.Vbeln;
            on.position = sapData.Posnr;
            on.blockId = sapData.Cdblo;
            on.blockType = sapData.Tipob;
            on.blockDescription = sapData.Descr;
            on.blockerName = sapData.Ernam;
            on.blockDate = sapData.Erdat;
            on.releaserName = sapData.Rlusr;
            on.releaseDate = sapData.Rldat;
            on.releaseTime = sapData.Rltim;
            return on;
        }
    }, //Create Order
    order: {
        toSAP: function (o) {
            var toSapData = {};
            //testata Ordine
            //            toSapData.UpdateFlag = (o.UpdateFlag) ? "U" : "";
            toSapData.Vbeln = o.orderId;
            toSapData.Simula = (o.Simula === "X") ? "X" : "";
            toSapData.Bukrs = o.society;
            toSapData.Vkorg = o.salesOrg;
            toSapData.Vtweg = o.distributionChannel ? o.distributionChannel : o.distrCh;
            toSapData.Spart = o.division;
            toSapData.Auart = o.orderType; //tipo ordine vendita
            //codici agente e cliente e destinazione
            toSapData.KunnrAg = o.customer.customerId; //codice cliente
            toSapData.KunnrWe = o.destinationCode; //codice destinazione
            if (o.customer && o.customer.agent) {
                toSapData.KunnrZr = o.customer.agent;
            } else {
                toSapData.KunnrZr = o.agentCode;
            } //codice agente
            //DATE
            var oggi = new Date();
            var timeZoneOffset = oggi.getTimezoneOffset();
            //** Edatu
            if (o.requestedDate && typeof (o.requestedDate) === "string") {
                var Edatu = new Date(o.requestedDate);
                o.requestedDate = Edatu;
            }
            if (o.requestedDate && typeof (o.requestedDate) === "object") {
                if (o.requestedDate.getHours() === 0 && o.requestedDate.getMinutes() === 0) {
                    //o.requestedDate.setUTCDate(o.requestedDate.getDate());
                    o.requestedDate.setHours((oggi.getHours() - (timeZoneOffset / 60)));
                    o.requestedDate.setMinutes(oggi.getMinutes());
                }
                toSapData.Edatu = o.requestedDate;
            }
            //**
            //** Audat
            if (o.documentDate && typeof (o.documentDate) === "string") {
                var Audat = new Date(o.documentDate);
                o.documentDate = Audat;
            }
            if (o.documentDate && typeof (o.documentDate) === "object") {
                if (o.documentDate.getHours() === 0 && o.documentDate.getMinutes() === 0) {
                    //o.documentDate.setUTCDate(o.documentDate.getDate());
                    o.documentDate.setHours((oggi.getHours() - (timeZoneOffset / 60)));
                    o.documentDate.setMinutes(oggi.getMinutes());
                }
                toSapData.Audat = o.documentDate;
            } else {
                toSapData.Audat = null;
            }
            //**
            //** Prsdt
            if (o.validDateList && typeof (o.validDateList) === "string") {
                var Prsdt = new Date(o.validDateList);
                o.documentDate = Prsdt;
            }
            if (o.validDateList && typeof (o.validDateList) === "object") {
                if (o.validDateList.getHours() === 0 && o.validDateList.getMinutes() === 0) {
                    o.validDateList.setHours((oggi.getHours() - (timeZoneOffset / 60)));
                    o.validDateList.setMinutes(oggi.getMinutes());
                }
                toSapData.Prsdt = o.validDateList;
            } else {
                toSapData.Prsdt = null;
            }
            //**
            //** Bstdk
            if (o.ordAcqDate && typeof (o.ordAcqDate) === "string") {
                var Bstdk = new Date(o.ordAcqDate);
                o.ordAcqDate = Bstdk;
            }
            if (o.ordAcqDate && typeof (o.ordAcqDate) === "object") {

                if (o.ordAcqDate.getHours() === 0 && o.ordAcqDate.getMinutes() === 0) {
                    o.ordAcqDate.setHours((oggi.getHours() - (timeZoneOffset / 60)));
                    o.ordAcqDate.setMinutes(oggi.getMinutes());
                }
                toSapData.Bstdk = o.ordAcqDate;
            } else {
                toSapData.Bstdk = null;
            }
            //**
            toSapData.Bstkd = o.rifOrder;
            toSapData.Zterm = o.paymentMethod;
            toSapData.Inco1 = o.incoterms1;
            toSapData.Inco2 = o.incoterms2;
            toSapData.Vsart = o.meansShipping;
            toSapData.Taxk1 = "1";
            //righe d'ordine
            var SalesOrderItemSet = [];
            var SalesOrderConditionSet = [];
            if (o.productsList && (o.productsList).length > 0) {
                for (var i = 0; i < (o.productsList).length; i++) {
                    var pos = o.productsList[i];
                    var SalesOrderItem = utils.OrderSerializer.order_item_simulation.toSap(pos);
                    SalesOrderItem.Vbeln = toSapData.Vbeln;
                    SalesOrderItemSet.push(SalesOrderItem);
                }
            
                    //** condizioni sconti vuote
                    if (!o.discountArray) {
                        var p = {}
                        SalesOrderConditionSet.push(p);
                    } else {
                        var discounts = [];

                        if (o.discountArray && o.discountArray.results) {
                            var discountsA = o.discountArray.results;
                        } else if (o.discountArray && !o.discountArray.results) {
                            var discountsA = o.discountArray
                        }
                        for (var j = 0; j < discountsA.length; j++) {
                            var SalesOrderCondition = {};
                            var c = utils.DiscountSerializer.discount.toSAP(discountsA[j]);
                            SalesOrderConditionSet.push(c);
                        }
                        
                    }

                }
            
            //------------------------------------------------------------------------------------------------------------
            var SalesOrderTextSet = [];
            if (o.notesList && o.notesList.items && o.notesList.items.length > 0) {
                for (var i = 0; i < o.notesList.items.length; i++) {
                    var SalesOrderText = {};
                    var n = o.notesList.items[i];
                    SalesOrderText.Vbeln = "";
                    SalesOrderText.Posex = "000000";
                    SalesOrderText.Text = n.noteValue;
                    SalesOrderText.TextId = n.id;
                    //                    SalesOrderText.UpdateFlag = n.UpdateFlag ? n.UpdateFlag : "";
                    SalesOrderTextSet.push(SalesOrderText);
                }
            }
            toSapData.SalesOrderTextSet = SalesOrderTextSet;
            toSapData.SalesOrderItemSet = SalesOrderItemSet;
            toSapData.SalesOrderConditionSet = SalesOrderConditionSet;
            return toSapData;
        }
    },
    SimulatedOrder: {
        fromSap: function (sapData) {
            var o = {};
            if (sapData.SalesOrderItemSet && sapData.SalesOrderItemSet.results) {
                o.positions = utils.OrderSerializer.order_item_simulation.fromSapItems(sapData.SalesOrderItemSet);
            }
            o.discountArray = [];
            if (sapData.SalesOrderConditionSet && sapData.SalesOrderConditionSet.results && sapData.SalesOrderConditionSet.results.length > 0) {
                for (var i = 0; i < sapData.SalesOrderConditionSet.results.length; i++) {
                    var d = sapData.SalesOrderConditionSet.results[i];
                    o.discountArray.push(utils.DiscountSerializer.discount.fromSAP(d));
                }
            }
            o.notesList = [];
            if (sapData.SalesOrderTextSet && sapData.SalesOrderTextSet.results) {
                o.notesList = utils.OrderSerializer.order_notes.fromSAPItems(sapData.SalesOrderTextSet);
            }
            o.totaleNetto = sapData.Netwr ? sapData.Netwr : "0";
            o.totaleConTasse = sapData.SoTot ? sapData.SoTot : "0";
            o.currency = sapData.Waerk ? sapData.Waerk : "";
            return o;
        }
    },
    order_item_simulation: {
        fromSapItems: function (results) {
            var ret = {
                items: []
            };
            if (results.hasOwnProperty("results")) {
                var l = results.results.length;
                for (var i = 0; i < l; i++) {
                    var oItem = this.fromSap(results.results[i]);
                    if (oItem !== undefined) {
                        ret.items.push(oItem);
                    }
                }
            }
            return ret;
        },
        fromSap: function (sapData) {
            var o = {};
            o.currency = sapData.Waers;
            o.productId = sapData.Matnr
            o.quantity = parseInt(sapData.Kwmeng);
            o.positionId = sapData.Posex;
            //            o.UpdateFlag = sapData.UpdateFlag ? sapData.UpdateFlag : "";
            o.totalListPrice = Math.round(sapData.Netwr * 100) / 100;
            o.unitListPrice = Math.round((o.totalListPrice / o.quantity) * 100) / 100;
            o.isGift = (sapData.Omaggio === "X") ? true : false;
            return o;
        },
        toSap: function (sapData) {
            var item = {};
            item.Vbeln = "";
            //            item.UpdateFlag = sapData.UpdateFlag;
            item.Posex = (parseInt(sapData.positionId)).toString();
            item.Matnr = sapData.productId;
            item.Kwmeng = (sapData.quantity).toString();
            item.Vrkme = sapData.scale;
            item.Omaggio = (sapData.isGift && (sapData.isGift === 'X' || sapData.isGift === true)) ? 'X' : "";
            return item;
        }
    },
    order_deliveryList: {
        fromSapItems: function (results) {
            var ret = {
                items: []
            };
            if (results.hasOwnProperty("results")) {
                var l = results.results.length;
                for (var i = 0; i < l; i++) {
                    var oItem = this.fromSAP(results.results[i]);
                    if (oItem !== undefined) {
                        ret.items.push(oItem);
                    }
                }
            }
            return ret;
        },
        fromSAP: function (sapData) {
            var odl = {};
            odl.orderId = sapData.VbelnSo;
            odl.deliveryId = sapData.Vbeln;
            odl.numBolla = sapData.Xabln ? sapData.Xabln : "";
            odl.type = sapData.VbtypN;
            odl.deliveryStatusId = sapData.Stcon ? sapData.Stcon : " ";
            odl.deliveryStatus = sapData.Stcont ? sapData.Stcont : " ";
            odl.deliveryDate = sapData.WadatIst ? sapData.WadatIst : null;
            odl.documentDate = sapData.Lfdat ? sapData.Lfdat : null;
            return odl;
        }
    }
};
