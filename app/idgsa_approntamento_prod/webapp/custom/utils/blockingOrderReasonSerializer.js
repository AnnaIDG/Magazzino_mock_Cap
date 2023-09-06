jQuery.sap.declare("utils.blockingOrderReasonSerializer");

utils.blockingOrderReasonSerializer = {
blockingOrderReason: {
        fromSap: function (sapData) {
            var b = {};
            b.orderId = sapData.Vbeln ? sapData.Vbeln : "";
            b.position = sapData.Posnr ? sapData.Posnr : "";
            b.blockCode = sapData.Cdblo ? sapData.Cdblo : "";
            b.blockType = sapData.Tipob ? sapData.Tipob : "";
            b.blockDescription = sapData.Descr ? sapData.Descr : "";
            b.blockerName = sapData.Ernam ? sapData.Ernam : "";
            b.blockDate = sapData.Erdat ? sapData.Erdat : "";
//            b.releaserName = sapData.Rlusr ? sapData.Rlusr : "";
//            b.releaseDate = sapData.Rldat ? sapData.Rldat : "";
//            if (sapData.Rltim && sapData.Rltim.ms) {
//                b.releaseTime = sapData.Rltim.ms;
//            }
//            else {
//                b.releaseTime = "";
//            }
            return b;
        }
        , toSap: function (p) {
            var toSapData = {};
            return toSapData;
        }
    }
};