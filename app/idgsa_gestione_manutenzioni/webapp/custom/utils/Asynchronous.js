jQuery.sap.declare("utils.Asynchronous");

utils.Asynchronous = {
		
		asyncLoop : function(o){
			var i=-1; 
			var loop = function()
			{ 
				i++; 
				if(i==o.length)
				{
					o.callback(); 
					return;
				} 
				o.functionToLoop(loop, i); 
			} 
			loop();//init
			
		}
		
		
		
}