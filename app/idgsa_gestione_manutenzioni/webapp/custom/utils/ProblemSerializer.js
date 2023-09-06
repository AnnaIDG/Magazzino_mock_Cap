jQuery.sap.declare("utils.ProblemSerializer");
jQuery.sap.require("model.NoticeModel");


utils.ProblemSerializer = {
	/**
	 * @memberOf utils.ProblemSerializer
	 */
	serializeSAPItem2ModelItem : function(item){
		var problem = {};
		problem.problemId = (item && item.Fenum) ? item.Fenum : "";
		problem.positionId = (item && item.Posnr) ? item.Posnr : "";
		problem.typeId = (item && item.Fecod) ? (item.Fecod + " - " + item.Fegrp) : "";
		problem.type = (item && item.TxtProbcd) ? item.TxtProbcd : "";
		problem.objectId = (item && item.Oteil) ? item.Oteil : "";
		problem.object = (item && item.TxtObjptcd) ? item.TxtObjptcd : "";
		/*var description = (item && item.Fetxt) ? item.Fetxt : "";
		if (item.Indtx == "X")
			description += (description != "" ? "\n" : "") + item.Txtep;*/
		//workaroud per il problema della descrizione vuota
		problem.description = (item && item.Txtep && item.Txtep!=="##") ? item.Txtep : "";
		//FINE workaroud per il problema della descrizione vuota
		problem.codeGruppeTypeC = (item && item.Fegrp) ? item.Fegrp : "";
		problem.codeGruppeTypeB = (item && item.Otgrp) ? item.Otgrp : "";
		return problem;
	},
	
	serializeModelItem2SAPItem : function(item){
		var p = {};
		p.Fenum = (item.problemId).toString();
		p.Posnr = (item.problemId).toString();
		var z = item.typeId;
		p.Fecod = z.substr(0, item.typeId.indexOf("-") - 1);
		p.TxtProbcd = item.type;
		var sa = item.objectId.substr(0, item.objectId.indexOf("-") - 1);
		p.Oteil = sa != "" ? sa : item.objectId;
		p.TxtObjptcd = item.object;
		p.Fegrp = item.codeGruppeTypeC;
		p.Fekat = "C";
		p.Otkat = "B";
		p.Otgrp = item.codeGruppeTypeB;
		p.Indtx = "X";
		//workaroud per il problema della descrizione vuota
		if (item.description !== "") {
			p.Txtep = item.description;
		} else {
			p.Txtep = "##";
		}
		//FINE workaroud per il problema della descrizione vuota
		return p;
	}
};