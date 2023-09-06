jQuery.sap.declare("utils.NetworkSerializer");
//

utils.NetworkSerializer = {
    /**
     * @memberOf utils.NoticeSerializer
     * @param sapItems
     * @returns {Array}
     */
    fromSapItems: function (sapItems) {
        var results = [];
        if (sapItems && sapItems.length > 0) {
            for (var i = 0; i < sapItems.length; i++) {
                //results.push(this.fromSapItem(sapItems[i]));
                results.push(this.fromSap(sapItems[i]));
            }
        }
        return results;
    }
    , fromSap: function (s) {
        var n = {};
        n.statusSchema = s && s.StatusProfile ? s.StatusProfile : "";
        n.sapStatus = s && s.UserStatus ? s.UserStatus :"";
        n.userStatus = s && s.UserStatusCode ? s.UserStatusCode : "";
        n.userStatusDesc = s && s.UserStatusDesc ? s.UserStatusDesc : "";
        n.initialStatus = s && s.InitialStatus ? s.InitialStatus : "";
        n.statusNum = s && s.StatusNumber ? s.StatusNumber : "";
        n.nextStatusNumber = s && s.HigestNumber ? s.HigestNumber : "";
        n.prevStatusNumber = s && s.LowestNumber ? s.LowestNumber : "";
        n.position = s && s.StatusPosition ? s.StatusPosition : "";
        n.priority = s && s.StatusPriority ? s.StatusPriority :"";
        n.auth = s && s.StatusAuthorization ? s.StatusAuthorization : "";
        return n;

    }
};
