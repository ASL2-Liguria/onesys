$(function()
{
	WK_ESENZIONI_PRESTAZIONI.init();
	WK_ESENZIONI_PRESTAZIONI.setEvents();
});

var WK_ESENZIONI_PRESTAZIONI = {
		
			objWk : null,
			
			init: function(){
				
				home.WK_ESENZIONI_PRESTAZIONI = this;

				WK_ESENZIONI_PRESTAZIONI.initWk();
			},
			
			setEvents:function(){
				
				$("#but_Cerca").on("click",function(){
					WK_ESENZIONI_PRESTAZIONI.refreshWk();
				});
				
				$("body").on("keyup",function(e) {
				    if(e.keyCode == 13) {
				    	WK_ESENZIONI_PRESTAZIONI.refreshWk();
				    }
				});
			},
			
			refreshWk: function(){
				
				var text = $("#Ricerca").val().toUpperCase();
				
				WK_ESENZIONI_PRESTAZIONI.objWk.filter({
					"id"        : 	'WK_ESENZIONI_PRESTAZIONI',
	    			"aBind"     :	["iden_esenzione", "text"],
	    			"aVal"      :	[$("#IDEN_ESENZIONE").val(), "%25"+text+"%25"],
	    			"container" : 	'WkPrestazioni'
				});
			},
			
			initWk: function(){
				
				var h = $('.contentTabs').innerHeight() - $('#fldwk').outerHeight(true) - $('#fldRicerca').outerHeight(true);
				$("#WkPrestazioni").height( h );
				
				this.objWk = new WK({
					"id"        : 	'WK_ESENZIONI_PRESTAZIONI',
	    			"aBind"     :	["iden_esenzione", "text"],
	    			"aVal"      :	[$("#IDEN_ESENZIONE").val(), "%25%25"],
	    			"container" : 	'WkPrestazioni'
				});
				this.objWk.loadWk();
				
			}
};