jQuery.sap.declare("utils.SessionDataAdapter");

utils.SessionDataAdapter = {

  getModelObject : function(item)
  {
    var obj = {};
    for(var prop in item)
    {

      obj[prop] = item[prop];
      //**********************To Revise********************
      // if(item[prop] && !(new Date(obj[prop]) == 'Invalid Date') && isNaN(item[prop].toString()) && !_.isBoolean(item[prop]))
      // {
      //   obj[prop] = new Date(obj[prop]);
      // }
      //******************************************************
      if(prop.toUpperCase().indexOf("DATE")>=0 && prop.toUpperCase().indexOf("UPDATE")<0)
      {
        obj[prop]= new Date(obj[prop]);
      }
      else if(_.isArray(obj[prop]))
      {
        for(var i = 0; i< obj[prop].length ; i++)
        {
          obj[prop][i] = utils.SessionDataAdapter.getModelObject(obj[prop][i])
        }
      }
    }
    return obj;
  }

}
