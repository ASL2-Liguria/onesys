$(document).ready(function(){
	WK_ALCOOL_FUMO.init();
	WK_ALCOOL_FUMO.setEvents();
	WK_ALCOOL_FUMO.filter();
	/*WK_ALCOOL_FUMO.initWkAlcoolFumo();*/
});

var WK_ALCOOL_FUMO = {
		init:function(){
			
		},
		setEvents:function(){
			
			
		},
		filter:function(){
			var Bind = new Array();
			var Value = new Array();

			Bind.push("IDEN_ANAG");
			Value.push(home.ASSISTITO.IDEN_ANAG);
					
			
		    var params = {
		    	"id"    : 'WK_ALCOOL_FUMO',
		        "aBind" : Bind,
		        "aVal"  : Value,
		        "container" : 'wkAlcoolFumo'
		    };
		    
		    //alert(JSON.stringify(params));
		    
		    $("div#wkAlcoolFumo").height( $('.contentTabs').outerHeight(true) - 50 );
		    var objWk = new WK(params);
		    objWk.loadWk();
			
		},
		
		
		/*initWkAlcoolFumo : function() {
			var params = {
				container : "wkAlcoolFumo",
				"id" : 'WK_ALCOOL_FUMO',
				"aBind" : [],
				"aVal" : []
			};

			$("div#wkAlcoolFumo").height("150px");
			var objWk = new WK(params);
			objWk.loadWk();
			
		},*/
};