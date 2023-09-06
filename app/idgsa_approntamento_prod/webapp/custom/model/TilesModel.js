jQuery.sap.declare("model.TilesModel");
model.TilesModel = {
    getTiles: function (role, session) {
        this.model = new sap.ui.model.resource.ResourceModel({
            bundleUrl: "custom/i18n/i18n.properties"
        });
        var tiles = [{
                "icon": "customer-financial-fact-sheet",
                "title": this.model.getProperty("createPackingList"),
                "url": "moveOrderManagement",
                "role": ["OR"],
                "session": [true, false]
        }, {
                "icon": "my-sales-order",
                "title": this.model.getProperty("packingList"),
                "url": "packingList",
                "role": ["OR", "WP4"],
                "number": "3",
                "session": [true, false]
        },
                     {
                "icon": "my-sales-order",
                "title": this.model.getProperty("packingList"),
                "url": "packingListOm",
                "role": ["OM"],
                "number": "3",
                "session": [true, false]
        },
            {
                "icon": "my-sales-order",
                "title": this.model.getProperty("moveOrdersNotYetWorked"),
                "url": "moveOrderNotYetWorked",
                "role": ["WP4"],
                "number": "1",
                "session": [true, false]
        },
            {
                "icon": "my-sales-order",
                "title": this.model.getProperty("mev"),
                "url": "",
                "role": ["WP4"],
                "number": "7",
                "session": [true, false]
        },


            {
                "icon": "eam-work-order",
                "title": this.model.getProperty("workingOrders"),
                "url": "workingOrders",
                "number": "",
                "info": "",
                "infoState": "Success",
                "session": [true, false],
                "role": ["PM", "OP", "OM"],
                "visible": sap.ui.Device.system.desktop || sap.ui.Device.system.phone || sap.ui.Device.system.tablet
            },

            {
                "icon": "log",
                "title": this.model.getProperty("closeCustomerSessionTitle"),
                "url": "launchpad",
                "role": ["AG", "BO"],
                "session": [true]
            }];
        // fitro i tile per il ruolo
        var tileFilteredByRole = _.filter(tiles, function (tile) {
            return _.any(tile.role, function (r) {
                return _.contains(r, role);
            });
        });
        // filtro i tile per session
        var tileFilteredBySession = [];
        for (var i = 0; i < tileFilteredByRole.length; i++) {
            for (var j = 0; j < tileFilteredByRole[i].session.length; j++) {
                if (tileFilteredByRole[i].session[j] === session) {
                    tileFilteredBySession.push(tileFilteredByRole[i]);
                }
            }
        }
        return tileFilteredBySession;
    }
};
