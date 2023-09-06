jQuery.sap.declare("model.TaskModel");
jQuery.sap.require("utils.TaskSerializer");
jQuery.sap.require("utils.Formatter");

model.TaskModel = {
	/**
	 * @memberOf model.TaskModel
	 */
	createTask : function(task, noticeId) {
		var defer = Q.defer();
		var taskToSap = utils.TaskSerializer.serializeModelItem2SAPItem(task, noticeId);
		taskToSap.Qmnum = noticeId;
		// taskToSap.Fenum = problemId;

		var fSuccess = function(success) {
			defer.resolve(success);
		};
		var fError = function(err) {
			defer.reject(err);
		};
		fSuccess = _.bind(fSuccess, this);
		fError = _.bind(fError, this);

		model.service.ODataService.createTask(taskToSap, fSuccess, fError);

		return defer.promise;
	},

	updateTask : function(task, noticeId) {
		var defer = Q.defer();
		var taskToSap = utils.TaskSerializer.serializeModelItem2SAPItem(task);
		taskToSap.Qmnum = noticeId;
		var fSuccess = function(success) {
			defer.resolve(success);
		};
		var fError = function(err) {
			defer.reject(err);
		};
		fSuccess = _.bind(fSuccess, this);
		fError = _.bind(fError, this);

		model.service.ODataService.updateTask(taskToSap, noticeId, fSuccess, fError);

		return defer.promise;
	},

	closeTask : function(task, noticeId) {
		var defer = Q.defer();
		var taskToSap = {};
		taskToSap.Qmnum = noticeId;
		//taskToSap.Manum = (task.Manum).toString();
		taskToSap.Manum = (task.taskId).toString();
		taskToSap.Complete = "X";

		var fSuccess = function(success) {
			defer.resolve(success);
		};
		var fError = function(err) {
			defer.reject(err);
		};
		fSuccess = _.bind(fSuccess, this);
		fError = _.bind(fError, this);

		model.service.ODataService.closeTask(taskToSap, noticeId, fSuccess, fError);

		return defer.promise;
	},
	
	openTask : function(task, noticeId){
		var defer = Q.defer();
		var taskToSap = {};
		taskToSap.Qmnum = noticeId;
		taskToSap.Manum = (task.taskId).toString();
		taskToSap.Fenum = task.problemId;
		taskToSap.Qsmnum = (task.positionId).toString();
		//è possibile creare una correttiva senza tipo misura, per cui inseriamo una descrizione DUMMY
		taskToSap.Matxt = task.typeDescr != "" ? task.typeDescr : "Correttiva non definita";
		taskToSap.Pster = new Date();
		taskToSap.Pstur = "PT"+taskToSap.Pster.getHours()+"H"+taskToSap.Pster.getMinutes()+"M"+taskToSap.Pster.getSeconds()+"S";
		taskToSap.Mnkat = "2"; // tipo catalogo
		var type = task.type.split(" - ");
		taskToSap.Mngrp = type[1];//ZCIVL001
		taskToSap.Mncod = type[0];//"05"
		taskToSap.Qlfdpos = taskToSap.Fenum;
		taskToSap.TxtTaskcd = task.typeDescr;
		taskToSap.Txtem = task.description!="" ? task.description : "##";
		model.service.ODataService.updateTask(taskToSap, noticeId, function(success) {
			defer.resolve(success);
		}, function(err) {
			defer.reject(err);
		});

		return defer.promise;
	}
};