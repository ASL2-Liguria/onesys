jQuery(document).ready(function(){
	
	RIEPILOGO_PARAMETRI.init();
	RIEPILOGO_PARAMETRI.setEvents();
	
});

var RIEPILOGO_PARAMETRI = {
		
	init:function(){
		
		RIEPILOGO_PARAMETRI.setHeight();
		jQuery(".button").hide();
		
	},
	
	setEvents:function(){

		
	},
	
	setHeight:function(){
		
		//altezza meno il footer tabs
		var h = (parent.jQuery("#iFrameRiepilogo2").height())-24;
		
		jQuery("#divRiepilogo").height(h);
		jQuery("body").height(h);
	}

};

