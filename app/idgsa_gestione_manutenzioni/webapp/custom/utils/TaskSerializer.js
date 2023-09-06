jQuery.sap.declare("utils.TaskSerializer");
jQuery.sap.require("model.NoticeModel");
utils.TaskSerializer = {
    /**
     * @memberOf utils.TaskSerializer
     */
    serializeSAPItem2ModelItem: function (item) {
        var task = {};
        task.noticeId = (item && item.Qmnum) ? item.Qmnum : "";
        task.problemId = (item && item.Fenum) ? item.Fenum : "";
        task.id = (item && item.Manum) ? item.Manum : "";
        //task.description = (item && item.TxtTaskgrp) ? item.TxtTaskgrp : "";
        task.description = (item && item.Txtem) ? item.Txtem : "";
        task.startDate = (item && item.Pster) ? item.Pster : "";
        task.startTime = (item && item.Pstur) ? item.Pstur : "";
        task.endDate = (item && item.Peter) ? item.Peter : "";
        task.endTime = (item && item.Petur) ? item.Petur : "";
        task.typeId = (item && item.Mncod) ? item.Mncod : "";
        task.typeDescr = (item && item.TxtTaskcd) ? item.TxtTaskcd : "";
        return task;
    }
    , serializeModelItem2SAPItem: function (task, noticeId) {
        var t = {};
        t.Fenum = parseInt((task.problem)).toString();
        t.Manum = task.Manum ? (task.Manum).toString() : "";
        //è possibile creare una correttiva senza tipo misura, per cui inseriamo una descrizione DUMMY
        t.Matxt = task.typeDescr != "" ? task.typeDescr : "Correttiva non definita"; 
        
        t.Indtx = "X";
        if(task.description !== ""){
            t.Txtem = task.description;
        } else {
        	t.Txtem = "##";
        }
        t.TxtTaskcd = task.typeDescr;
        t.TxtTaskgrp = task.TxtTaskgrp;
        t.Qlfdpos = t.Fenum;
        t.Qsmnum = task.Qsmnum ? (task.Qsmnum).toString() : "";
        t.Mnkat = "2"; // tipo catalogo
        t.Mngrp = task.type; // codeGruppe
        t.Mncod = task.id; // fecod
//        t.Erdat = new Date(); // data creazione.
        if (model.service.LocalStorageService.local.get("startDateProblemSolving_" + noticeId)) {
            t.Erdat = new Date(model.service.LocalStorageService.local.get("startDateProblemSolving_" + noticeId));
        } else {
            t.Erdat = new Date(); // data creazione.
        }
         // data creazione.
        // *****************************************
        //t.Status = task.state.key;
        // t.startDate = st && st.Pster ? st.Pster : "";
        // t.startTime = st && st.Pstur ? st.Pstur : "";
        // t.endDate = st && st.Peter ? st.Peter : "";
        // t.endTime = st && st.Petur ? st.Petur : "";
        // t.creationDate = st && st.Erdat ? st.Erdat : "";
        // var problem = _.find(n.problems, {
        // problemId : t.problemId
        // });
        // if (problem) {
        // t.object = problem.objectId;
        // t.objectDescr = problem.object;
        // }
        // var description = st && st.TxtTaskcd ? st.TxtTaskcd : "";
        // if (st.Indtx == "X")
        // description += "\n" + st.Txtem;
        // t.description = description;
        // *********************************************
        return t;
    }
}
