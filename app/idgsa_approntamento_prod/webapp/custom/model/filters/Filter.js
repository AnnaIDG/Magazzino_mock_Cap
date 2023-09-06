jQuery.sap.declare("model.filters.Filter");
jQuery.sap.require("utils.ObjectUtils");
jQuery.sap.require("utils.Formatter");
jQuery.sap.require("model.i18n");
model.filters.Filter = {
    checkFilterExistence: function (collection) {
        return (this.filterData && this.filterData[collection] && this.filterData[collection].items && this.filterData[collection].items.length > 0);
    }
    , deleteFilter: function (collection) {
        this.filterData[collection] = undefined;
    }
    , resetFilter: function (collection) {
        var selectedItems = this.getSelectedItems(collection);
        if (selectedItems) {
            for (var i = 0; i < selectedItems.length; i++) {
                selectedItems[i].isSelected = false;
            }
        }
        return;
    }
    , getFilterData: function (collection) {
        if (!this.checkFilterExistence(collection)) return null;
        return this.filterData[collection];
    }
    , getSelectedItems: function (collection) {
        var filterItems = [];
        if (!this.checkFilterExistence(collection)) {
            return null;
        }
        var items = this.filterData[collection].items;
        for (var i = 0; i < items.length; i++) {
            for (var j = 0; j < items[i].values.length; j++) {
                if (items[i].values[j].isSelected) {
                    filterItems.push(items[i].values[j]);
                }
            }
        }
        return filterItems;
    }
    , getModel: function (list, collection) {
        if (!list || list.length == 0) return;
        // ------------------------Maybe to comment
        // ---------------------------------------------------
        if (!this.checkFilterExistence(collection)) {
            this.filterData = {};
            this.filterData[collection] = {
                "items": []
            };
            // this.props[collection] = [];
        }
        // -------------------------------------------------------------------------------------------------
        _.forEach(list, _.bind(function (item) {
            var itemProps = utils.ObjectUtils.getKeys(item);
            if (!itemProps || itemProps.length == 0) return;
            _.forEach(itemProps, _.bind(function (collection, prop) {
                var filterPropertyValue = utils.ObjectUtils.getValues(item, prop);
                this.addFilterItem(prop, filterPropertyValue, collection)
            }, this, collection));
        }, this));
        // ** rimosse le proprietà nel modo più brutale possibile
        var d = this.filterData[collection].items;
        _.remove(d, {
            propertyName: "registry/companyName"
        });
        _.remove(d, {
            propertyName: "registry/street"
        });
        _.remove(d, {
            propertyName: "registry/userName"
        });
        _.remove(d, {
            propertyName: "packingStatusId"
        });
        this.filterData[collection].items = d;
        // **
        this.filterData[collection].items = this._filterProperties(this.filterData[collection].items, collection);
        // console.log(this.filterData[collection]);
        return new sap.ui.model.json.JSONModel(this.filterData[collection]);
    }
    , addFilterItem: function (prop, value, collection) {
        if (_.isEmpty(value)) {
            // if(!_.isDate(value)) //Yet to adjust date filter
            // {
            // return;
            // }
            // value = utils.Formatter.formatDate(value);
            return;
        }
        if (!this.checkFilterExistence(collection)) {
            this.filterData[collection].items = [];
        }
        var parentItem = _.find(this.filterData[collection].items, {
            'propertyName': prop
        });
        if (!parentItem) {
            parentItem = {
                "propertyName": prop
                , "title": this._getTitle(prop)
                , "values": []
            };
            this.filterData[collection].items.push(parentItem);
        }
        if (!_.find(parentItem.values, {
                "value": value
            })) {
            parentItem.values.push({
                "value": value
                , "property": prop
                , "isSelected": false
            });
        }
        return;
    }
    , _filterProperties: function (list, collection) // list is an array of
        // properties
        {
            var result = [];
            for (var i = 0; i < list.length; i++) {
                if (list[i].values && list[i].values.length > 1) {
                    result.push(list[i]);
                }
            }
            if (collection === "customers") {
                if (result && result.length > 0) {
                    var text = "companyName2"
                    _.remove(result, {
                        propertyName: "registry/companyName2"
                    });
                }
            }
            if ((collection === "orders") && result && result.length > 0) {
                _.remove(result, {
                    propertyName: "trackingNr"
                });
            }
            if ((collection === "positions") && result && result.length > 0) {
                _.remove(result, {
                    propertyName: "catPosition"
                });
            }
            return result;
        }
    , _getTitle: function (prop) {
        if (prop.indexOf("/") !== -1) {
            var barIdx = prop.lastIndexOf("/");
        }
        if (barIdx && barIdx < 0) {
            return prop;
        }
        var text = prop.substring(barIdx + 1, prop.length);
        if (prop.indexOf("/") !== barIdx) {
            text = prop.substring(0, prop.indexOf("/")) + text;
        }
        return model.i18n._getLocaleText(text);
    }
}