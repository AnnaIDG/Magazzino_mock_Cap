jQuery.sap.declare("utils.Iban");

utils.Iban = {

  ibanToData : function(stringIban)
  {
//    if(stringIban.length!=27)
//    {
//      return "Error in format";
//    }
      if(!this.validateIBAN(stringIban))
      {
          return "-1";
      }
    
    var iban = {
      nation: "",
      control: "",
      cin: "",
      abi: "",
      cab: "",
      conto: ""
    };
    
    iban.nation = stringIban.substr(0,2);
    iban.control = stringIban.substr(2,2);
    iban.cin = stringIban.substr(4,1);
    iban.abi = stringIban.substr(5,5);
    iban.cab = stringIban.substr(10,5);
    iban.conto = stringIban.substr(15);
    
    return iban;
  },
//};


validateIBAN : function  (iban) {
    var newIban = iban.toUpperCase(),
        modulo = function (divident, divisor) {
            var cDivident = '';
            var cRest = '';

            for (var i in divident ) {
                var cChar = divident[i];
                var cOperator = cRest + '' + cDivident + '' + cChar;

                if ( cOperator < parseInt(divisor) ) {
                        cDivident += '' + cChar;
                } else {
                        cRest = cOperator % divisor;
                        if ( cRest == 0 ) {
                            cRest = '';
                        }
                        cDivident = '';
                }

            }
            cRest += '' + cDivident;
            if (cRest == '') {
                cRest = 0;
            }
            return cRest;
        };

    if (newIban.search(/^[A-Z]{2}/gi) < 0) {
        return false;
    }

    newIban = newIban.substring(4) + newIban.substring(0, 4);

    newIban = newIban.replace(/[A-Z]/g, function (match) {
        return match.charCodeAt(0) - 55;
    });

    return parseInt(modulo(newIban, 97), 10) === 1;
}

};