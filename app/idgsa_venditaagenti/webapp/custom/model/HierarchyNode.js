jQuery.sap.declare("model.HierarchyNode");
//jQuery.sap.require("model.persistence.Serializer");
model.HierarchyNode = ( function() {

  HierarchyNode = function(serializedData)
  {
    this.productId = "";
    this.salesOrg = "";
    this.distrCh = "";
    this.division = "";
    this.description = "";
    this.level="";
    this.items= [];
    this.parentId = "";
    this.productPicUrl = undefined;


    // I expect a file json with liv1Id, liv1Name, items:[{liv2Id, liv2Name}, {}, ..]


    this.addChildren = function(data)
    {
      this.items.push(data);
    };

    this.removeChildren = function(idChild)
    {
      var res = _.find(this.items, {productId:childId});
      if(!res)
        res = null;
      return res;
    };

    this.getModel  = function()
    {
      var model = new sap.ui.model.json.JSONModel(this);

      return model;
    };

    this.update = function(data)
    {
        for(var prop in data)
        {
          if(prop === "items")
          {
            if(data[prop] && data[prop].length > 0)
            {
              for(var i = 0; i< data[prop].length; i++)
              {
                this.addChildren(new model.HierarchyNode(data[prop][i]));
              }
            }
          }
          else
          {
            this[prop] = data[prop];
          }

        }
    };

  this.getId= function()
  {
    return this.productId;
  }

    if(serializedData)
    {
      this.update(serializedData);
    }

    return this;

  };
  return HierarchyNode;

})();
