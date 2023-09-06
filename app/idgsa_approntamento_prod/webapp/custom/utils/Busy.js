jQuery.sap.declare("utils.Busy");

utils.Busy = {

  busyDialog: new sap.m.BusyDialog(),

  show: function (text) {
    if (text) {
      var message = text;
      utils.Busy.busyDialog.setText(message);
    }
    utils.Busy.busyDialog.open();
    console.log("show busy from:" + text);
    // sap.ui.core.BusyIndicator.show();
  },

  hide: function (text) {
    utils.Busy.busyDialog.setText("");
    utils.Busy.busyDialog.close();
    console.log(text);
    // sap.ui.core.BusyIndicator.hide();
  }
};