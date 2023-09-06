jQuery.sap.declare("utils.Message");

utils.Message =
{
  getSAPErrorMsg : function(err, text)
  {
    var error = JSON.parse(err.response.body);
    var errorDetails = error.error.innererror.errordetails;
    var msg = text;
    var detailsMsg = _.where(errorDetails, function(item){return (item.code.indexOf("IWBEP")>0)});
    for(var i = 0; detailsMsg && detailsMsg.length && i < detailsMsg.length; i++)
    {
      msg += ", " +detailsMsg[i].message;
    }
    sap.m.MessageToast.show(msg);
  },
  getError : function(err)
  {
    if(!err.response.body)
      return err.message;
    else {
      var error = JSON.parse(err.response.body);
      var msg = error.error.message.value;
      return msg;
    }
  },
  getCode : function(err)
  {
	  if(!err.response.body)
	      return "";
	    else {
	      var error = JSON.parse(err.response.body);
	      var msg = error.error.code ? error.error.code : "";
	      return msg;
	    }
  }
}
