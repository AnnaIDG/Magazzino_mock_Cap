jQuery.sap.declare("utils.Util");

utils.Util = {
    
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
};