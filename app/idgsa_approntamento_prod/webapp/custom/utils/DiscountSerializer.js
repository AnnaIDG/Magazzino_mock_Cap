jQuery.sap.declare("utils.DiscountSerializer");
utils.DiscountSerializer = {
    discount: {
        fromSAPItems: function (s) {
            var l = {
                "results": []
            };
            if (s && s.results && s.results.length > 0) {
                for (var i = 0; i < s.results.length; i++) {
                    l.results.push(this.fromSAP(s.results[i]));
                }
            }
            return l;
        }
        , fromSAP: function (sapData) {
            var d = {};
            d.orderId = sapData.Vbeln;
            //d.positionId=sapData.Posex;
            //d.scale = (sapData.Konwa !== "") ? sapData.Konwa : "%";
            d.currency = sapData.Konwa;
            d.positionId = sapData.Posex;
            d.typeId = sapData.Kschl;
            d.typeDescr = sapData.KschlText;
            d.value = Math.abs(parseFloat(sapData.Kbetr));
            d.unit = sapData.Kmein ? sapData.Kmein : sapData.Konwa;
            d.priceUnit = sapData.Kpein;
            d.editable = (sapData.Edit === "X") ? true : false;
            //d.scale = (sapData.Krech === "A") ? "%" : ((sapData.Krech === "C") ? d.currency : "");
            d.total = sapData.Kwert;
            d.price = Math.abs(parseFloat(sapData.Kwert));
            // d.price.unitVal = sapData.price;
            return d;
        }
        , toSAPItems: function (items) {
            var ret = {
                Items: []
            };
            for (var i = 0; i < items.length; i++) {
                var oItem = this.toSAP(items[i]);
                ret.Items.push(oItem);
            }
            return ret;
        }
        , toSAP: function (sapData) {
            var s = {};
            if (sapData.Vbeln) {
                s.orderId = sapData.Vbeln;
            }
            //s.positionId=sapData.Posex;
            s.Konwa = (sapData.unit !== "%") ? sapData.unit : "";
            s.Posex = sapData.positionId;
            s.Kschl = sapData.typeId;
            s.KschlText = sapData.typeDescr;
            s.Kbetr = (Math.abs(parseFloat(sapData.value))).toString();
            s.Kmein = (sapData.unit === "%") ? sapData.unit : "";
            s.Kpein = sapData.priceUnit;
            s.Krech = sapData.scale;
            s.Kwert = (sapData.price).toString();
            //s.price = Math.abs(parseFloat(sapData.Kwert));
            return s;
        }
    }
}