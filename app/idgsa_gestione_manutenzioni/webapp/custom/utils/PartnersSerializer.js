jQuery.sap.declare("utils.PartnersSerializer");
utils.PartnersSerializer = {
    fromSapItems: function (sapItems) {
        var results = [];
        sapItems = sapItems.results;
        if (sapItems && sapItems.length > 0) {
            for (var i = 0; i < sapItems.length; i++) {
                results.push(this.fromSapItem(sapItems[i]));
            }
        }
        return results;
    }
    , fromSapItem: function (sapItem) {
        var item = {};
        item.user = sapItem.Bname ? sapItem.Bname : "";
        item.addrNumber = sapItem.Addrnumber ? sapItem.Addrnumber : "";
        item.persNumber = sapItem.Persnumber ? sapItem.Persnumber : "";
        item.country = sapItem.Nation ? sapItem.Nation : "";
        item.name = sapItem.NameFirst ? sapItem.NameFirst : "";
        item.surname = sapItem.NameLast ? sapItem.NameLast : "";
        item.nameComplete = sapItem.NameText ?sapItem.NameText : "";
        item.mail = sapItem.SmtpAddr ? sapItem.SmtpAddr  : "";
        item.phone = sapItem.TelNumber ? sapItem.TelNumber : "";
        
        return item;
    }
, };
