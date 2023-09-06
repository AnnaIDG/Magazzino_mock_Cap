jQuery.sap.declare("model.ProblemModel");
jQuery.sap.require("utils.ProblemSerializer");

model.ProblemModel = {
		/**
		 * @memberOf model.ProblemModel
		 */
		createProblem : function(problem, noticeId){
			var defer = Q.defer();
			var problemToSap = utils.ProblemSerializer.serializeModelItem2SAPItem(problem);
			problemToSap.Qmnum = noticeId;
			model.service.ODataService.createProblem(problemToSap,
				function(result){
					defer.resolve(result);
				}, function(error){
					defer.reject(error);
				});
			return defer.promise;
		},
		
		updateProblem : function(problem, noticeId){
			var defer = Q.defer();
			var problemToSap = utils.ProblemSerializer.serializeModelItem2SAPItem(problem);
			problemToSap.Qmnum = noticeId;
			model.service.ODataService.updateProblem(problemToSap, noticeId,
				function(result){
					defer.resolve(result);
				}, function(error){
					defer.reject(error);
				});
			return defer.promise;
		}
};