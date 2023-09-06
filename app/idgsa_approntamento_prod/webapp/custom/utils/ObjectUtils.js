jQuery.sap.declare("utils.ObjectUtils");

utils.ObjectUtils =
{
  // getKeys : function self(obj, path)
  getKeys : function (obj, path)
  {
    var propArray = [];

    if(!path)
    {
      path = "";
    }
    for(prop in obj)
    {
      if(_.isFunction(obj[prop]))
        continue;

      if(_.isObject(obj[prop]))
      {
        if(_.isArray(obj[prop]))
         {
           for(var i = 0; obj[prop] && (i< obj[prop].length); i++)
           {

            //  propArray = propArray.concat(self(obj[prop][i], prop+"/"+i+"/"));
             propArray = propArray.concat(this.getKeys(obj[prop][i], prop+"/"+i+"/"));

           }
         }
         else if(_.isDate(obj[prop]))
         {
            propArray.push(path+prop);
         }
         else
        {
            // propArray = propArray.concat(self(obj[prop], prop+"/"));
            propArray = propArray.concat(this.getKeys(obj[prop], prop+"/"));
         }
      }
      else
      {
        propArray.push(path+prop);
      }

    }
    return propArray;
  },

  getValues : function(obj, key)
  {
    var props = key.split("/");
    var result = obj;
    var i = 0;
    while(i<props.length)
    {
      result = result[props[i]];
      i++;
    }
    return result;
  },
    
    myNavBack: function(route, data) {
      var history = sap.ui.core.routing.History.getInstance();
      if (route === undefined) {
         window.history.go(-1);
         return;
      }
      var url = this.getURL(route, data);
      var direction = history.getDirection(url);
      if ("Backwards" === direction) {
         window.history.go(-1);
      } else {
         var replace = true; // otherwise we go backwards with a forward history
         this.navTo(route, data, replace);
      }
   },




}
