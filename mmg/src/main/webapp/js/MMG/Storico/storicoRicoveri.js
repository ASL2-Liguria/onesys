jQuery(document).ready(function(){
	MMG_STORICO_RICOVERI.init();
	MMG_STORICO_RICOVERI.setEvents();
});

var MMG_STORICO_RICOVERI = {

	init:function(){
	
		$("#tabs-tabArchivio").hide();
		MMG_STORICO_RICOVERI.initWk();
		
	},
	
	setEvents:function(){

		
	},
	
	initWk:function(){
		
		$("#divWk").height("500px").width("900px");
	 	
		var Bind = new Array();
		var Value = new Array();

		Bind.push("iden_anag");
		Value.push(home.ASSISTITO.IDEN_ANAG);

	    var params = {
	    	"id_connection": 'WHALE',
	    	"id"    : 'STORICO_RICOVERI',
	        "aBind" : Bind,
	        "aVal"  : Value
	    };

	    var objWk = new WK(params);
	    objWk.loadWk();
		
	}
};