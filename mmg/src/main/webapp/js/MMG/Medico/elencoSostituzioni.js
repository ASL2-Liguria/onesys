$(function() {
	NS_WK_SOSTITUZIONI.init();
});

var NS_WK_SOSTITUZIONI = {
		
		objWk : null,
		
		init: function() 
		{
			var h = $('.contentTabs').innerHeight() - 50;
			$("#divWk").height( h );
			
			this.objWk = new WK({
				"id"		: 'WK_MEDICO_SOSTITUZIONI',
    			"aBind"		:["iden_med_curante"],
    			"aVal"		:home.baseUser.IDEN_PER,
    			"container" : 'divWk'
			});
			this.objWk.loadWk();
			home.activeWk = this.objWk;
		},
		
		insert: function() 
		{
			home.NS_MMG.apri('MMG_SOSTITUZIONE_MEDICO');
		},
		
		update: function(pRow) 
		{
			home.NS_MMG.apri('MMG_SOSTITUZIONE_MEDICO', "&IDEN="+pRow[0].IDEN);
		},
		
		deleteRow : function(pRow) 
		{
			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
	            id:'UPD_CAMPO_STORICIZZA',
	            parameter:
	            {
	            	"pIdenPer" 		: { v : home.baseUser.IDEN_PER, t : 'N'},
					"pTabella" 		: { v : "MMG_MEDICO_SOSTITUZIONI", t : 'V'},
					"pNomeCampo" 	: { v : "ATTIVO", t : 'V'},
					"pIdenTabella" 	: { v : pRow[0].IDEN, t : 'N' },
					"pNewValore" 	: { v : "N", t : 'V' }
	            }
			}).done( function() {
				NS_WK_SOSTITUZIONI.objWk.refresh();
			});
		}
};