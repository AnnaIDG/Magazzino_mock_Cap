jQuery.sap.declare("utils.NoticeSerializer");
//
jQuery.sap.require("model.NoticeModel");
jQuery.sap.require("utils.ProblemSerializer");
utils.NoticeSerializer = {
	/**
	 * @memberOf utils.NoticeSerializer
	 */
	serializeSAPList2ModelList : function(list) {
		var result = [];
		if (list && list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				result.push(this.serializeSAPItem2ModelItem(list[i]));
			}
		}
		return result;
	},
	serializeSAPItem2ModelItem : function(item) {
		var notice = {};
        var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern:"HH:mm:ss"});
        var timeZoneOffset = new Date(0).getTimezoneOffset()*60*1000;
        
		notice.dataTel = (item && item.Ausvn) ? item.Ausvn : "";
//		notice.oraTel = (item && item.Auztv) ? item.Auztv : "";
        if (item && item.Auztv) {
            notice.oraTel = timeFormat.format(new Date(item.Auztv.ms + timeZoneOffset))
        } else {
            notice.oraTel = "";
        }
		notice.geoLoc = (item && item.ZzGeolocation) ? item.ZzGeolocation : "";
		notice.noticeId = (item && item.Qmnum) ? item.Qmnum : "";
		notice.priorityId = (item && item.Priok) ? item.Priok : "";
		notice.priorityDescr = (item && item.Priokx) ? item.Priokx : "";
		notice.noticeDate = (item && item.Qmdat) ? item.Qmdat : "";
		notice.requestStart = (item && item.Strmn) ? item.Strmn : "";
		notice.requestEnd = (item && item.Ltrmn) ? item.Ltrmn : "";
		notice.noticeState = (item && item.Userstatus) ? item.Userstatus : "";
		notice.requestUser = (item && item.Unamer) ? item.Unamer : "";
		notice.description = (item && item.Qmtxt) ? item.Qmtxt : "";
		notice.extendedDescription = (item && item.Txtet) ? item.Txtet : "";
		notice.techPlaceId = (item && item.Btpln) ? item.Btpln : "";
		notice.techPlaceDescr = (item && item.Pltxt) ? item.Pltxt : "";
		notice.equipmentId = (item && item.Bequi) ? item.Bequi : "";
		notice.equipmentDescr = (item && item.Eqktx) ? item.Eqktx : "";
		notice.noticeTypeId = (item && item.Qmart) ? item.Qmart : "Z1";
		notice.noticeTypeDescr = (item && item.Qmartx) ? item.Qmartx : "";
		notice.CGuid = (item && item.CGuid) ? item.CGuid : "";
        
        var oraInizioRichiesta = "";
        if (item && item.Strur) {
            if (typeof(item.Strur) === "string") {
                oraInizioRichiesta = /PT(\d+)H(\d+)M(\d+)S/.exec(item.Strur);
                notice.requestHourStart = oraInizioRichiesta ? oraInizioRichiesta[1] + ":" + oraInizioRichiesta[2] + ":" + oraInizioRichiesta[3] : "";
            } else {
                notice.requestHourStart = timeFormat.format(new Date(item.Strur.ms + timeZoneOffset))
            }
        } else {
            notice.requestHourStart = "";
        }
        var oraFineRichiesta = "";
        if (item && item.Ltrur) {
            if (typeof(item.Ltrur) === "string") {
                oraFineRichiesta = (item && item.Ltrur) ? /PT(\d+)H(\d+)M(\d+)S/.exec(item.Ltrur) : "";
                notice.requestHourEnd = oraFineRichiesta ? oraFineRichiesta[1] + ":" + oraFineRichiesta[2] + ":" + oraFineRichiesta[3] : "";
            } else {
                notice.requestHourEnd = timeFormat.format(new Date(item.Ltrur.ms + timeZoneOffset))
            }
        } else {
            notice.requestHourEnd = "";
        }
        
		// catalogElementTypeD
		notice.catalogElementTypeD = {};
		notice.catalogElementTypeD.catType = (item && item.Qmkat) ? item.Qmkat : "";
		notice.catalogElementTypeD.codeGruppe = (item && item.Qmgrp) ? item.Qmgrp : "";
		notice.catalogElementTypeD.id = (item && item.Qmcod) ? item.Qmcod : "";
		// 
		notice.problems = [];
		if (item && item.NotifProblemSet && item.NotifProblemSet.results) {
			for (var i = 0; i < item.NotifProblemSet.results.length; i++) {
				notice.problems.push(utils.ProblemSerializer.serializeSAPItem2ModelItem(item.NotifProblemSet.results[i]));
			}
		}
		notice.tasks = [];
		if (item && item.NotifTaskSet && item.NotifTaskSet.results) {
			for (var i = 0; i < item.NotifTaskSet.results.length; i++) {
				// TODO agganciare TaskSerializer
				var st = item.NotifTaskSet.results[i];
				var task = {};
				task.problemId = st && st.Fenum ? st.Fenum : "";
				task.taskId = st && st.Manum ? st.Manum : "";
				task.positionId = st && st.Qsmnum ? st.Qsmnum : "";
				task.type = ((st && st.Mncod) && st.Mngrp) ? (st.Mncod + " - " + st.Mngrp) : "";
				task.typeDescr = st && st.Matxt ? st.Matxt : "";
                task.TxtTaskgrp = task.TxtTaskgrp;
				task.state = {};
				task.state.key = st && st.Status ? st.Status : "";
				task.state.text = st.Status; // ?
				task.startDate = st && st.Pster ? st.Pster : "";
				var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern:"HH:mm:ss"});
				var timeZoneOffset = new Date(0).getTimezoneOffset()*60*1000;
				task.startTime = st && st.Pster && st.Pstur ? timeFormat.format(new Date(st.Pstur.ms + timeZoneOffset)) : "";
				task.endDate = st && st.Peter && (st.Status !== 'MIAP') ? st.Peter : "";
				//task.endTime = st && st.Petur ? st.Petur : "";
				task.endTime = st && st.Peter && st.Petur ? timeFormat.format(new Date(st.Petur.ms + timeZoneOffset)) : "";
				task.creationDate = st && st.Erdat ? st.Erdat : "";
				var problem = _.find(notice.problems, {
					problemId : task.problemId
				});
				if (problem) {
					task.object = problem.objectId;
					task.objectDescr = problem.object;
					task.problemDescr = problem.type;
					task.problem = problem.problemId;
				}
				//var description = st && st.TxtTaskcd ? st.TxtTaskcd : "";
				//if (st.Indtx == "X")
				//var	description = st.Txtem;
				
				//workaroud per il problema della descrizione vuota
				task.description = st && st.Txtem && st.Txtem!=="##"? st.Txtem : "";
				//FINE workaroud per il problema della descrizione vuota
				notice.tasks.push(task);
			}
		}
		notice.partners = [];
		if (item && item.NotifPartnerSet && item.NotifPartnerSet.results) {
			for (var i = 0; i < item.NotifPartnerSet.results.length; i++) {
				// TODO agganciare PartnerSerializer
				var spr = item.NotifPartnerSet.results[i];
				var partner = {};
				partner.noticeId = spr && spr.Qmnum ? spr.Qmnum : "";
				partner.partnerRole = spr && spr.Parvw ? spr.Parvw : "";
				partner.partnerRoleDescr = spr && spr.Vtext ? spr.Vtext : "";
				partner.counter = spr && spr.Counter ? spr.Counter : "";
				partner.name = spr && spr.Parnr ? spr.Parnr : "";
				notice.partners.push(partner);
			}
		}
		notice.documentation = [];
		notice.attachments = [];
        if (item && item.DocumentSet && item.DocumentSet.results) {
			for (var i = 0; i < item.DocumentSet.results.length; i++) {
				var docSet = item.DocumentSet.results[i];
				var doc = {};
				doc.docId = docSet && docSet.Qmnum ? docSet.Qmnum : "";
				doc.categoriaDoc = docSet && docSet.Dokar ? docSet.Dokar : "";
				doc.descrizioneCategoria = docSet && docSet.Dartxt ? docSet.Dartxt : "";
				doc.categoriaId = docSet && docSet.Doknr ? docSet.Doknr : "";
				doc.versioneId = docSet && docSet.Dokvr ? docSet.Dokvr : "";
				doc.progressivoId = docSet && docSet.Doktl ? docSet.Doktl : "";
				doc.sedeTecnicaId = docSet && docSet.Dokob ? docSet.Dokob : "";
				doc.descrizioneSedeTecnica = docSet && docSet.Ktxt ? docSet.Ktxt : "";
				doc.nomeFile = docSet && docSet.Filename ? docSet.Filename : "";
				doc.estensioneFile = docSet && docSet.Dappl ? docSet.Dappl : "";
				doc.idFile = docSet && docSet.PhObjid ? docSet.PhObjid : "";
                if (doc.sedeTecnicaId === 'IFLOT' || doc.sedeTecnicaId === 'EQUI') {
                    notice.documentation.push(doc);
                } else if (doc.sedeTecnicaId === 'PMQMEL') {
                    notice.attachments.push(doc);
                }
			}
		}
		return notice;
	},
	toSAP : function(n) {
		var s = {};
        //************campi obbligatori
        s.Qmtxt = n.description;
        s.Qmart = n.noticeTypeId ? n.noticeTypeId : "Z1";
        s.Qmkat = n.catalogElementTypeD.catType;
        //**************************************
        
		s.Qmnum = n.noticeId ? n.noticeId : "";
		s.Priok = n.priorityId;
        s.StatusInt = n.StatusInt;
		//************catalogElementTypeD
		s.Qmgrp = n.catalogElementTypeD.codeGruppe;
		s.Qmcod = n.catalogElementTypeD.id;
        s.Txtet = n.extendedDescription ? n.extendedDescription : "";
		//************************************
        
		//*************gestione richiedente diverso
		if (n.reqUser) {
			var reqU = n.reqUser;
		}
		s.Unamer = (reqU && reqU.user) ? reqU.user : n.requestUser;
		s.SmtpAddr = (reqU && reqU.mail) ? reqU.mail : "";
		s.TelNumber = (reqU && reqU.phone) ? reqU.phone : "";
		//************************************
		
		s.Btpln = n.techPlaceId ? n.techPlaceId : "";
		s.Bequi = n.equipmentId ? n.equipmentId : "";
		s.Guid = n.CGuid ? n.CGuid : "";
		s.Ausvn = n.dataTel ? n.dataTel : null;
		s.Auztv = n.oraTel ? (n.oraTel.indexOf("PT") > -1 ? n.oraTel : ("PT" + n.oraTel.split(":")[0] + "H" + n.oraTel.split(":")[1] + "M" + (n.oraTel.split(":")[2] ? n.oraTel.split(":")[2]  : "00") + "S")) : "PT00H00M00S";
		
		// problems
		var NotifProblemSet = [];
		if (n && n.problems) {
			for (var i = 0; i < n.problems.length; i++) {
				NotifProblemSet.push(utils.ProblemSerializer.serializeModelItem2SAPItem(n.problems[i]));
			}
		}
		// partners
		var NotifPartnerSet = [];
		if (n.partners && n.partners.length > 0) {
			for (var i = 0; i < n.partners.length; i++) {
				var el = n.partners[i];
				var pt = {};
				pt.Qmnum = el.noticeId;
				pt.Parvw = el.partnerRole; // Z0
				// pt.Vtext = el.partnerRoleDescr;
				// pt.Counter = el.counter;
				pt.Parnr = el.name; // svil01
				NotifPartnerSet.push(pt);
			}
		}
		// task
		var NotifTaskSet = [];
		if (n.tasks && n.tasks.length > 0) {
			for (var i = 0; i < n.tasks.length; i++) {
				var st = n.tasks[i];
				var t = {};
				t.Fenum = (st.problem).toString();
				t.Manum = "";
				// t.Qsmnum = st.positionId; //il numero di posizione relativa a
				// quel problema
				// t.Mncod = st.type;
				//t.Matxt = st.typeDescr;
                t.TxtTaskgrp = st.typeDescr;
				t.Qlfdpos = t.Fenum;
				t.Qsmnum = t.Qlfdpos;
				t.Mnkat = "2"; // tipo catalogo
				t.Mngrp = st.type.codeGruppe; // codeGruppe
				t.Mncod = st.type.id; // fecod
				t.Erdat = new Date(); // data creazione.
				// *****************************************
				t.Status = st.state.key;
				if (st.description !== "") {
					t.Txtem = st.description;
				} else {
					t.Txtem = "##";
				}
				NotifTaskSet.push(t);
			}
		}
		s.NotifProblemSet = NotifProblemSet;
		s.NotifPartnerSet = NotifPartnerSet;
		s.NotifTaskSet = NotifTaskSet;
		return s;
	}
};