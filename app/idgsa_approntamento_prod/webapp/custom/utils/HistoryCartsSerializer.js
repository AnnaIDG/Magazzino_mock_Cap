jQuery.sap.declare("utils.HistoryCartsSerializer");

utils.HistoryCartsSerializer = {
    
   historyCart: {
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
        , fromSAP: function (s) {
            var c = {};
            c.orderId = s.Vbeln;
            c.cartCreationDate = new Date(s.Erdat);
            // c.cartCreationTime = s.Erzet;
            c.username = s.Uname;
            c.favorite = _.isEmpty(s.Xpref) ? false : true;
            c.flag = s.Loekz
            return c;
        }
        , toSAP: function (c) {
            var s = {};
            s.Vbeln = c.orderId;
            s.Xpref = c.favorite ? "X" : "";
            s.Uname = c.username;
            return s;
        }
    }
}

