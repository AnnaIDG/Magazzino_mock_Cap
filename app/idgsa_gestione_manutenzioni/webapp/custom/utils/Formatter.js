jQuery.sap.declare("utils.Formatter");

utils.Formatter = {
		
		Date : 
		{
			_formats : ["dd-mm-yyyy", "yyyy/mm/dd", "dd/mm/yyyy", "yyyy/mm/dd"],
			
			formatDateTo:function(date, format)
			{
				if(!_.isDate(date))
				{
					date = new Date(date);
					if(!_.isDate(date) || date == "Invalid Date")
						return null;
				}
				
				if(!format || !_.find(utils.Formatter.Date._formats, _.bind(function(item){ return (format.toLowerCase() == item);},this)))
					return date;
				
				var parts ={
						"dd" : date.getDate(),
						"mm" : date.getMonth()+1,
						"yyyy" : date.getFullYear()
				}
				
				
				
				var order = utils.Formatter.Date._returnDatePartsOrder(format);
				var separator = utils.Formatter.Date._returnSeparator(format);
				
				var dateString = parts[order[0]]+separator+parts[order[1]]+separator+parts[order[2]];
				
				return dateString;
				
	
			},
            
            formatDateHourTo:function(date, format)
			{
				if(!_.isDate(date))
				{
					date = new Date(date);
					if(!_.isDate(date) || date == "Invalid Date")
						return null;
				}
				
				if(!format || !_.find(utils.Formatter.Date._formats, _.bind(function(item){ return (format.toLowerCase() == item);},this)))
					return date;
				
				var parts ={
						"dd" : date.getDate(),
						"mm" : date.getMonth()+1,
						"yyyy" : date.getFullYear(),
                        "hh" : date.getHours().toString().length === 1 ? "0"+date.getHours() : date.getHours(),
                        "mmm" : date.getMinutes().toString().length === 1 ? "0"+date.getMinutes() : date.getMinutes()
				}
				
				var order = utils.Formatter.Date._returnDatePartsOrder("dd-mm-yyyy-hh-mmm");
				var separator = utils.Formatter.Date._returnSeparator(format);
				
				var dateString = parts[order[0]]+separator+parts[order[1]]+separator+parts[order[2]] + " - " + parts[order[3]] + ":" + parts[order[4]];
				
				return dateString;
				
			},
			
			_returnDatePartsOrder : function(format)
			{
				if(!format)
					return ["dd", "mm", "yyyy"];
				
				format = format.toLowerCase();
				
				var split = format.split(/[/-]/);
				return _.map(split, function(item){return item.trim()});
				
			},
			
			_returnSeparator : function(format)
			{
				var separatorIndex = format.search(/[-/]/);
				return format[separatorIndex];
			},
			
			formatDateToSap:function(date)
			{
				if(!_.isDate(date))
				{
					date = new Date(date);
					if(!_.isDate(date))
						return null;
				}
				var jsonDate = date.toJSON();
				var resultDate = jsonDate.substring(0, jsonDate.length-5);
				
				return resultDate;
			}
		}
		

};