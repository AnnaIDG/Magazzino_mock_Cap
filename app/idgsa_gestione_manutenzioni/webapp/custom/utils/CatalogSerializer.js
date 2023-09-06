jQuery.sap.declare("utils.CatalogSerializer");
utils.CatalogSerializer = {
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
        item.techPlace = sapItem.FunctLoc ? sapItem.FunctLoc : "";
        item.equipment = sapItem.Equipment ? sapItem.Equipment : "";
        item.noticeTypeId = sapItem.NotifyType;
        item.catType = sapItem.CatType;
        item.catTypeDescr = sapItem.CatTypeTxt;
        item.codeGruppe = sapItem.Codegruppe;
        item.codeGruppeDescr = sapItem.CodegruppeText;
        item.codeErr = sapItem.Code +" - " + sapItem.Codegruppe;
        item.id = sapItem.Code;
        item.codeErrDescr = sapItem.CodeText;
        return item;
    }
, };
