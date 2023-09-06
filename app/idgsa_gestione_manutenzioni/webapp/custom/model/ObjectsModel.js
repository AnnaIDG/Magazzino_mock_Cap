jQuery.sap.declare("model.ObjectsModel");
jQuery.sap.require("utils.ObjectsSerializer");

model.ObjectsModel = {
    /**
     * @memberOf model.ObjectsModel
     */
    getObjectsList: function (params) {
        var defer = Q.defer();
        
        
        var fSuccess = function(result){
            var res = utils.ObjectsSerializer.fromSapItems(result);
            
                res = _.filter(result.results,function (item) {
                    return item.masterCategory == params.masterCategory;
                });
            
            
            defer.resolve(res);
        }
        
        var fError = function(err)
        {
            defer.reject(err);
        }

        $.getJSON("custom/model/mockData/ObjectsMock.json").then(fSuccess, fError);
            
        return defer.promise;    
        },
    
    getIssueTypeListForObject: function(params)
    {
        
        var defer = Q.defer();
         var fSuccess = function(result){
          //  var res = utils.issueTypeListForObject.fromSapItems(result);
            
                res = _.filter(result.results,function (item) {
                    return item.objectId == params.masterCat;
                });
            
            defer.resolve(res);
        }
        
        var fError = function(err)
        {
            defer.reject(err);
        }

        $.getJSON("custom/model/mockData/IssueTypes.json").then(fSuccess, fError);
            
        return defer.promise;    
    }
    

    
 };